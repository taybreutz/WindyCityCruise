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
		showContactForm?: boolean;
		onContinue?: () => void;
		canContinue?: boolean;
	}

	let { booking, showContactForm = false, onContinue, canContinue = true }: Props = $props();

	let promoCode = $state('');
	let promoOpen = $state(false);
	let promoApplied = $state(false);
	let promoDiscount = $state(0);
	let contactName = $state('');
	let contactEmail = $state('');
	let contactPhone = $state('');

	const subtotal = $derived(booking.baseRate * booking.duration + booking.captainFee);
	const taxes = $derived(subtotal * booking.taxRate);
	const total = $derived(subtotal + taxes - promoDiscount);

	function applyPromo() {
		if (promoCode.toUpperCase() === 'BOATCREW10') {
			promoDiscount = subtotal * 0.1;
			promoApplied = true;
		}
	}

	function handleContinue() {
		if (typeof onContinue === 'function') {
			onContinue();
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
			<span class="detail-value">{booking.date || 'Select date'}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label">Time</span>
			<span class="detail-value">{booking.time || 'Select time'}</span>
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
			<button type="button" class="promo-toggle" onclick={() => (promoOpen = !promoOpen)}>
				<svg class="promo-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
					<line x1="7" y1="7" x2="7.01" y2="7" />
				</svg>
				Have a promo code?
				<svg class="promo-chevron" class:open={promoOpen} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>
			{#if promoOpen}
				<div class="promo-input-row">
					<input
						type="text"
						class="promo-input"
						placeholder="Enter code"
						bind:value={promoCode}
					/>
					<button type="button" class="promo-apply" onclick={applyPromo}>Apply</button>
				</div>
			{/if}
		</div>
	{:else}
		<div class="promo-applied">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
				<polyline points="22 4 12 14.01 9 11.01" />
			</svg>
			<span>Promo <strong>{promoCode.toUpperCase()}</strong> applied</span>
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
			<a href="tel:+14074550252" class="support-phone">(407) 455-0252</a>
		</div>
	</div>

	{#if showContactForm}
		<div class="contact-section">
			<div class="contact-field">
				<label class="contact-label" for="checkout-contact-name">Name</label>
				<input
					id="checkout-contact-name"
					class="contact-input"
					type="text"
					placeholder="Enter your name"
					bind:value={contactName}
				/>
			</div>
			<div class="contact-field">
				<label class="contact-label" for="checkout-contact-email">Email</label>
				<input
					id="checkout-contact-email"
					class="contact-input"
					type="email"
					placeholder="Enter your email"
					bind:value={contactEmail}
				/>
			</div>
			<div class="contact-field">
				<label class="contact-label" for="checkout-contact-phone">Phone</label>
				<input
					id="checkout-contact-phone"
					class="contact-input"
					type="tel"
					placeholder="Enter your phone"
					bind:value={contactPhone}
				/>
			</div>
			{#if typeof onContinue === 'function'}
				<button class="continue-button" onclick={handleContinue} disabled={!canContinue}>
					Continue to Guest Details
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</button>
			{/if}
		</div>
	{/if}
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
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent-primary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.promo-toggle:hover {
		opacity: var(--state-hover-opacity);
	}

	.promo-tag-icon {
		width: 14px;
		height: 14px;
	}

	.promo-chevron {
		width: 16px;
		height: 16px;
		transition: transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.promo-chevron.open {
		transform: rotate(180deg);
	}

	.promo-input-row {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
	}

	.promo-input {
		flex: 1;
		height: 36px;
		padding: 0 var(--space-3);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-primary);
		background-color: var(--color-bg-primary);
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
	}

	.promo-apply:hover {
		opacity: var(--state-hover-opacity);
	}

	.promo-applied {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		padding: var(--space-2) var(--space-3);
		background-color: var(--color-accent-quiet);
		border: 1px solid var(--color-accent-muted);
		border-radius: var(--radius-md);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-accent-primary);
	}

	.promo-applied svg {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.support-section {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background-color: var(--color-accent-quiet);
		border-radius: var(--radius-md);
	}

	.contact-section {
		display: grid;
		gap: var(--space-3);
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border-subtle);
	}

	.contact-field {
		display: grid;
		gap: var(--space-1);
	}

	.contact-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.contact-input {
		width: 100%;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-primary);
		background-color: var(--color-bg-primary);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		padding: var(--space-2) var(--space-3);
		transition:
			border-color var(--motion-duration-fast) var(--motion-ease-standard),
			box-shadow var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.contact-input::placeholder {
		color: var(--color-text-muted);
	}

	.contact-input:focus {
		outline: none;
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent-primary) 16%, transparent);
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
		margin-top: var(--space-4);
	}

	.continue-button:hover:not(:disabled) {
		opacity: var(--state-hover-opacity);
	}

	.continue-button:disabled {
		opacity: var(--state-disabled-opacity);
		cursor: not-allowed;
	}

	.continue-button:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.99);
	}

	.continue-button svg {
		width: 20px;
		height: 20px;
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
