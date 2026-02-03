<script lang="ts">
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
		onContinue: () => void;
	}

	let { booking, onContinue }: Props = $props();

	const amenities = [
		{ icon: 'speaker', label: 'Premium Sound System' },
		{ icon: 'bluetooth', label: 'Bluetooth Connectivity' },
		{ icon: 'cooler', label: 'Cooler with Ice' },
		{ icon: 'captain', label: 'Licensed Captain' }
	];
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
					<span class="schedule-value">{booking.date}</span>
				</div>
				<div class="schedule-item">
					<span class="schedule-label">DEPARTURE</span>
					<span class="schedule-value">{booking.time}</span>
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
		</div>
	</div>

	<div class="amenities-section">
		<h3 class="amenities-title">Included Amenities</h3>
		<div class="amenities-grid">
			{#each amenities as amenity}
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

	<button class="continue-button" onclick={onContinue}>
		Continue to Guest Details
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</svg>
	</button>
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

	.continue-button:hover {
		opacity: var(--state-hover-opacity);
	}

	.continue-button:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.99);
	}

	.continue-button svg {
		width: 20px;
		height: 20px;
	}

	@media (max-width: 600px) {
		.trip-schedule {
			grid-template-columns: repeat(2, 1fr);
		}

		.amenities-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
