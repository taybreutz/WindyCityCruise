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
		selectedTime: string;
		selectedDuration: number;
		selectedGuests: number;
		onContinue: (boat: Boat, date: string, time: string, duration: number, guests: number) => void;
	}

	let {
		selectedBoatId,
		selectedDate,
		selectedTime,
		selectedDuration,
		selectedGuests,
		onContinue
	}: Props = $props();

	let currentBoatId = $state('');
	let date = $state('');
	let time = $state('');
	let duration = $state(4);
	let guests = $state(6);

	// Sync props to local state when they change
	$effect(() => {
		if (selectedBoatId) currentBoatId = selectedBoatId;
	});
	$effect(() => {
		if (selectedDate) date = selectedDate;
	});
	$effect(() => {
		if (selectedTime) time = selectedTime;
	});
	$effect(() => {
		if (selectedDuration) duration = selectedDuration;
	});
	$effect(() => {
		if (selectedGuests) guests = selectedGuests;
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

	const timeSlots = [
		'9:00 AM',
		'10:00 AM',
		'11:00 AM',
		'12:00 PM',
		'1:00 PM',
		'2:00 PM',
		'3:00 PM',
		'4:00 PM',
		'5:00 PM',
		'6:00 PM'
	];

	const durations = [2, 3, 4, 5, 6, 8];

	const selectedBoat = $derived(boats.find((b) => b.id === currentBoatId));
	const canContinue = $derived(currentBoatId && date && time && duration && guests);

	function handleContinue() {
		if (selectedBoat && canContinue) {
			onContinue(selectedBoat, date, time, duration, guests);
		}
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="trip-config">
	<div class="section-header">
		<h2 class="section-title">Search By Date</h2>
	</div>

	<div class="config-grid">
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
			<input
				type="date"
				id="trip-date"
				class="config-input"
				bind:value={date}
				min={new Date().toISOString().split('T')[0]}
			/>
		</div>

		<!-- <div class="config-group">
			<label for="trip-time" class="config-label">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10" />
					<polyline points="12 6 12 12 16 14" />
				</svg>
				Departure Time
			</label>
			<select id="trip-time" class="config-input" bind:value={time}>
				<option value="">Select time</option>
				{#each timeSlots as slot}
					<option value={slot}>{slot}</option>
				{/each}
			</select>
		</div>

		<div class="config-group">
			<label for="trip-duration" class="config-label">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path
						d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
					/>
				</svg>
				Duration
			</label>
			<select id="trip-duration" class="config-input" bind:value={duration}>
				{#each durations as d}
					<option value={d}>{d} hours</option>
				{/each}
			</select>
		</div>

		<div class="config-group">
			<label for="trip-guests" class="config-label">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 00-3-3.87" />
					<path d="M16 3.13a4 4 0 010 7.75" />
				</svg>
				Guests
			</label>
			<select id="trip-guests" class="config-input" bind:value={guests}>
				{#each Array.from({ length: selectedBoat?.capacity || 12 }, (_, i) => i + 1) as g}
					<option value={g}>{g} {g === 1 ? 'guest' : 'guests'}</option>
				{/each}
			</select>
		</div> -->
	</div>
</div>

<div class="boat-selector">
	<div class="section-header">
		<h2 class="section-title">Select Your Boat</h2>
		<p class="section-subtitle">Choose from our premium fleet of vessels</p>
	</div>

	<div class="boats-grid">
		{#each boats as boat}
			<button
				class="boat-card"
				class:selected={currentBoatId === boat.id}
				onclick={() => (currentBoatId = boat.id)}
			>
				<div class="boat-image-container">
					<img src={boat.image} alt={boat.name} class="boat-image" />
					<span class="boat-tier">{boat.tier}</span>
				</div>
				<div class="boat-info">
					<h3 class="boat-name">{boat.name}</h3>
					<p class="boat-meta">{boat.type} · Up to {boat.capacity} guests</p>
					<p class="boat-rate">${boat.rate}<span>/hour</span></p>
				</div>
				{#if currentBoatId === boat.id}
					<div class="selected-badge">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					</div>
				{/if}
			</button>
		{/each}
	</div>

	{#if selectedBoat && date && time}
		<div class="selection-summary">
			<div class="summary-content">
				<img src={selectedBoat.image} alt={selectedBoat.name} class="summary-image" />
				<div class="summary-details">
					<h4 class="summary-boat">{selectedBoat.name}</h4>
					<p class="summary-trip">
						{formatDate(date)} at {time} · {duration} hours · {guests} guests
					</p>
				</div>
				<div class="summary-price">
					<span class="price-total">${(selectedBoat.rate * duration).toFixed(0)}</span>
					<span class="price-note">+ captain & fees</span>
				</div>
			</div>
		</div>
	{/if}

	<button class="continue-button" disabled={!canContinue} onclick={handleContinue}>
		Review Booking Details
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</svg>
	</button>
</div>

<style>
	.boat-selector {
		background-color: var(--color-bg-primary);
	}

	.section-header {
		margin-bottom: var(--space-5);
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

	.boats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.boat-card {
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-elevated);
		border: 2px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		overflow: hidden;
		cursor: pointer;
		text-align: left;
		transition: all var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.boat-card:hover {
		border-color: var(--color-border-default);
		transform: translateY(-2px);
		box-shadow: var(--shadow-2);
	}

	.boat-card.selected {
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 3px var(--color-accent-muted);
	}

	.boat-image-container {
		position: relative;
		width: 100%;
		height: 140px;
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
		padding: var(--space-3);
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
		margin: 0 0 var(--space-2) 0;
	}

	.boat-rate {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-accent-primary);
		margin: 0;
	}

	.boat-rate span {
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-regular);
		color: var(--color-text-tertiary);
	}

	.selected-badge {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-accent-primary);
		border-radius: 50%;
	}

	.selected-badge svg {
		width: 16px;
		height: 16px;
		color: var(--color-text-inverse);
	}

	.trip-config {
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		margin-bottom: var(--space-5);
	}

	.config-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-4);
	}

	.config-group {
		display: flex;
		flex-direction: column;
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

	.selection-summary {
		background-color: var(--color-accent-quiet);
		border: 1px solid var(--color-accent-muted);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-bottom: var(--space-5);
	}

	.summary-content {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.summary-image {
		width: 80px;
		height: 60px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.summary-details {
		flex: 1;
	}

	.summary-boat {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.summary-trip {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.summary-price {
		text-align: right;
	}

	.price-total {
		display: block;
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.price-note {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
	}

	.continue-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		height: var(--button-height);
		background-color: var(--button-primary-bg);
		color: var(--button-primary-text);
		font-family: var(--font-family-system);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.continue-button:hover:not(:disabled) {
		opacity: var(--state-hover-opacity);
	}

	.continue-button:disabled {
		opacity: var(--state-disabled-opacity);
		cursor: not-allowed;
	}

	.continue-button svg {
		width: 20px;
		height: 20px;
	}

	@media (max-width: 768px) {
		.boats-grid {
			grid-template-columns: 1fr;
		}

		.config-grid {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-3);
		}

		.summary-content {
			flex-wrap: wrap;
		}

		.summary-price {
			width: 100%;
			text-align: left;
			margin-top: var(--space-2);
		}
	}

	@media (max-width: 480px) {
		.config-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
