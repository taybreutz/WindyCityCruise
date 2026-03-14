<script lang="ts">
	let { open = $bindable(false) } = $props();

	const vessels = [
		"No Preference",
		"57' Power Catamaran (49 guests)",
		"72' Classic Chris Craft (49 guests)",
		"75' Power Catamaran (100 guests)",
		"85' Power Catamaran (200 guests)"
	];

	const drinkPackages = [
		'No Drinks Package',
		'BYOB',
		'Open Bar — Beer & Wine',
		'Open Bar — Premium',
		'Custom Package'
	];

	const cateringChoices = [
		'No Catering',
		'Light Appetizers',
		'Buffet Style',
		'Plated Dinner',
		'Custom Menu'
	];

	const timeSlots = [
		'Morning (9am – 12pm)',
		'Afternoon (12pm – 4pm)',
		'Sunset (4pm – 7pm)',
		'Evening (7pm – 11pm)',
		'Late Night (11pm – 2am)'
	];

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	});

	function close() {
		open = false;
	}

	function onBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div class="modal-backdrop" onclick={onBackdrop} onkeydown={onKeydown} role="dialog" aria-modal="true" aria-label="Request a Quote">
		<div class="modal">
			<div class="modal-header">
				<div>
					<p class="modal-kicker">Let's get you on the water</p>
					<h2 class="modal-title">Request a Quote</h2>
				</div>
				<button type="button" class="modal-close" onclick={close} aria-label="Close">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<form class="modal-form" action="/contact" method="GET">
				<div class="form-section">
					<h3 class="form-section-title">Your Info</h3>
					<div class="form-row">
						<div class="form-group">
							<label for="quote-name" class="form-label">Full Name</label>
							<input type="text" id="quote-name" name="name" class="form-input" placeholder="John Smith" required />
						</div>
						<div class="form-group">
							<label for="quote-phone" class="form-label">Phone</label>
							<input type="tel" id="quote-phone" name="phone" class="form-input" placeholder="(312) 555-0000" required />
						</div>
					</div>
					<div class="form-group">
						<label for="quote-email" class="form-label">Email</label>
						<input type="email" id="quote-email" name="email" class="form-input" placeholder="john@example.com" required />
					</div>
				</div>

				<div class="form-section">
					<h3 class="form-section-title">Cruise Details</h3>
					<div class="form-row">
						<div class="form-group">
							<label for="quote-vessel" class="form-label">Preferred Vessel</label>
							<select id="quote-vessel" name="vessel" class="form-input">
								{#each vessels as v (v)}
									<option value={v}>{v}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="quote-passengers" class="form-label">Passenger Count</label>
							<input type="number" id="quote-passengers" name="passengers" class="form-input" placeholder="e.g. 50" min="1" max="200" required />
						</div>
					</div>
					<div class="form-row">
						<div class="form-group">
							<label for="quote-time" class="form-label">Preferred Time</label>
							<select id="quote-time" name="time" class="form-input">
								<option value="" disabled selected>Select a time</option>
								{#each timeSlots as t (t)}
									<option value={t}>{t}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="quote-date" class="form-label">Preferred Date</label>
							<input type="date" id="quote-date" name="date" class="form-input" />
						</div>
					</div>
				</div>

				<div class="form-section">
					<h3 class="form-section-title">Food & Drink</h3>
					<div class="form-row">
						<div class="form-group">
							<label for="quote-drinks" class="form-label">Drinks Package</label>
							<select id="quote-drinks" name="drinks" class="form-input">
								{#each drinkPackages as d (d)}
									<option value={d}>{d}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="quote-catering" class="form-label">Catering</label>
							<select id="quote-catering" name="catering" class="form-input">
								{#each cateringChoices as c (c)}
									<option value={c}>{c}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<div class="form-section">
					<h3 class="form-section-title">Add-Ons <span class="section-badge">Each counts towards capacity</span></h3>
					<div class="addons-grid">
						<label class="addon-card">
							<input type="checkbox" name="addon_dj" value="1" />
							<span class="addon-icon">
								<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
							</span>
							<span class="addon-name">DJ</span>
						</label>
						<label class="addon-card">
							<input type="checkbox" name="addon_photographer" value="1" />
							<span class="addon-icon">
								<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
							</span>
							<span class="addon-name">Photographer</span>
						</label>
						<label class="addon-card">
							<input type="checkbox" name="addon_docent" value="1" />
							<span class="addon-icon">
								<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
							</span>
							<span class="addon-name">Architecture Docent</span>
						</label>
					</div>
				</div>

				<button type="submit" class="modal-submit">
					Submit Quote Request
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 500;
		background: rgba(10, 37, 64, 0.5);
		backdrop-filter: blur(4px);
		display: grid;
		place-items: center;
		padding: var(--space-4, 16px);
		overflow-y: auto;
	}

	.modal {
		width: 100%;
		max-width: 600px;
		max-height: 90vh;
		overflow-y: auto;
		background: var(--color-bg-primary, #f9f2f0);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg, 12px);
		box-shadow:
			0 24px 64px rgba(2, 8, 23, 0.2),
			0 4px 16px rgba(2, 8, 23, 0.1);
		padding: clamp(24px, 4vw, 36px);
	}

	.modal-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: var(--space-5, 20px);
	}

	.modal-kicker {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-semibold, 600);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-frosted-blue, #014cba);
		margin: 0 0 4px 0;
	}

	.modal-title {
		font-family: var(--font-family-system, system-ui);
		font-size: clamp(22px, 2.5vw, 28px);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
		margin: 0;
	}

	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-sm, 6px);
		border: 1px solid var(--color-border-default);
		background: transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease),
			color var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.modal-close:hover {
		background: var(--color-bg-secondary);
		color: var(--color-text-primary);
	}

	.modal-close svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-5, 20px);
	}

	.form-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3, 12px);
	}

	.form-section-title {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0;
		padding-bottom: var(--space-1, 4px);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3, 12px);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1, 4px);
	}

	.form-label {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-medium, 500);
		color: var(--color-text-secondary);
		letter-spacing: 0.02em;
	}

	.form-input {
		min-height: 42px;
		padding: 0 12px;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm, 6px);
		background: var(--nav-bg, rgba(248, 249, 250, 0.88));
		color: var(--color-text-primary);
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		transition: border-color var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-frosted-blue, #014cba);
		box-shadow: 0 0 0 3px rgba(1, 76, 186, 0.12);
	}

	.section-badge {
		display: inline-flex;
		align-items: center;
		padding: 2px 8px;
		margin-left: 6px;
		border-radius: 999px;
		background: rgba(1, 76, 186, 0.08);
		color: var(--color-frosted-blue, #014cba);
		font-size: var(--font-size-xs, 11px);
		font-weight: var(--font-weight-medium, 500);
		letter-spacing: 0;
		text-transform: none;
		vertical-align: middle;
	}

	/* Add-Ons */
	.addons-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3, 12px);
	}

	.addon-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 16px 12px;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-md, 8px);
		background: var(--nav-bg, rgba(248, 249, 250, 0.88));
		cursor: pointer;
		transition:
			border-color var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease),
			background var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.addon-card:hover {
		border-color: var(--color-border-strong);
	}

	.addon-card:has(input:checked) {
		border-color: var(--color-frosted-blue, #014cba);
		background: rgba(1, 76, 186, 0.06);
	}

	.addon-card input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.addon-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 999px;
		background: rgba(1, 76, 186, 0.08);
		color: var(--color-frosted-blue, #014cba);
	}

	.addon-icon svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.addon-name {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-medium, 500);
		color: var(--color-text-primary);
		text-align: center;
	}

	.modal-submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		align-self: stretch;
		min-height: 48px;
		padding: 0 var(--space-6, 24px);
		margin-top: var(--space-2, 8px);
		border: none;
		border-radius: var(--radius-md, 8px);
		background: var(--color-frosted-blue, #014cba);
		color: #f9f2f0;
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		cursor: pointer;
		transition:
			opacity var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease),
			transform var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.modal-submit svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.modal-submit:hover {
		opacity: var(--state-hover-opacity, 0.88);
	}

	.modal-submit:active {
		opacity: var(--state-pressed-opacity, 0.76);
		transform: scale(0.98);
	}

	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.addons-grid {
			grid-template-columns: 1fr;
		}

		.addon-card {
			flex-direction: row;
			padding: 12px 16px;
		}
	}
</style>
