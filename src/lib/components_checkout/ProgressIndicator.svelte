<script lang="ts">
	interface Props {
		currentStep?: number;
	}

	let { currentStep = 1 }: Props = $props();

	const steps = [
		{ number: 1, label: 'Select Boat' },
		{ number: 2, label: 'Guest & Payment' },
		{ number: 3, label: 'Confirmation' }
	];
</script>

<div class="progress-container">
	<div class="trust-badges">
		<span class="badge">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
				<path d="M7 11V7a5 5 0 0110 0v4" />
			</svg>
			Secure Transaction
		</span>
		<span class="badge">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path
					d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
				/>
			</svg>
			24/7 Support
		</span>
		<span class="badge">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
				<polyline points="22 4 12 14.01 9 11.01" />
			</svg>
			Trusted Payments
		</span>
	</div>

	<div class="steps">
		{#each steps as step, i}
			<div
				class="step"
				class:active={currentStep === step.number}
				class:completed={currentStep > step.number}
			>
				<div class="step-indicator">
					{#if currentStep > step.number}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					{:else}
						{step.number}
					{/if}
				</div>
				<span class="step-label">{step.label}</span>
			</div>
			{#if i < steps.length - 1}
				<div class="connector" class:completed={currentStep > step.number}></div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.progress-container {
		padding: var(--space-4) var(--space-5);
		background-color: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.trust-badges {
		display: flex;
		justify-content: center;
		gap: var(--space-6);
		margin-bottom: var(--space-5);
	}

	.badge {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	.badge svg {
		width: 16px;
		height: 16px;
		color: var(--color-accent-primary);
	}

	.steps {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		max-width: 600px;
		margin: 0 auto;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		min-width: 100px;
	}

	.step-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: var(--color-bg-primary);
		border: 2px solid var(--color-border-default);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-tertiary);
		transition: all var(--motion-duration-default) var(--motion-ease-standard);
	}

	.step.active .step-indicator {
		background-color: var(--color-accent-primary);
		border-color: var(--color-accent-primary);
		color: var(--color-text-inverse);
	}

	.step.completed .step-indicator {
		background-color: var(--color-accent-primary);
		border-color: var(--color-accent-primary);
		color: var(--color-text-inverse);
	}

	.step.completed .step-indicator svg {
		width: 16px;
		height: 16px;
	}

	.step-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-tertiary);
		text-align: center;
		transition: color var(--motion-duration-default) var(--motion-ease-standard);
	}

	.step.active .step-label {
		color: var(--color-accent-primary);
		font-weight: var(--font-weight-semibold);
	}

	.step.completed .step-label {
		color: var(--color-text-secondary);
	}

	.connector {
		flex: 1;
		height: 2px;
		background-color: var(--color-border-default);
		margin: 0 var(--space-2);
		margin-bottom: 24px;
		min-width: 40px;
		max-width: 80px;
		transition: background-color var(--motion-duration-default) var(--motion-ease-standard);
	}

	.connector.completed {
		background-color: var(--color-accent-primary);
	}

	@media (max-width: 600px) {
		.trust-badges {
			flex-wrap: wrap;
			gap: var(--space-3);
		}

		.step {
			min-width: 70px;
		}

		.step-label {
			font-size: 11px;
		}

		.connector {
			min-width: 20px;
		}
	}
</style>
