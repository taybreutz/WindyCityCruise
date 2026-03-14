<script lang="ts">
	const yachts = [
		{
			name: "57' Power Catamaran",
			capacity: 49,
			length: "57'",
			tagline: 'Perfect for intimate gatherings & day cruises',
			image: 'https://res.cloudinary.com/dlobqp00u/image/upload/w_1600,q_auto,f_auto/v1771256209/chicago-boat-rental-57ft-power-catamaran.webp',
			rate: 'From $337/hr',
			description: 'A versatile twin-hull vessel ideal for smaller groups looking for a smooth, stable ride on Lake Michigan. Features ample deck space, a shaded lounge, and panoramic views of the Chicago skyline.'
		},
		{
			name: "72' Classic Chris Craft",
			capacity: 49,
			length: "72'",
			tagline: 'Iconic vintage yacht with timeless elegance',
			image: 'https://res.cloudinary.com/dlobqp00u/image/upload/w_1600,q_auto,f_auto/v1771256386/chicago-boat-rental-72ft-classic-chris-craft-sophisticated-lady.webp',
			rate: 'From $362/hr',
			description: 'A beautifully restored classic that turns heads wherever she goes. Featuring rich wood interiors, a spacious salon, and an open-air flybridge — the definition of timeless elegance on the water.'
		},
		{
			name: "75' Power Catamaran",
			capacity: 100,
			length: "75'",
			tagline: 'Corporate events & milestone celebrations',
			image: 'https://res.cloudinary.com/dlobqp00u/image/upload/w_1600,q_auto,f_auto/v1772565318/1772513966043-423-IMG_2785_dekeoz.webp',
			rate: 'From $475/hr',
			description: 'Built for larger parties and corporate events, this catamaran delivers exceptional stability and space. Two expansive decks, a full bar area, premium sound system, and room for up to 100 guests.'
		},
		{
			name: "85' Power Catamaran",
			capacity: 200,
			length: "85'",
			tagline: 'The ultimate wedding & gala yacht',
			image: 'https://res.cloudinary.com/dlobqp00u/image/upload/w_1600/v1769703495/b10261dd-6987-4c43-841e-3a289b7ee719_tlvuze.jpg',
			rate: 'From $625/hr',
			description: 'Our flagship vessel and the largest in the fleet. Three decks of luxury with a full commercial kitchen, multiple bars, a dance floor, and climate-controlled interior — perfect for weddings, galas, and unforgettable celebrations.'
		}
	];
</script>

<svelte:head>
	<title>Our Yachts - Windy City Cruise</title>
</svelte:head>

