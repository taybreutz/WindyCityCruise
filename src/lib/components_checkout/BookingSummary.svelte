<script lang="ts">
	interface BookingData {
		boatName: string;
		boatType: string;
		boatImage: string;
		date: string;
		time: string;
		duration: number;
		guests: number;
		baseRate: number;
		captainFee: number;
		taxRate: number;
	}

	interface Props {
		booking: BookingData;
	}

	let { booking }: Props = $props();

	let promoCode = $state('');
	let promoApplied = $state(false);
	let promoDiscount = $state(0);

	const subtotal = $derived(booking.baseRate * booking.duration + booking.captainFee);
	const taxes = $derived(subtotal * booking.taxRate);
	const total = $derived(subtotal + taxes - promoDiscount);

	function applyPromo() {
		if (promoCode.toUpperCase() === 'BOATCREW10') {
			promoDiscount = subtotal * 0.1;
			promoApplied = true;
		}
	}
</script>

<aside class="booking-summary">
	<div class="boat-preview">
		<img src={booking.boatImage} alt={booking.boatName} class="boat-image" />
		<div class="boat-info">
			<h3 class="boat-name">{booking.boatName}</h3>
			<p class="boat-type">{booking.boatType}</p>
		</div>
	</div>

	<div class="trip-details">
		<div class="detail-row">
			<span class="detail-label">Date</span>
			<span class="detail-value">{booking.date}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Time</span>
			<span class="detail-value">{booking.time}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Duration</span>
			<span class="detail-value">{booking.duration} hours</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Guests</span>
			<span class="detail-value">{booking.guests} passengers</span>
		</div>
	</div>

	<div class="price-breakdown">
		<div class="price-row">
			<span class="price-label">
				${booking.baseRate}/hr × {booking.duration} hrs
			</span>
			<span class="price-value">${(booking.baseRate * booking.duration).toFixed(2)}</span>
		</div>
		<div class="price-row">
			<span class="price-label">Captain Fee</span>
			<span class="price-value">${booking.captainFee.toFixed(2)}</span>
		</div>
		<div class="price-row">
			<span class="price-label">Taxes & Fees</span>
			<span class="price-value">${taxes.toFixed(2)}</span>
		</div>
		{#if promoApplied}
			<div class="price-row promo-row">
				<span class="price-label">Promo (BOATCREW10)</span>
				<span class="price-value promo-value">-${promoDiscount.toFixed(2)}</span>
			</div>
		{/if}
		<div class="price-row total-row">
			<span class="price-label">Total</span>
			<span class="price-value total-value">${total.toFixed(2)}</span>
		</div>
	</div>

	{#if !promoApplied}
		<div class="promo-section">
			<button
				class="promo-toggle"
				onclick={() => {
					const input = document.getElementById('promo-input');
					if (input) input.classList.toggle('visible');
				}}
			>
				Have a promo code?
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>
			<div id="promo-input" class="promo-input-container">
				<input type="text" placeholder="Enter code" class="promo-input" bind:value={promoCode} />
				<button class="promo-apply" onclick={applyPromo}>Apply</button>
			</div>
		</div>
	{/if}

	<div class="support-section">
		<div class="support-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path
					d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
				/>
			</svg>
		</div>
		<div class="support-info">
			<span class="support-label">Need help?</span>
			<a href="tel:+18335552628" class="support-phone">(833) 555-BOAT</a>
		</div>
	</div>
</aside>

<style>
	.booking-summary {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		position: sticky;
		top: var(--space-5);
	}

	.boat-preview {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.boat-image {
		width: 80px;
		height: 60px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.boat-info {
		flex: 1;
	}

	.boat-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.boat-type {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.trip-details {
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--space-2);
	}

	.detail-row:last-child {
		margin-bottom: 0;
	}

	.detail-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.detail-value {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.price-breakdown {
		margin-bottom: var(--space-4);
	}

	.price-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--space-2);
	}

	.price-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.price-value {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.promo-row .promo-value {
		color: var(--color-accent-primary);
	}

	.total-row {
		margin-top: var(--space-3);
		padding-top: var(--space-3);
		border-top: 1px solid var(--color-border-default);
		margin-bottom: 0;
	}

	.total-row .price-label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.total-value {
		font-size: var(--font-size-lg) !important;
		font-weight: var(--font-weight-semibold) !important;
		color: var(--color-text-primary) !important;
	}

	.promo-section {
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.promo-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent-primary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.promo-toggle svg {
		width: 16px;
		height: 16px;
	}

	.promo-input-container {
		display: none;
		gap: var(--space-2);
		margin-top: var(--space-3);
	}

	.promo-input-container.visible {
		display: flex;
	}

	.promo-input {
		flex: 1;
		height: 36px;
		padding: 0 var(--space-3);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-primary);
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		outline: none;
	}

	.promo-input:focus {
		border-color: var(--color-accent-primary);
	}

	.promo-apply {
		height: 36px;
		padding: 0 var(--space-4);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent-primary);
		background-color: var(--color-accent-muted);
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.promo-apply:hover {
		opacity: var(--state-hover-opacity);
	}

	.support-section {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background-color: var(--color-accent-quiet);
		border-radius: var(--radius-md);
	}

	.support-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background-color: var(--color-accent-primary);
		border-radius: 50%;
	}

	.support-icon svg {
		width: 18px;
		height: 18px;
		color: var(--color-text-inverse);
	}

	.support-info {
		display: flex;
		flex-direction: column;
	}

	.support-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.support-phone {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-accent-primary);
		text-decoration: none;
	}

	.support-phone:hover {
		text-decoration: underline;
	}
</style>
