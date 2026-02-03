<script lang="ts">
	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let message = $state('');
	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		submitStatus = 'idle';

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// In production, you'd send this to your backend
		console.log({ name, email, phone, message });

		isSubmitting = false;
		submitStatus = 'success';

		// Reset form
		name = '';
		email = '';
		phone = '';
		message = '';
	}
</script>

<svelte:head>
	<title>Contact Us - Chicago Boating Hub</title>
</svelte:head>

<main class="page">
	<section class="content-section">
		<div class="content-container">
			<h1 class="page-title">Contact Us</h1>
			<p class="page-subtitle">
				Have questions about boat rentals, memberships, or our services? We'd love to hear from
				you.
			</p>

			<form class="contact-form" onsubmit={handleSubmit}>
				<div class="form-group">
					<label for="name" class="form-label">Name</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						class="form-input"
						placeholder="Your name"
					/>
				</div>

				<div class="form-group">
					<label for="email" class="form-label">Email <span class="required">*</span></label>
					<input
						type="email"
						id="email"
						bind:value={email}
						class="form-input"
						placeholder="your@email.com"
						required
					/>
				</div>

				<div class="form-group">
					<label for="phone" class="form-label">Phone number</label>
					<input
						type="tel"
						id="phone"
						bind:value={phone}
						class="form-input"
						placeholder="(555) 555-5555"
					/>
				</div>

				<div class="form-group">
					<label for="message" class="form-label">Message</label>
					<textarea
						id="message"
						bind:value={message}
						class="form-textarea"
						rows="5"
						placeholder="How can we help you?"
					></textarea>
				</div>

				<button type="submit" class="submit-button" disabled={isSubmitting}>
					{isSubmitting ? 'Sending...' : 'Send Message'}
				</button>

				{#if submitStatus === 'success'}
					<p class="success-message">Thank you! Your message has been sent.</p>
				{/if}

				{#if submitStatus === 'error'}
					<p class="error-message">Something went wrong. Please try again.</p>
				{/if}
			</form>
		</div>
	</section>
</main>

<style>
	.page {
		min-height: 100vh;
		background-color: var(--color-bg-primary);
	}

	.content-section {
		padding: var(--space-10) var(--space-5);
	}

	.content-container {
		max-width: 560px;
		margin: 0 auto;
	}

	.page-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.page-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-8) 0;
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.required {
		color: var(--color-error);
	}

	.form-input,
	.form-textarea {
		width: 100%;
		padding: var(--space-3) var(--space-4);
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		color: var(--input-text);
		background-color: var(--input-bg);
		border: 1px solid var(--input-border);
		border-radius: var(--radius-sm);
		transition:
			border-color var(--motion-duration-fast) var(--motion-ease-standard),
			box-shadow var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.form-input {
		height: var(--input-height);
	}

	.form-input::placeholder,
	.form-textarea::placeholder {
		color: var(--input-placeholder);
	}

	.form-input:focus,
	.form-textarea:focus {
		outline: none;
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 var(--focus-ring-width) var(--focus-ring-color);
	}

	.form-textarea {
		resize: vertical;
		min-height: 120px;
	}

	.submit-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		align-self: flex-start;
		min-height: var(--tap-target-min);
		padding: 0 var(--space-6);
		background-color: var(--button-primary-bg);
		color: var(--button-primary-text);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.submit-button:hover:not(:disabled) {
		opacity: var(--state-hover-opacity);
	}

	.submit-button:active:not(:disabled) {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	.submit-button:disabled {
		opacity: var(--state-disabled-opacity);
		cursor: not-allowed;
	}

	.success-message {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-success);
		margin: 0;
	}

	.error-message {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-error);
		margin: 0;
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: var(--font-size-xl);
		}
	}
</style>