<main class="page">
	<section class="hero">
		<div class="hero-inner">
			<span class="kicker">Our Fleet</span>
			<h1 class="hero-title">Luxury Yachts for Every Occasion</h1>
			<p class="hero-subtitle">
				From intimate gatherings to grand celebrations, explore our curated fleet of premium vessels
				on Lake Michigan.
			</p>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container">
			{#each yachts as yacht (yacht.name)}
				<div class="yacht-card">
					<div class="yacht-card-image" style="background-image: url({yacht.image})">
						<div class="yacht-card-badges">
							<span class="badge">{yacht.length}</span>
							<span class="badge">
								<svg viewBox="0 0 24 24" aria-hidden="true">
									<circle cx="12" cy="7" r="3.2"></circle>
									<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
								</svg>
								Up to {yacht.capacity}
							</span>
						</div>
					</div>
					<div class="yacht-card-body">
						<div class="yacht-card-top">
							<h2 class="yacht-card-name">{yacht.name}</h2>
							<p class="yacht-card-tagline">{yacht.tagline}</p>
						</div>
						<p class="yacht-card-description">{yacht.description}</p>
						<div class="yacht-card-footer">
							<span class="yacht-card-rate">{yacht.rate}</span>
							<a href="/book" class="yacht-card-cta">Book This Yacht</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container content-container--narrow">
			<h2 class="section-title">What's Included</h2>
			<ul class="feature-list">
				<li class="feature-item">Professional captain and crew</li>
				<li class="feature-item">Premium Bluetooth sound system</li>
				<li class="feature-item">Coolers and ice provided</li>
				<li class="feature-item">Safety equipment and life jackets</li>
				<li class="feature-item">Complimentary water and soft drinks</li>
				<li class="feature-item">Optional catering and bar packages</li>
			</ul>
		</div>
	</section>
</main>

<style>
	.page {
		min-height: 100vh;
		background-color: var(--color-bg-primary);
	}

	.hero {
		padding: var(--space-16, 6rem) var(--space-5) var(--space-10);
		text-align: center;
		background-color: var(--color-bg-primary);
	}

	.hero-inner {
		max-width: var(--content-narrow-width, 680px);
		margin: 0 auto;
	}

	.kicker {
		display: inline-block;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 0.75rem);
		font-weight: var(--font-weight-semibold, 600);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-frosted-blue);
		margin-bottom: var(--space-3, 0.75rem);
	}

	.hero-title {
		font-family: var(--font-family-system);
		font-size: clamp(28px, 4vw, 48px);
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.hero-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg, 1.125rem);
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.content-section {
		padding: var(--space-10, 3rem) var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.content-section--alt {
		background-color: var(--color-bg-secondary);
	}

	.content-container {
		max-width: 1000px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-6, 24px);
	}

	.content-container--narrow {
		max-width: var(--content-narrow-width, 680px);
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl, 1.5rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-6) 0;
	}

	/* Yacht Cards */
	.yacht-card {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-radius: var(--radius-lg, 12px);
		overflow: hidden;
		border: 1px solid var(--color-border-subtle);
		background: var(--nav-bg);
	}

	.yacht-card:nth-child(even) {
		direction: rtl;
	}

	.yacht-card:nth-child(even) > * {
		direction: ltr;
	}

	.yacht-card-image {
		height: 100%;
		min-height: 320px;
		background-size: cover;
		background-position: center;
		position: relative;
	}

	.yacht-card-badges {
		position: absolute;
		top: var(--space-3, 12px);
		left: var(--space-3, 12px);
		display: flex;
		gap: 6px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 5px 12px;
		border-radius: 999px;
		background: rgba(10, 37, 64, 0.72);
		backdrop-filter: blur(8px);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-semibold, 600);
		color: #f9f2f0;
	}

	.badge svg {
		width: 14px;
		height: 14px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.yacht-card-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--space-4, 16px);
		padding: clamp(24px, 3vw, 40px);
	}

	.yacht-card-top {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.yacht-card-name {
		font-family: var(--font-family-system);
		font-size: clamp(20px, 2vw, 28px);
		font-weight: 800;
		letter-spacing: -0.01em;
		color: var(--color-text-primary);
		margin: 0;
	}

	.yacht-card-tagline {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-medium, 500);
		color: var(--color-frosted-blue);
		margin: 0;
	}

	.yacht-card-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		line-height: 1.6;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.yacht-card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3, 12px);
		margin-top: var(--space-2, 8px);
	}

	.yacht-card-rate {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md, 16px);
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.yacht-card-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 42px;
		padding: 0 var(--space-5, 20px);
		border-radius: var(--radius-md, 8px);
		background: var(--color-frosted-blue);
		color: #f9f2f0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		text-decoration: none;
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.yacht-card-cta:hover {
		opacity: var(--state-hover-opacity, 0.88);
	}

	.yacht-card-cta:active {
		transform: scale(0.98);
	}

	/* Features */
	.feature-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3, 0.75rem);
	}

	.feature-item {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md, 1rem);
		line-height: 1.6;
		color: var(--color-text-secondary);
		padding-left: var(--space-5, 1.25rem);
		position: relative;
	}

	.feature-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.55em;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--color-frosted-blue);
	}

	@media (max-width: 768px) {
		.hero {
			padding-top: var(--space-10, 3rem);
		}

		.yacht-card {
			grid-template-columns: 1fr;
		}

		.yacht-card:nth-child(even) {
			direction: ltr;
		}

		.yacht-card-image {
			min-height: 240px;
		}
	}
</style>
