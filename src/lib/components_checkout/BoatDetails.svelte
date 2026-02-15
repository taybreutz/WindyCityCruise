<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Item } from '$lib/types/database';
	import {
		getEffectiveAvailability,
		getAvailableStartTimes,
		formatTimeDisplay
	} from '$lib/availability';

	interface BookingData {
		boatName: string;
		boatType: string;
		boatImage: string;
		capacity: number;
		date: string;
		time: string;
		duration: number;
		guests: number;
	}

	interface Props {
		booking: BookingData;
		showAvailabilityCalendar?: boolean;
		selectedDate?: string;
		selectedTime?: string;
		onDateChange?: (date: string) => void;
		onTimeSelect?: (time: string) => void;
		supabase: SupabaseClient;
		orgId: string;
		item: Item;
	}

	let {
		booking,
		showAvailabilityCalendar = false,
		selectedDate = '',
		selectedTime = '',
		onDateChange,
		onTimeSelect,
		supabase,
		orgId,
		item
	}: Props = $props();

	const amenities = [
		{ icon: 'speaker', label: 'Premium Sound System' },
		{ icon: 'bluetooth', label: 'Bluetooth Connectivity' },
		{ icon: 'cooler', label: 'Cooler with Ice' },
		{ icon: 'captain', label: 'Licensed Captain' }
	];

	const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const todayIso = new Date().toISOString().split('T')[0];
	let showCustomCalendar = $state(false);
	let loadingSlots = $state(false);

	function parseIsoDate(value: string): Date | null {
		if (!value) return null;
		const parsed = new Date(`${value}T00:00:00`);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}

	function toIsoDate(value: Date): string {
		const year = value.getFullYear();
		const month = String(value.getMonth() + 1).padStart(2, '0');
		const day = String(value.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	const today = new Date();
	let calendarMonth = $state(new Date(today.getFullYear(), today.getMonth(), 1));
	let availabilityDate = $state('');
	let availabilityTime = $state('');
	let availabilitySlots = $state<string[]>([]);

	$effect(() => {
		availabilityDate = selectedDate;
		availabilityTime = selectedTime;
		const parsed = parseIsoDate(selectedDate);
		if (parsed) {
			calendarMonth = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
		}
	});

	$effect(() => {
		if (showAvailabilityCalendar) {
			showCustomCalendar = true;
		}
	});

	// Fetch real availability when date changes
	$effect(() => {
		if (!availabilityDate) {
			availabilitySlots = [];
			return;
		}

		loadingSlots = true;
		fetchAvailabilitySlots(availabilityDate).then((slots) => {
			availabilitySlots = slots;
			loadingSlots = false;
		});
	});

	async function fetchAvailabilitySlots(dateValue: string): Promise<string[]> {
		const [
			{ data: itemSeasons },
			{ data: seasonTemplates },
			{ data: pricingRules },
			{ data: overrides },
			{ data: bookings }
		] = await Promise.all([
			supabase.from('item_seasons').select('*').eq('item_id', item.id),
			supabase.from('season_templates').select('*').eq('org_id', orgId).eq('is_active', true),
			supabase.from('pricing_rules').select('*').eq('org_id', orgId),
			supabase.from('item_date_overrides').select('*').eq('item_id', item.id).eq('override_date', dateValue),
			supabase.from('bookings').select('*').eq('item_id', item.id).eq('trip_date', dateValue).neq('status', 'cancelled')
		]);

		const override = overrides?.[0] ?? null;

		const eff = getEffectiveAvailability(
			item,
			itemSeasons ?? [],
			seasonTemplates ?? [],
			pricingRules ?? [],
			override,
			dateValue
		);

		if (!eff.available || eff.availableDurations.length === 0) return [];

		let enforcedSlots: string[] = [];
		if (override?.override_group_id) {
			const { data: overrideSlots } = await supabase
				.from('item_date_override_slots')
				.select('start_time')
				.eq('item_id', item.id)
				.eq('override_date', dateValue);
			enforcedSlots = (overrideSlots ?? []).map((s) => s.start_time);
		}

		const duration = eff.availableDurations[0];
		return getAvailableStartTimes(
			dateValue,
			duration,
			eff.operatingStart,
			eff.operatingEnd,
			bookings ?? [],
			item.quantity,
			eff.bufferMinutes,
			enforcedSlots
		);
	}

	const calendarDays = $derived.by(() => {
		const year = calendarMonth.getFullYear();
		const month = calendarMonth.getMonth();
		const firstDay = new Date(year, month, 1);
		const startOffset = firstDay.getDay();
		const gridStart = new Date(year, month, 1 - startOffset);

		return Array.from({ length: 42 }, (_, index) => {
			const day = new Date(gridStart);
			day.setDate(gridStart.getDate() + index);
			const iso = toIsoDate(day);
			return {
				iso,
				label: day.getDate(),
				isCurrentMonth: day.getMonth() === month,
				isPast: iso < todayIso,
				isSelected: iso === availabilityDate
			};
		});
	});

	const monthLabel = $derived(
		calendarMonth.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})
	);

	function goToPreviousMonth() {
		calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
	}

	function goToNextMonth() {
		calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
	}

	function selectDate(iso: string, disabled: boolean) {
		if (disabled) return;
		availabilityDate = iso;
		availabilityTime = '';
		onDateChange?.(iso);
		onTimeSelect?.('');
	}

	function selectTime(time: string) {
		availabilityTime = time;
		onTimeSelect?.(time);
	}

	function formatAvailabilityDate(value: string): string {
		const parsed = parseIsoDate(value);
		if (!parsed) return '';
		return parsed.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function openAvailabilityCalendar() {
		showCustomCalendar = true;
	}
</script>

<div class="boat-details">
	<p class="step-intro">
		<strong>Almost there!</strong> Review your boat selection and continue to enter your details.
	</p>

	<div class="boat-card">
		<div class="boat-image-container">
			<img src={booking.boatImage} alt={booking.boatName} class="boat-image" />
		</div>

		<div class="boat-info-section">
			<div class="boat-header">
				<h2 class="boat-name">{booking.boatName}</h2>
				<p class="boat-meta">{booking.boatType} · Up to {booking.capacity} guests</p>
			</div>

			<div class="trip-schedule">
				<div class="schedule-item">
					<span class="schedule-label">CHECK-IN</span>
					<span class="schedule-value">{booking.date || 'Choose date below'}</span>
				</div>
				<div class="schedule-item">
					<span class="schedule-label">DEPARTURE</span>
					<span class="schedule-value">{booking.time ? formatTimeDisplay(booking.time) : 'Choose time below'}</span>
				</div>
				<div class="schedule-item">
					<span class="schedule-label">DURATION</span>
					<span class="schedule-value">{booking.duration} hours</span>
				</div>
				<div class="schedule-item">
					<span class="schedule-label">GUESTS</span>
					<span class="schedule-value">{booking.guests}</span>
				</div>
			</div>

			<button type="button" class="change-button" onclick={openAvailabilityCalendar}>Change</button>
		</div>
	</div>

	{#if showCustomCalendar}
		<div class="availability-card">
			<div class="availability-header">
				<h3 class="availability-title">Custom Availability Calendar</h3>
				<p class="availability-subtitle">Pick your date and a departure time for this boat.</p>
			</div>

			<div class="calendar-shell">
				<div class="calendar-header">
					<button type="button" class="calendar-nav" onclick={goToPreviousMonth} aria-label="Previous month">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>
					<span class="calendar-month">{monthLabel}</span>
					<button type="button" class="calendar-nav" onclick={goToNextMonth} aria-label="Next month">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>
				</div>

				<div class="weekday-row">
					{#each weekdayLabels as weekday (weekday)}
						<span class="weekday-label">{weekday}</span>
					{/each}
				</div>

				<div class="calendar-grid">
					{#each calendarDays as day (day.iso)}
						<button
							type="button"
							class="calendar-day"
							class:outside={ !day.isCurrentMonth}
							class:selected={day.isSelected}
							disabled={day.isPast}
							onclick={() => selectDate(day.iso, day.isPast)}
						>
							{day.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="time-slots">
				{#if availabilityDate}
					{#if loadingSlots}
						<p class="time-slots-label">Loading availability...</p>
					{:else if availabilitySlots.length === 0}
						<p class="time-slots-label">No availability on {formatAvailabilityDate(availabilityDate)}</p>
					{:else}
						<p class="time-slots-label">Available on {formatAvailabilityDate(availabilityDate)}</p>
						<div class="time-slots-grid">
							{#each availabilitySlots as slot (slot)}
								<button
									type="button"
									class="time-slot"
									class:selected={slot === availabilityTime}
									onclick={() => selectTime(slot)}
								>
									{formatTimeDisplay(slot)}
								</button>
							{/each}
						</div>
					{/if}
				{:else}
					<p class="time-slots-placeholder">Select a date to see available departure times.</p>
				{/if}
			</div>
		</div>
	{/if}

	<div class="amenities-section">
		<h3 class="amenities-title">Included Amenities</h3>
		<div class="amenities-grid">
			{#each amenities as amenity (amenity.label)}
				<div class="amenity-item">
					<div class="amenity-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					</div>
					<span class="amenity-label">{amenity.label}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="notice-card">
		<svg class="notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" />
			<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
		<div class="notice-content">
			<p class="notice-text">
				The primary guest must be 21 or older and present a valid Photo ID at check-in.
			</p>
		</div>
	</div>
</div>

<style>
	.boat-details {
		background-color: var(--color-bg-primary);
	}

	.step-intro {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-5) 0;
	}

	.step-intro strong {
		color: var(--color-text-primary);
	}

	.boat-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		overflow: hidden;
		margin-bottom: var(--space-5);
	}

	.boat-image-container {
		width: 100%;
		height: 240px;
		overflow: hidden;
	}

	.boat-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.boat-info-section {
		padding: var(--space-5);
	}

	.boat-header {
		margin-bottom: var(--space-4);
	}

	.boat-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.boat-meta {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.trip-schedule {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-md);
	}

	.schedule-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		text-align: center;
	}

	.schedule-label {
		font-family: var(--font-family-system);
		font-size: 10px;
		font-weight: var(--font-weight-medium);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.schedule-value {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.change-button {
		margin-top: var(--space-3);
		padding: 0;
		background: none;
		border: none;
		color: var(--color-accent-primary);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
	}

	.change-button:hover {
		text-decoration: underline;
	}

	.availability-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-bottom: var(--space-5);
	}

	.availability-header {
		margin-bottom: var(--space-4);
	}

	.availability-title {
		margin: 0 0 var(--space-1) 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.availability-subtitle {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.calendar-shell {
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-3);
		background-color: var(--color-bg-primary);
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.calendar-month {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.calendar-nav {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: var(--color-bg-secondary);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.calendar-nav svg {
		width: 16px;
		height: 16px;
	}

	.weekday-row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		margin-bottom: var(--space-2);
	}

	.weekday-label {
		text-align: center;
		font-family: var(--font-family-system);
		font-size: 11px;
		color: var(--color-text-tertiary);
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
	}

	.calendar-day {
		height: 34px;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		background-color: var(--color-bg-primary);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.calendar-day:hover:not(:disabled) {
		border-color: var(--color-accent-primary);
	}

	.calendar-day.outside {
		color: var(--color-text-tertiary);
		background-color: var(--color-bg-secondary);
	}

	.calendar-day.selected {
		border-color: var(--color-accent-primary);
		background-color: var(--color-accent-quiet);
		color: var(--color-accent-primary);
		font-weight: var(--font-weight-semibold);
	}

	.calendar-day:disabled {
		cursor: not-allowed;
		opacity: var(--state-disabled-opacity);
	}

	.time-slots {
		margin-top: var(--space-4);
	}

	.time-slots-label {
		margin: 0 0 var(--space-2) 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.time-slots-placeholder {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
	}

	.time-slots-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--space-2);
	}

	.time-slot {
		height: 34px;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
	}

	.time-slot:hover {
		border-color: var(--color-accent-primary);
	}

	.time-slot.selected {
		border-color: var(--color-accent-primary);
		background-color: var(--color-accent-quiet);
		color: var(--color-accent-primary);
		font-weight: var(--font-weight-semibold);
	}

	.amenities-section {
		margin-bottom: var(--space-5);
	}

	.amenities-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.amenities-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	.amenity-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.amenity-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		color: var(--color-accent-primary);
	}

	.amenity-icon svg {
		width: 18px;
		height: 18px;
	}

	.amenity-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.notice-card {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-5);
	}

	.notice-icon {
		width: 20px;
		height: 20px;
		color: var(--color-text-tertiary);
		flex-shrink: 0;
	}

	.notice-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: var(--line-height-relaxed);
	}

	@media (max-width: 800px) {
		.trip-schedule {
			grid-template-columns: repeat(2, 1fr);
		}

		.time-slots-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 600px) {
		.amenities-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
