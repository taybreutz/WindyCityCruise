<script lang="ts">
</script>

<svelte:head>
	<title>Wakesurfing - Chicago Boating Hub</title>
</svelte:head>

<main class="page">
	<section class="hero-section">
		<div class="hero-content">
			<h1 class="hero-title">Wakesurfing</h1>
			<p class="hero-subtitle">
				Experience the thrill of riding waves on Lake Michigan
			</p>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container">
			<div class="partner-card">
				<div class="partner-image-container">
					<img
						src="https://chicagoboatinghub.com/cdn/shop/files/Lake_Town_Surf_f6092779-6fc3-478a-9d77-6defa65d4697.jpg?v=1684096034&width=1420"
						alt="Laketown Surf"
						class="partner-image"
					/>
				</div>
				<div class="partner-info">
					<h2 class="partner-name">Laketown Surf</h2>
					<p class="partner-tagline">The best days are spent on the lake.</p>
					<p class="promo-text">Use promo code BOATCREW10 for 10% off!</p>
					<a
						href="https://laketownsurf.com/"
						class="learn-more-button"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn More
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container centered">
			<p class="disclaimer">
				All companies featured on Chicago Boating Hub are selected by our team. When you buy
				something through our retail links, we may earn an affiliate commission.
			</p>
		</div>
	</section>
</main>

<style>
	.page {
		min-height: 100vh;
	}

	.hero-section {
		padding: var(--space-10) var(--space-5);
		background-color: var(--color-bg-secondary);
		text-align: center;
	}

	.hero-content {
		max-width: var(--content-narrow-width);
		margin: 0 auto;
	}

	.hero-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.hero-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.content-section {
		padding: var(--space-10) var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.content-section--alt {
		background-color: var(--color-bg-secondary);
		padding: var(--space-6) var(--space-5);
	}

	.content-container {
		max-width: var(--content-narrow-width);
		margin: 0 auto;
	}

	.centered {
		text-align: center;
	}

	.partner-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.partner-image-container {
		width: 100%;
		height: 320px;
		overflow: hidden;
	}

	.partner-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.partner-info {
		padding: var(--space-6);
		text-align: center;
	}

	.partner-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.partner-tagline {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	.promo-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-accent-primary);
		margin: 0 0 var(--space-5) 0;
	}

	.learn-more-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-target-min);
		padding: 0 var(--space-6);
		background-color: var(--button-primary-bg);
		color: var(--button-primary-text);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		text-decoration: none;
		border-radius: var(--radius-sm);
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.learn-more-button:hover {
		opacity: var(--state-hover-opacity);
	}

	.learn-more-button:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	.disclaimer {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
		margin: 0;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: var(--font-size-xl);
		}

		.partner-image-container {
			height: 240px;
		}
	}
</style>
