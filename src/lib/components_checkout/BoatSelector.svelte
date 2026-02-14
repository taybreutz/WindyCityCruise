<script lang="ts">
	interface Boat {
		id: string;
		name: string;
		type: string;
		image: string;
		capacity: number;
		rate: number;
		tier: string;
	}

	interface Props {
		selectedBoatId: string;
		selectedDate: string;
		onSelectByBoat: (boat: Boat) => void;
		onSelectByDate: (boat: Boat, date: string, time: string) => void;
	}

	let { selectedBoatId, selectedDate, onSelectByBoat, onSelectByDate }: Props = $props();

	let date = $state('');

	$effect(() => {
		date = selectedDate ?? '';
	});

	const boats: Boat[] = [
		{
			id: '33-rinker',
			name: "33' Rinker Fiesta Vee",
			type: 'Sport Cruiser',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/33_Rinker_Fiesta_Vee_f8cd916e-85bc-481a-ab10-0f89d378431f.png?v=1709595569&width=3840',
			capacity: 10,
			rate: 200,
			tier: 'Sport'
		},
		{
			id: '37-sea-ray',
			name: "37' Sea Ray Sundancer",
			type: 'Sport Cruiser',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/1.jpg?v=1709597983&width=3840',
			capacity: 12,
			rate: 262.5,
			tier: 'Sport'
		},
		{
			id: '46-sea-ray',
			name: "46' Sea Ray Express",
			type: 'Premium Yacht',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/1_e454cb2e-4054-48a2-b88c-a05bfd3b530a.jpg?v=1709601158&width=3840',
			capacity: 15,
			rate: 325,
			tier: 'Premium'
		},
		{
			id: '50-sea-ray',
			name: "50' Sea Ray Sundancer",
			type: 'Premium Yacht',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/Copy_of_1.jpg?v=1709601859&width=3840',
			capacity: 18,
			rate: 275,
			tier: 'Premium'
		},
		{
			id: '55-sea-ray',
			name: "55' Sea Ray Sundancer",
			type: 'Luxe Yacht',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/393068.5f37d0254c05527fce4a49ac.xl.jpg?v=1709602387&width=3840',
			capacity: 20,
			rate: 337.5,
			tier: 'Luxe'
		},
		{
			id: '70-sea-ray',
			name: "70' Sea Ray Sun Sport",
			type: 'Luxe Yacht',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/1_1.jpg?v=1709603806&width=3840',
			capacity: 25,
			rate: 387.5,
			tier: 'Luxe'
		}
	];

	const hasDate = $derived(Boolean(date));
	const minDate = new Date().toISOString().split('T')[0];
	const testTimeSlots = ['10AM', '2:45PM', '7:30PM'];

	function getAvailableTimes(_boatId: string, dateValue: string): string[] {
		if (!dateValue) return [];
		return testTimeSlots;
	}

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
			{#each boats as boat}
				<article class="boat-card" class:selected={selectedBoatId === boat.id}>
					<div class="boat-image-container">
						<img src={boat.image} alt={boat.name} class="boat-image" />
						<span class="boat-tier">{boat.tier}</span>
					</div>

					<div class="boat-info">
						<div>
							<h3 class="boat-name">{boat.name}</h3>
							<p class="boat-meta">{boat.type} · Up to {boat.capacity} guests</p>
						</div>
						<p class="boat-rate">${boat.rate}<span>/hour</span></p>
					</div>

					{#if hasDate}
						<div class="slots-section">
							<p class="slots-label">Available Times</p>
							<div class="slots-grid">
								{#each getAvailableTimes(boat.id, date) as slot}
									<button
										type="button"
										class="slot-button"
										onclick={() => onSelectByDate(boat, date, slot)}
									>
										{slot}
									</button>
								{/each}
							</div>
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
