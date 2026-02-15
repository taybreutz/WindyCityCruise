<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Item } from '$lib/types/database';
	import {
		getEffectiveAvailability,
		getAvailableStartTimes,
		formatTimeDisplay
	} from '$lib/availability';
	import type { Booking, ItemDateOverride } from '$lib/types/database';

	interface SelectedBoat {
		id: string;
		name: string;
		type: string;
		image: string;
		capacity: number;
		rate: number;
		tier: string;
		item: Item;
	}

	interface Props {
		items: Item[];
		supabase: SupabaseClient;
		orgId: string;
		selectedBoatId: string;
		selectedDate: string;
		onSelectByBoat: (boat: SelectedBoat) => void;
		onSelectByDate: (boat: SelectedBoat, date: string, time: string, duration: number) => void;
	}

	let {
		items,
		supabase,
		orgId,
		selectedBoatId,
		selectedDate,
		onSelectByBoat,
		onSelectByDate
	}: Props = $props();

	const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	let date = $state('');
	let showCustomCalendar = $state(false);
	let loadingSlots = $state<Record<string, boolean>>({});
	let slotsMap = $state<Record<string, string[]>>({});
	let itemAvailable = $state<Record<string, boolean>>({});
	let itemShortestDuration = $state<Record<string, number>>({});
	let calendarMonth = $state(new Date());
	let datePickerElement: HTMLDivElement | null = null;

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
	const todayIso = toIsoDate(today);
	const hasDate = $derived(Boolean(date));
	const monthLabel = $derived(
		calendarMonth.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})
	);
	const canGoToPreviousMonth = $derived(
		calendarMonth.getFullYear() > today.getFullYear() ||
			(calendarMonth.getFullYear() === today.getFullYear() &&
				calendarMonth.getMonth() > today.getMonth())
	);
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
				isSelected: iso === date
			};
		});
	});

	$effect(() => {
		date = selectedDate ?? '';
		const parsed = parseIsoDate(selectedDate);
		if (parsed) {
			calendarMonth = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
		} else {
			calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		}
	});

	$effect(() => {
		if (!showCustomCalendar) return;

		const handlePointerDown = (event: PointerEvent) => {
			if (
				datePickerElement &&
				event.target instanceof Node &&
				!datePickerElement.contains(event.target)
			) {
				showCustomCalendar = false;
			}
		};

		document.addEventListener('pointerdown', handlePointerDown);
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
		};
	});

	function toSelectedBoat(item: Item): SelectedBoat {
		return {
			id: item.id,
			name: item.name,
			type: item.tier,
			image: item.image_url ?? '',
			capacity: item.capacity,
			rate: item.hourly_rate,
			tier: item.tier,
			item
		};
	}

	async function fetchAvailability(item: Item, dateValue: string): Promise<void> {
		const [
			{ data: itemSeasons },
			{ data: seasonTemplates },
			{ data: pricingRules },
			{ data: overrides },
			{ data: bookingsData }
		] = await Promise.all([
			supabase.from('item_seasons').select('*').eq('item_id', item.id),
			supabase.from('season_templates').select('*').eq('org_id', orgId).eq('is_active', true),
			supabase.from('pricing_rules').select('*').eq('org_id', orgId),
			supabase
				.from('item_date_overrides')
				.select('*')
				.eq('item_id', item.id)
				.eq('override_date', dateValue),
			supabase
				.from('bookings')
				.select('*')
				.eq('item_id', item.id)
				.eq('trip_date', dateValue)
				.neq('status', 'cancelled')
		]);

		const override: ItemDateOverride | null = overrides?.[0] ?? null;

		const eff = getEffectiveAvailability(
			item,
			itemSeasons ?? [],
			seasonTemplates ?? [],
			pricingRules ?? [],
			override,
			dateValue
		);

		if (!eff.available || eff.availableDurations.length === 0) {
			slotsMap[item.id] = [];
			itemAvailable[item.id] = false;
			return;
		}

		itemAvailable[item.id] = true;
		const shortest = Math.min(...eff.availableDurations);
		itemShortestDuration[item.id] = shortest;

		let enforcedSlots: string[] = [];
		if (override?.override_group_id) {
			const { data: overrideSlots } = await supabase
				.from('item_date_override_slots')
				.select('start_time')
				.eq('item_id', item.id)
				.eq('override_date', dateValue);
			enforcedSlots = (overrideSlots ?? []).map((s: { start_time: string }) => s.start_time);
		}

		slotsMap[item.id] = getAvailableStartTimes(
			dateValue,
			shortest,
			eff.operatingStart,
			eff.operatingEnd,
			(bookingsData ?? []) as Booking[],
			item.quantity,
			eff.bufferMinutes,
			enforcedSlots,
			eff.slotIntervalMinutes
		);
	}

	$effect(() => {
		if (!date) {
			slotsMap = {};
			itemAvailable = {};
			itemShortestDuration = {};
			return;
		}

		const currentDate = date;
		slotsMap = {};
		itemAvailable = {};
		itemShortestDuration = {};

		for (const item of items) {
			loadingSlots[item.id] = true;
			fetchAvailability(item, currentDate).then(() => {
				loadingSlots[item.id] = false;
			});
		}
	});

	function formatDate(dateValue: string): string {
		if (!dateValue) return '';
		const parsed = new Date(`${dateValue}T00:00:00`);
		return parsed.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function clearDate() {
		date = '';
		showCustomCalendar = false;
	}

	function openDateCalendar() {
		showCustomCalendar = true;
	}

	function goToPreviousMonth() {
		if (!canGoToPreviousMonth) return;
		calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
	}

	function goToNextMonth() {
		calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
	}

	function selectDate(iso: string, disabled: boolean) {
		if (disabled) return;
		date = iso;
		showCustomCalendar = false;
	}
</script>

<div class="selector-layout">
	<aside class="search-panel" style="height: 100%;">
		<div class="search-panel-inner">
			<div class="section-header">
				<h2 class="section-title">Search By Date</h2>
				<p class="section-subtitle">Pick a date to view live time slots under each boat.</p>
			</div>

			<div class="config-group">
				<label for="trip-date" class="config-label">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
						<line x1="16" y1="2" x2="16" y2="6" />
						<line x1="8" y1="2" x2="8" y2="6" />
						<line x1="3" y1="10" x2="21" y2="10" />
					</svg>
					Select Date
				</label>
				<div class="date-picker" bind:this={datePickerElement}>
					<button
						type="button"
						id="trip-date"
						class="config-input custom-date-trigger"
						onclick={openDateCalendar}
						aria-haspopup="dialog"
						aria-expanded={showCustomCalendar}
					>
						<span>{hasDate ? formatDate(date) : 'Select date'}</span>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</button>

					{#if showCustomCalendar}
						<div class="custom-calendar" role="dialog" aria-label="Date picker calendar">
							<div class="calendar-header">
								<button
									type="button"
									class="calendar-nav"
									onclick={goToPreviousMonth}
									disabled={!canGoToPreviousMonth}
									aria-label="Previous month"
								>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<polyline points="15 18 9 12 15 6" />
									</svg>
								</button>
								<span class="calendar-month">{monthLabel}</span>
								<button
									type="button"
									class="calendar-nav"
									onclick={goToNextMonth}
									aria-label="Next month"
								>
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
										class:outside={!day.isCurrentMonth}
										class:selected={day.isSelected}
										disabled={day.isPast}
										onclick={() => selectDate(day.iso, day.isPast)}
									>
										{day.label}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>

			{#if hasDate}
				<div class="date-chip">
					<span>{formatDate(date)}</span>
					<button type="button" class="clear-date" onclick={clearDate}>Clear</button>
				</div>
			{:else}
				<p class="date-hint"></p>
			{/if}
		</div>
	</aside>

	<section class="boats-panel">
		<div class="section-header">
			<h2 class="section-title">Availability by Boat</h2>
			<p class="section-subtitle">
				{#if hasDate}
					Select a time slot to continue to step 2.
				{:else}
					Select a boat to continue to step 2.
				{/if}
			</p>
		</div>
		<div class="passenger-badge">Up to 13 passengers</div>

		<div class="boats-grid">
			{#each items as item (item.id)}
				{@const boat = toSelectedBoat(item)}
				<article class="boat-card" class:selected={selectedBoatId === item.id}>
					<div class="boat-image-container">
						{#if item.image_url}
							<img src={item.image_url} alt={item.name} class="boat-image" />
						{:else}
							<div class="boat-image-placeholder"></div>
						{/if}
						<span class="boat-tier">{item.tier}</span>
					</div>

					<div class="boat-info">
						<div>
							<h3 class="boat-name">{item.name}</h3>
							<p class="boat-meta">{item.tier} · Up to {item.capacity} guests</p>
						</div>
						<p class="boat-rate">${item.hourly_rate}<span>/hour</span></p>
					</div>

					{#if hasDate}
						<div class="slots-section">
							{#if loadingSlots[item.id]}
								<p class="slots-label">Loading availability...</p>
							{:else if !itemAvailable[item.id]}
								<p class="slots-label slots-none">No availability</p>
							{:else if (slotsMap[item.id] ?? []).length === 0}
								<p class="slots-label slots-none">No times available</p>
							{:else}
								<p class="slots-label">Available Times</p>
								<div class="slots-grid">
									{#each slotsMap[item.id] ?? [] as slot (slot)}
										<button
											type="button"
											class="slot-button"
											onclick={() => onSelectByDate(boat, date, slot, itemShortestDuration[item.id])}
										>
											{formatTimeDisplay(slot)}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{:else}
						<div class="boat-action">
							<button type="button" class="select-boat-button" onclick={() => onSelectByBoat(boat)}>
								Select Boat
							</button>
						</div>
					{/if}
				</article>
			{/each}
		</div>
	</section>
</div>

<style>
	.selector-layout {
		display: grid;
		grid-template-columns: 320px minmax(0, 1fr);
		gap: var(--space-5);
		align-items: start;
	}

	.search-panel-inner {
		position: sticky;
		top: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
	}

	.section-header {
		margin-bottom: var(--space-4);
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.section-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.config-group {
		display: grid;
		gap: var(--space-2);
	}

	.config-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	.config-label svg {
		width: 16px;
		height: 16px;
		color: var(--color-accent-primary);
	}

	.config-input {
		width: 100%;
		height: var(--input-height);
		padding: 0 var(--space-3);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		background-color: var(--color-bg-primary);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		outline: none;
		cursor: pointer;
		transition: border-color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.config-input:focus {
		border-color: var(--color-accent-primary);
	}

	.date-picker {
		position: relative;
	}

	.custom-date-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		text-align: left;
	}

	.custom-date-trigger svg {
		width: 16px;
		height: 16px;
		color: var(--color-text-tertiary);
		flex-shrink: 0;
	}

	.custom-calendar {
		margin-top: var(--space-2);
		padding: var(--space-3);
		background-color: var(--color-bg-primary);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-2);
	}

	.calendar-month {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.calendar-nav {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.calendar-nav:disabled {
		opacity: var(--state-disabled-opacity);
		cursor: not-allowed;
	}

	.calendar-nav svg {
		width: 16px;
		height: 16px;
	}

	.weekday-row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		margin-bottom: 6px;
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
		color: var(--color-text-primary);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
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
	}

	.calendar-day:disabled {
		opacity: var(--state-disabled-opacity);
		cursor: not-allowed;
	}

	.date-chip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-top: var(--space-4);
		padding: var(--space-2) var(--space-3);
		background-color: var(--color-accent-quiet);
		border: 1px solid var(--color-accent-muted);
		border-radius: var(--radius-md);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-primary);
	}

	.clear-date {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent-primary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.date-hint {
		margin: var(--space-4) 0 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
		line-height: var(--line-height-relaxed);
	}

	.boats-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
		padding: 0.5rem;
		border-right: 1px solid var(--color-border-subtle);
		border-radius: 1rem;
	}

	.passenger-badge {
		position: sticky;
		top: var(--space-5);
		z-index: 2;
		margin: 0 0 var(--space-3) auto;
		padding: 0.375rem 0.75rem;
		width: fit-content;
		border-radius: 999px;
		background-color: var(--color-accent-quiet);
		border: 1px solid var(--color-accent-muted);
		color: var(--color-accent-primary);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
	}

	.boat-card {
		display: grid;
		background-color: var(--color-bg-elevated);
		border: 2px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	/* .boat-card.selected {
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 3px var(--color-accent-muted);
	} */

	.boat-image-container {
		position: relative;
		width: 100%;
		height: 150px;
		overflow: hidden;
	}

	.boat-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.boat-image-placeholder {
		width: 100%;
		height: 100%;
		background-color: var(--color-bg-secondary);
	}

	.boat-tier {
		position: absolute;
		top: var(--space-2);
		left: var(--space-2);
		padding: var(--space-1) var(--space-2);
		background-color: rgba(10, 37, 64, 0.8);
		color: var(--color-text-inverse);
		font-family: var(--font-family-system);
		font-size: 10px;
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: var(--radius-sm);
	}

	.boat-info {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: var(--space-3);
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.boat-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.boat-meta {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
		margin: 0;
	}

	.boat-rate {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-accent-primary);
		white-space: nowrap;
	}

	.boat-rate span {
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-regular);
		color: var(--color-text-tertiary);
	}

	.slots-section {
		padding: var(--space-3);
	}

	.slots-label {
		margin: 0 0 var(--space-2) 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	.slots-none {
		color: var(--color-text-tertiary);
		font-style: italic;
	}

	.slots-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-2);
	}

	.slot-button {
		height: 34px;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition:
			border-color var(--motion-duration-fast) var(--motion-ease-standard),
			background-color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.slot-button:hover {
		border-color: var(--color-accent-primary);
		background-color: var(--color-accent-quiet);
	}

	.boat-action {
		padding: var(--space-3);
	}

	.select-boat-button {
		width: 100%;
		height: 36px;
		border: none;
		border-radius: var(--radius-sm);
		background-color: var(--button-primary-bg);
		color: var(--button-primary-text);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.select-boat-button:hover {
		opacity: var(--state-hover-opacity);
	}

	@media (max-width: 1080px) {
		.selector-layout {
			grid-template-columns: 1fr;
		}

		.search-panel-inner {
			position: static;
		}

		.passenger-badge {
			display: none;
		}

		.boats-grid {
			padding: 0;
			border-right: none;
			border-radius: 0;
		}
	}

	@media (max-width: 700px) {
		.boats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
