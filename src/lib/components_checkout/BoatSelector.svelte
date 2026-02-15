<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Item } from '$lib/types/database';
	import {
		getEffectiveAvailability,
		getAvailableStartTimes,
		formatTimeDisplay
	} from '$lib/availability';

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
		onSelectByDate: (boat: SelectedBoat, date: string, time: string) => void;
	}

	let { items, supabase, orgId, selectedBoatId, selectedDate, onSelectByBoat, onSelectByDate }: Props = $props();

	let date = $state('');
	let loadingSlots = $state<Record<string, boolean>>({});
	let slotsMap = $state<Record<string, string[]>>({});

	$effect(() => {
		date = selectedDate ?? '';
	});

	const hasDate = $derived(Boolean(date));
	const minDate = new Date().toISOString().split('T')[0];

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

	async function fetchAvailability(item: Item, dateValue: string): Promise<string[]> {
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

		// Check for enforced slots from date override
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

	$effect(() => {
		if (!date) {
			slotsMap = {};
			return;
		}

		const currentDate = date;
		slotsMap = {};

		for (const item of items) {
			loadingSlots[item.id] = true;
			fetchAvailability(item, currentDate).then((slots) => {
				slotsMap[item.id] = slots;
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
					Date
				</label>
				<input type="date" id="trip-date" class="config-input" bind:value={date} min={minDate} />
			</div>

			{#if hasDate}
				<div class="date-chip">
					<span>{formatDate(date)}</span>
					<button type="button" class="clear-date" onclick={clearDate}>Clear</button>
				</div>
			{:else}
				<p class="date-hint">
					Skip date search to jump directly to step 2 by selecting a boat on the right.
				</p>
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
							{:else if (slotsMap[item.id] ?? []).length === 0}
								<p class="slots-label slots-none">No availability</p>
							{:else}
								<p class="slots-label">Available Times</p>
								<div class="slots-grid">
									{#each slotsMap[item.id] ?? [] as slot (slot)}
										<button
											type="button"
											class="slot-button"
											onclick={() => onSelectByDate(boat, date, slot)}
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

	.boat-card.selected {
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 3px var(--color-accent-muted);
	}

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
