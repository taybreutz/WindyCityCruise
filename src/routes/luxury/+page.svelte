<script lang="ts">
	const yachtCharters = [
		{
			name: 'Chi City Charters',
			description: "Chicago's Premier Yacht Charter Service!",
			pricing: ['Weekdays: $750/hr*', 'Weekends: $850/hr*'],
			note: '* prices may vary on holidays and popular days',
			promo: 'Use promo code BOATCREW100 for $100 off your charter!',
			href: 'https://chicitycharters.com/',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/Chi_City_Charters_ed97f824-5321-4c5a-b006-1f729be24fbc.png?v=1689280990&width=1420'
		},
		{
			name: 'Yachts Chicago',
			description: 'Discover the good life!',
			pricing: ["50' Multi-Level Luxury Yacht: $400/hr", "62' Italian Luxury Yacht: $1,000/hr"],
			promo: 'Use promo code BOATCREW100 for $100 off your charter!',
			href: 'https://yachtschicago.com/',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/Yachts_Chicago.png?v=1713832718&width=1420'
		}
	];
</script>

<svelte:head>
	<title>Luxury Yacht Charters - Windy City Cruise</title>
</svelte:head>

<main class="page">
	<section class="hero-section">
		<div class="hero-image-container">
			<img
				src="https://chicagoboatinghub.com/cdn/shop/files/VDT06675_1.jpg?v=1701630267&width=3000"
				alt="Luxury yacht on Lake Michigan"
				class="hero-image"
			/>
		</div>
		<div class="hero-overlay">
			<h1 class="hero-title">Luxury Yacht Charters</h1>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container">
			<div class="charters-grid">
				{#each yachtCharters as charter}
					<div class="charter-card">
						<div class="charter-image-container">
							<img src={charter.image} alt={charter.name} class="charter-image" />
						</div>
						<div class="charter-info">
							<h2 class="charter-name">{charter.name}</h2>
							<p class="charter-description">{charter.description}</p>

							<ul class="pricing-list">
								{#each charter.pricing as price}
									<li>{price}</li>
								{/each}
							</ul>

							{#if charter.note}
								<p class="pricing-note">{charter.note}</p>
							{/if}

							<p class="promo-text">{charter.promo}</p>

							<a
								href={charter.href}
								class="learn-more-button"
								target="_blank"
								rel="noopener noreferrer"
							>
								Learn More
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container centered">
			<p class="disclaimer">
				All companies featured on Windy City Cruise are selected by our team. When you buy
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
		position: relative;
		height: 50vh;
		min-height: 320px;
		max-height: 480px;
	}

	.hero-image-container {
		position: absolute;
		inset: 0;
	}

	.hero-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(to bottom, rgba(10, 37, 64, 0.3) 0%, rgba(10, 37, 64, 0.6) 100%);
	}

	.hero-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-inverse);
		margin: 0;
		text-align: center;
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
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.centered {
		text-align: center;
	}

	.charters-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: var(--space-6);
	}

	.charter-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.charter-image-container {
		width: 100%;
		height: 240px;
		overflow: hidden;
	}

	.charter-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.charter-info {
		padding: var(--space-6);
	}

	.charter-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.charter-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	.pricing-list {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--space-2) 0;
	}

	.pricing-list li {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-primary);
		padding: var(--space-1) 0;
	}

	.pricing-note {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
		font-style: italic;
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
		padding: 0 var(--space-5);
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
			padding: 0 var(--space-4);
		}

		.charters-grid {
			grid-template-columns: 1fr;
		}

		.charter-image-container {
			height: 200px;
		}
	}
</style>
