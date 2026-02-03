<script lang="ts">
	interface GuestData {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		specialRequests: string;
	}

	interface Props {
		onSubmit: () => void;
		onBack: () => void;
	}

	let { onSubmit, onBack }: Props = $props();

	let guest: GuestData = $state({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		specialRequests: ''
	});

	let cardNumber = $state('');
	let expiryDate = $state('');
	let cvv = $state('');
	let cardholderName = $state('');

	let errors: Record<string, string> = $state({});
	let touched: Record<string, boolean> = $state({});

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};

		if (!guest.firstName.trim()) newErrors.firstName = 'First name is required';
		if (!guest.lastName.trim()) newErrors.lastName = 'Last name is required';
		if (!guest.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
			newErrors.email = 'Please enter a valid email';
		}
		if (!guest.phone.trim()) {
			newErrors.phone = 'Phone number is required';
		} else if (!/^[\d\s\-\(\)]+$/.test(guest.phone) || guest.phone.replace(/\D/g, '').length < 10) {
			newErrors.phone = 'Please enter a valid phone number';
		}

		if (!cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
		if (!cardNumber.trim()) {
			newErrors.cardNumber = 'Card number is required';
		} else if (cardNumber.replace(/\s/g, '').length < 15) {
			newErrors.cardNumber = 'Please enter a valid card number';
		}
		if (!expiryDate.trim()) {
			newErrors.expiryDate = 'Expiry date is required';
		} else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
			newErrors.expiryDate = 'Use MM/YY format';
		}
		if (!cvv.trim()) {
			newErrors.cvv = 'CVV is required';
		} else if (cvv.length < 3) {
			newErrors.cvv = 'Please enter a valid CVV';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function handleSubmit() {
		touched = {
			firstName: true,
			lastName: true,
			email: true,
			phone: true,
			cardholderName: true,
			cardNumber: true,
			expiryDate: true,
			cvv: true
		};

		if (validateForm()) {
			onSubmit();
		}
	}

	function formatCardNumber(value: string): string {
		const cleaned = value.replace(/\D/g, '');
		const groups = cleaned.match(/.{1,4}/g);
		return groups ? groups.join(' ') : cleaned;
	}

	function formatExpiry(value: string): string {
		const cleaned = value.replace(/\D/g, '');
		if (cleaned.length >= 2) {
			return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
		}
		return cleaned;
	}
</script>

<div class="guest-payment-form">
	<button class="back-button" onclick={onBack}>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
		</svg>
		Back to Boat Details
	</button>

	<section class="form-section">
		<h2 class="section-title">Guest Information</h2>
		<p class="section-subtitle">Primary guest must be 21+ with valid Photo ID</p>

		<div class="form-row">
			<div class="form-group">
				<label for="firstName" class="form-label">First Name</label>
				<input
					type="text"
					id="firstName"
					class="form-input"
					class:error={touched.firstName && errors.firstName}
					bind:value={guest.firstName}
					onfocus={() => (touched.firstName = true)}
				/>
				{#if touched.firstName && errors.firstName}
					<span class="error-message">{errors.firstName}</span>
				{/if}
			</div>
			<div class="form-group">
				<label for="lastName" class="form-label">Last Name</label>
				<input
					type="text"
					id="lastName"
					class="form-input"
					class:error={touched.lastName && errors.lastName}
					bind:value={guest.lastName}
					onfocus={() => (touched.lastName = true)}
				/>
				{#if touched.lastName && errors.lastName}
					<span class="error-message">{errors.lastName}</span>
				{/if}
			</div>
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="email" class="form-label">Email Address</label>
				<input
					type="email"
					id="email"
					class="form-input"
					class:error={touched.email && errors.email}
					bind:value={guest.email}
					onfocus={() => (touched.email = true)}
				/>
				{#if touched.email && errors.email}
					<span class="error-message">{errors.email}</span>
				{/if}
			</div>
			<div class="form-group">
				<label for="phone" class="form-label">Phone Number</label>
				<input
					type="tel"
					id="phone"
					class="form-input"
					class:error={touched.phone && errors.phone}
					bind:value={guest.phone}
					onfocus={() => (touched.phone = true)}
					placeholder="(555) 555-5555"
				/>
				{#if touched.phone && errors.phone}
					<span class="error-message">{errors.phone}</span>
				{/if}
			</div>
		</div>

		<div class="form-group full-width">
			<label for="specialRequests" class="form-label">Special Requests (Optional)</label>
			<textarea
				id="specialRequests"
				class="form-textarea"
				bind:value={guest.specialRequests}
				placeholder="Celebrating a birthday, anniversary, or have any special needs?"
				rows="3"
			></textarea>
		</div>
	</section>

	<section class="form-section">
		<h2 class="section-title">Payment Method</h2>
		<div class="card-icons">
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png"
				alt="Visa"
				class="card-icon"
			/>
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png"
				alt="Mastercard"
				class="card-icon"
			/>
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/100px-American_Express_logo_%282018%29.svg.png"
				alt="Amex"
				class="card-icon"
			/>
		</div>

		<div class="form-group full-width">
			<label for="cardholderName" class="form-label">Cardholder Name</label>
			<input
				type="text"
				id="cardholderName"
				class="form-input"
				class:error={touched.cardholderName && errors.cardholderName}
				bind:value={cardholderName}
				onfocus={() => (touched.cardholderName = true)}
				placeholder="Name as it appears on card"
			/>
			{#if touched.cardholderName && errors.cardholderName}
				<span class="error-message">{errors.cardholderName}</span>
			{/if}
		</div>

		<div class="form-group full-width">
			<label for="cardNumber" class="form-label">Card Number</label>
			<input
				type="text"
				id="cardNumber"
				class="form-input"
				class:error={touched.cardNumber && errors.cardNumber}
				value={cardNumber}
				oninput={(e) => (cardNumber = formatCardNumber(e.currentTarget.value))}
				onfocus={() => (touched.cardNumber = true)}
				placeholder="1234 5678 9012 3456"
				maxlength="19"
			/>
			{#if touched.cardNumber && errors.cardNumber}
				<span class="error-message">{errors.cardNumber}</span>
			{/if}
		</div>

		<div class="form-row">
			<div class="form-group">
				<label for="expiryDate" class="form-label">Expiry Date</label>
				<input
					type="text"
					id="expiryDate"
					class="form-input"
					class:error={touched.expiryDate && errors.expiryDate}
					value={expiryDate}
					oninput={(e) => (expiryDate = formatExpiry(e.currentTarget.value))}
					onfocus={() => (touched.expiryDate = true)}
					placeholder="MM/YY"
					maxlength="5"
				/>
				{#if touched.expiryDate && errors.expiryDate}
					<span class="error-message">{errors.expiryDate}</span>
				{/if}
			</div>
			<div class="form-group">
				<label for="cvv" class="form-label">CVV</label>
				<input
					type="text"
					id="cvv"
					class="form-input"
					class:error={touched.cvv && errors.cvv}
					bind:value={cvv}
					onfocus={() => (touched.cvv = true)}
					placeholder="123"
					maxlength="4"
				/>
				{#if touched.cvv && errors.cvv}
					<span class="error-message">{errors.cvv}</span>
				{/if}
			</div>
		</div>
	</section>

	<div class="terms-notice">
		<p>
			By clicking "Complete Booking" you agree to our
			<a href="/terms">Terms & Conditions</a>,
			<a href="/privacy">Privacy Policy</a>, and
			<a href="/cancellation">Cancellation Policy</a>.
		</p>
	</div>

	<button class="submit-button" onclick={handleSubmit}>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0110 0v4" />
		</svg>
		Complete Booking
	</button>
</div>

<style>
	.guest-payment-form {
		background-color: var(--color-bg-primary);
	}

	.back-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		margin-bottom: var(--space-5);
		transition: color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.back-button:hover {
		color: var(--color-text-primary);
	}

	.back-button svg {
		width: 18px;
		height: 18px;
	}

	.form-section {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		margin-bottom: var(--space-5);
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.section-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-tertiary);
		margin: 0 0 var(--space-4) 0;
	}

	.card-icons {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.card-icon {
		height: 24px;
		width: auto;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.form-group.full-width {
		margin-bottom: var(--space-4);
	}

	.form-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	.form-input,
	.form-textarea {
		width: 100%;
		padding: var(--space-3);
		font-family: var(--font-family-system);
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		outline: none;
		transition: border-color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.form-input:focus,
	.form-textarea:focus {
		border-color: var(--color-accent-primary);
	}

	.form-input.error,
	.form-textarea.error {
		border-color: #dc3545;
	}

	.form-input::placeholder,
	.form-textarea::placeholder {
		color: var(--color-text-tertiary);
	}

	.form-textarea {
		resize: vertical;
		min-height: 80px;
	}

	.error-message {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: #dc3545;
	}

	.terms-notice {
		margin-bottom: var(--space-4);
	}

	.terms-notice p {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	.terms-notice a {
		color: var(--color-accent-primary);
		text-decoration: none;
	}

	.terms-notice a:hover {
		text-decoration: underline;
	}

	.submit-button {
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

	.submit-button:hover {
		opacity: var(--state-hover-opacity);
	}

	.submit-button:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.99);
	}

	.submit-button svg {
		width: 20px;
		height: 20px;
	}

	@media (max-width: 600px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
