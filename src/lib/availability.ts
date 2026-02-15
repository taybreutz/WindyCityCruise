import type {
	Item,
	SeasonTemplate,
	ItemSeason,
	ItemDateOverride,
	PricingRule,
	Booking
} from './types/database';

export interface EffectiveAvailability {
	available: boolean;
	reason?: 'out_of_season' | 'blocked' | 'inactive';
	operatingStart: string;
	operatingEnd: string;
	bufferMinutes: number;
	minimumHours: number;
	hourlyRate: number;
	availableDurations: number[];
	pricingRules: PricingRule[];
}

/**
 * Find the active season template for a given date,
 * using item_seasons junction + season_templates.
 */
export function findActiveSeason(
	itemSeasons: ItemSeason[],
	templates: SeasonTemplate[],
	date: string
): { itemSeason: ItemSeason; template: SeasonTemplate } | null {
	const dayOfWeek = new Date(date + 'T00:00:00').getDay();

	for (const is of itemSeasons) {
		if (!is.is_active) continue;
		const template = templates.find((t) => t.id === is.season_template_id);
		if (!template || !template.is_active) continue;

		const effectiveDays = is.days_of_week ?? template.days_of_week;
		if (
			date >= template.start_date &&
			date <= template.end_date &&
			effectiveDays.includes(dayOfWeek)
		) {
			return { itemSeason: is, template };
		}
	}
	return null;
}

/**
 * Resolve effective availability settings for a specific item + date.
 * Merges item defaults -> season template -> per-boat overrides -> date override.
 */
export function getEffectiveAvailability(
	item: Item,
	itemSeasons: ItemSeason[],
	templates: SeasonTemplate[],
	pricingRules: PricingRule[],
	override: ItemDateOverride | null,
	date: string
): EffectiveAvailability {
	if (!item.is_active) {
		return {
			available: false,
			reason: 'inactive',
			operatingStart: '09:00',
			operatingEnd: '20:00',
			bufferMinutes: item.buffer_minutes,
			minimumHours: item.minimum_hours,
			hourlyRate: item.hourly_rate,
			availableDurations: [],
			pricingRules: []
		};
	}

	if (override?.is_available === false) {
		return {
			available: false,
			reason: 'blocked',
			operatingStart: '09:00',
			operatingEnd: '20:00',
			bufferMinutes: item.buffer_minutes,
			minimumHours: item.minimum_hours,
			hourlyRate: item.hourly_rate,
			availableDurations: [],
			pricingRules: []
		};
	}

	const activeSeason = findActiveSeason(itemSeasons, templates, date);
	if (!activeSeason) {
		return {
			available: false,
			reason: 'out_of_season',
			operatingStart: '09:00',
			operatingEnd: '20:00',
			bufferMinutes: item.buffer_minutes,
			minimumHours: item.minimum_hours,
			hourlyRate: item.hourly_rate,
			availableDurations: [],
			pricingRules: []
		};
	}

	const { itemSeason, template } = activeSeason;
	const seasonRules = pricingRules.filter((r) => r.season_template_id === template.id);

	// Resolve hourly rate: per-boat season rate > item default
	const effectiveRate = itemSeason.base_hourly_rate ?? item.hourly_rate;

	// Resolve available durations: date override > per-boat override > template > empty
	const effectiveDurations =
		override?.available_durations ??
		itemSeason.available_durations ??
		template.available_durations ??
		[];

	return {
		available: true,
		operatingStart:
			override?.operating_start_time ??
			itemSeason.operating_start_time ??
			template.operating_start_time,
		operatingEnd:
			override?.operating_end_time ??
			itemSeason.operating_end_time ??
			template.operating_end_time,
		bufferMinutes: override?.buffer_minutes ?? item.buffer_minutes,
		minimumHours: override?.minimum_hours ?? item.minimum_hours,
		hourlyRate: effectiveRate,
		availableDurations: effectiveDurations,
		pricingRules: seasonRules
	};
}

/**
 * Calculate booking price using the pricing rule active at the booking's START TIME
 * for the entire duration (no proration).
 *
 * Priority:
 * 1. Date override flat rate -> used as-is for entire booking
 * 2. Date override multiplier -> applied to base rate for entire booking
 * 3. Time-of-day pricing rule matching start time -> highest priority wins
 * 4. Base rate -> fallback
 */
