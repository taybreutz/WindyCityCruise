<script lang="ts">
	const experiences = [
		'Yacht Rental',
		'Corporate Event',
		'Birthday Party',
		'Wedding Cruise',
		'Sunset Cruise',
		'Bachelor/Bachelorette'
	];
</script>

<section class="plan-section">
	<div class="plan-container">
		<div class="plan-intro">
			<p class="plan-kicker">Ready to get on the water?</p>
			<h2 class="plan-heading">Plan Your Trip</h2>
			<p class="plan-description">
				Tell us a little about what you're looking for and we'll match you with the perfect yacht and experience.
			</p>
		</div>

		<form class="plan-form" action="/book" method="GET">
			<div class="form-row">
				<div class="form-group">
					<label for="plan-experience" class="form-label">Experience</label>
					<select id="plan-experience" name="experience" class="form-input">
						<option value="" disabled selected>What are you celebrating?</option>
						{#each experiences as exp (exp)}
							<option value={exp}>{exp}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="plan-guests" class="form-label">Guests</label>
					<select id="plan-guests" name="guests" class="form-input">
						<option value="" disabled selected>How many guests?</option>
						<option value="1-12">1 – 12 guests</option>
						<option value="13-49">13 – 49 guests</option>
						<option value="50-100">50 – 100 guests</option>
						<option value="100-150">100 – 150 guests</option>
						<option value="150+">150+ guests</option>
					</select>
				</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="plan-date" class="form-label">Preferred Date</label>
					<input type="date" id="plan-date" name="date" class="form-input" />
				</div>

				<div class="form-group">
					<label for="plan-duration" class="form-label">Duration</label>
					<select id="plan-duration" name="duration" class="form-input">
						<option value="" disabled selected>How long?</option>
						<option value="2">2 hours</option>
						<option value="3">3 hours</option>
						<option value="4">4 hours</option>
						<option value="6">6 hours</option>
						<option value="8">Full day (8 hours)</option>
					</select>
				</div>
			</div>

			<div class="form-row form-row--full">
				<div class="form-group">
					<label for="plan-notes" class="form-label">Anything else we should know?</label>
					<textarea
						id="plan-notes"
						name="notes"
						class="form-input form-textarea"
						rows="3"
						placeholder="Special requests, dietary needs, occasion details..."
					></textarea>
				</div>
			</div>

			<button type="submit" class="plan-submit">
				Find My Perfect Yacht
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M5 12h14M13 6l6 6-6 6" />
				</svg>
			</button>
		</form>
	</div>
</section>

<style>
	.plan-section {
		padding: var(--space-10, 64px) var(--space-5, 20px);
		background: var(--color-bg-primary);
	}

	.plan-container {
		max-width: 720px;
		margin: 0 auto;
		background: var(--nav-bg);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg, 12px);
		padding: clamp(var(--space-6, 24px), 4vw, var(--space-10, 64px));
		box-shadow:
			0 12px 32px rgba(2, 8, 23, 0.06),
			0 2px 6px rgba(2, 8, 23, 0.04);
	}

	.plan-intro {
		text-align: center;
		margin-bottom: var(--space-6, 24px);
	}

	.plan-kicker {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-semibold, 600);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-frosted-blue);
		margin: 0 0 var(--space-2, 8px) 0;
	}

	.plan-heading {
		font-family: var(--font-family-system, system-ui);
		font-size: clamp(24px, 2.8vw, 36px);
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2, 8px) 0;
	}

	.plan-description {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin: 0;
		max-width: 48ch;
		margin-inline: auto;
	}

	.plan-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4, 16px);
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4, 16px);
	}

	.form-row--full {
		grid-template-columns: 1fr;
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
		min-height: var(--tap-target-min, 44px);
		padding: 0 14px;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm, 6px);
		background: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		transition: border-color var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-frosted-blue);
		box-shadow: 0 0 0 3px rgba(1, 76, 186, 0.12);
	}

	.form-textarea {
		padding: 12px 14px;
		resize: vertical;
		min-height: 80px;
	}

	.plan-submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		align-self: center;
		min-height: var(--tap-target-min, 44px);
		padding: 0 clamp(var(--space-6, 24px), 3vw, var(--space-8, 32px));
		margin-top: var(--space-2, 8px);
		border: none;
		border-radius: var(--radius-md, 8px);
		background: var(--color-frosted-blue);
		color: var(--color-text-inverse, #f9f2f0);
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		cursor: pointer;
		transition:
			opacity var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease),
			transform var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.plan-submit svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.plan-submit:hover {
		opacity: var(--state-hover-opacity, 0.88);
	}

	.plan-submit:active {
		opacity: var(--state-pressed-opacity, 0.76);
		transform: scale(0.98);
	}

	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