export function calculateBookingPrice(
	baseRate: number,
	startTime: string,
	durationHours: number,
	pricingRules: PricingRule[],
	dateOverride: ItemDateOverride | null
): number {
	// Date override pricing takes top priority
	if (dateOverride?.price_flat_rate) {
		return dateOverride.price_flat_rate * durationHours;
	}
	if (dateOverride?.price_multiplier) {
		return baseRate * dateOverride.price_multiplier * durationHours;
	}

	// Find the pricing rule that covers the start time (highest priority wins)
	const startMinutes = timeToMinutes(normalizeTimeFormat(startTime));
	const matchingRules = pricingRules.filter((rule) => {
		const ruleStart = timeToMinutes(rule.start_time);
		const ruleEnd = timeToMinutes(rule.end_time);
		return startMinutes >= ruleStart && startMinutes < ruleEnd;
	});

	if (matchingRules.length > 0) {
		const bestRule = matchingRules.reduce((a, b) => (a.priority > b.priority ? a : b));
		if (bestRule.rate_type === 'flat_hourly') {
			return bestRule.rate_value * durationHours;
		}
		// multiplier
		return baseRate * bestRule.rate_value * durationHours;
	}

	// Fallback to base rate
	return baseRate * durationHours;
}

/**
 * Check if a specific time range is available for booking.
 */
export function isTimeSlotAvailable(
	bookings: Booking[],
	date: string,
	startTime: string,
	endTime: string,
	quantity: number,
	bufferMinutes: number
): boolean {
	const count = countOverlappingBookings(bookings, date, startTime, endTime, bufferMinutes);
	return count < quantity;
}

/**
 * Resolve the effective hourly rate for a date.
 * Priority: override flat rate > override multiplier > base rate
 */
export function getEffectivePrice(
	baseRate: number,
	override: ItemDateOverride | null
): number {
	if (override?.price_flat_rate) return override.price_flat_rate;
	if (override?.price_multiplier) return baseRate * override.price_multiplier;
	return baseRate;
}

/**
 * Count how many bookings overlap with a given time range on a date,
 * accounting for buffer time.
 */
function countOverlappingBookings(
	bookings: Booking[],
	date: string,
	startTime: string,
	endTime: string,
	bufferMinutes: number
): number {
	const rangeStart = timeToMinutes(startTime);
	const rangeEnd = timeToMinutes(endTime);

	return bookings.filter((b) => {
		if (b.trip_date !== date) return false;
		if (b.status === 'cancelled') return false;

		const bookingStart = timeToMinutes(normalizeTimeFormat(b.trip_time));
		const bookingEnd = bookingStart + b.duration_hours * 60 + bufferMinutes;

		return bookingStart < rangeEnd && bookingEnd > rangeStart;
	}).length;
}

/**
 * Generate available start times for a given duration, operating window,
 * existing bookings, and enforced timeslots.
 *
 * If enforcedSlots is provided and non-empty, only those times are considered.
 * Otherwise, generates slots at 15-minute intervals within operating hours.
 */
export function getAvailableStartTimes(
	date: string,
	durationHours: number,
	operatingStart: string,
	operatingEnd: string,
	bookings: Booking[],
	quantity: number,
	bufferMinutes: number,
	enforcedSlots: string[] = []
): string[] {
	const opStart = timeToMinutes(normalizeTimeFormat(operatingStart));
	const opEnd = timeToMinutes(normalizeTimeFormat(operatingEnd));
	const durationMinutes = durationHours * 60;

	const candidateTimes: number[] = [];
	if (enforcedSlots.length > 0) {
		for (const slot of enforcedSlots) {
			const mins = timeToMinutes(normalizeTimeFormat(slot));
			if (mins >= opStart && mins + durationMinutes <= opEnd) {
				candidateTimes.push(mins);
			}
		}
	} else {
		// Generate at 15-minute intervals
		for (let t = opStart; t + durationMinutes <= opEnd; t += 15) {
			candidateTimes.push(t);
		}
	}

	return candidateTimes
		.filter((startMins) => {
			const endMins = startMins + durationMinutes;
			const startStr = minutesToTime(startMins);
			const endStr = minutesToTime(endMins);
			return isTimeSlotAvailable(bookings, date, startStr, endStr, quantity, bufferMinutes);
		})
		.map(minutesToTime);
}

/**
 * Convert minutes since midnight to "HH:MM" format.
 */
export function minutesToTime(minutes: number): string {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Format a "HH:MM" time string for display (e.g., "2:45 PM").
 */
export function formatTimeDisplay(time: string): string {
	const normalized = normalizeTimeFormat(time);
	const [h, m] = normalized.split(':');
	const hour = parseInt(h);
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
	return `${displayHour}:${m} ${ampm}`;
}

/**
 * Convert "HH:MM" time string to minutes since midnight.
 */
function timeToMinutes(time: string): number {
	const [h, m] = time.split(':').map(Number);
	return h * 60 + (m || 0);
}

/**
 * Normalize various time formats ("2:00 PM", "14:00") to "HH:MM".
 */
function normalizeTimeFormat(time: string): string {
	if (/^\d{2}:\d{2}$/.test(time)) return time;

	const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
	if (match) {
		let hour = parseInt(match[1]);
		const min = match[2];
		const period = match[3].toUpperCase();
		if (period === 'PM' && hour !== 12) hour += 12;
		if (period === 'AM' && hour === 12) hour = 0;
		return `${String(hour).padStart(2, '0')}:${min}`;
	}

	return time;
}
