<svelte:head>
	<title>About Us - Windy City Cruise</title>
</svelte:head>

<main class="page">
	<section class="hero">
		<div class="hero-inner">
			<span class="kicker">Our Story</span>
			<h1 class="hero-title">About Windy City Cruise</h1>
			<p class="hero-subtitle">
				Born on the shores of Lake Michigan, we are Chicago's premier yacht charter experience --
				built by boaters, for boaters.
			</p>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container content-container--narrow">
			<h2 class="section-title">How We Started</h2>
			<p class="body-text">
				Windy City Cruise was founded with a simple belief: everyone deserves to experience Chicago
				from the water. What started as a single boat and a passion for the lake has grown into a
				fleet of luxury yachts serving thousands of guests each season.
			</p>
			<p class="body-text">
				Our founders grew up on Lake Michigan, spending summers in the Playpen and cruising past the
				skyline at sunset. They saw an opportunity to share that magic with visitors and locals alike
				-- making premium boating accessible, safe, and unforgettable.
			</p>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container">
			<h2 class="section-title" style="text-align: center;">Our Values</h2>
			<div class="values-grid">
				<div class="value-card">
					<h3 class="value-name">Safety First</h3>
					<p class="value-description">
						Every vessel is Coast Guard certified and our captains are licensed professionals.
						Your safety on the water is our top priority, always.
					</p>
				</div>
				<div class="value-card">
					<h3 class="value-name">Unforgettable Experiences</h3>
					<p class="value-description">
						We go beyond transportation. Every cruise is designed to create lasting memories,
						from the music to the views to the personal touches.
					</p>
				</div>
				<div class="value-card">
					<h3 class="value-name">Community</h3>
					<p class="value-description">
						We are proud members of the Chicago boating community. We support local vendors,
						partner with neighborhood businesses, and give back to the lakefront.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container content-container--narrow">
			<h2 class="section-title">Our Team</h2>
			<p class="body-text">
				Behind every cruise is a passionate team of captains, event coordinators, and hospitality
				professionals who love what they do. Our crew members are hand-picked for their expertise,
				warmth, and deep knowledge of Lake Michigan.
			</p>
			<p class="body-text">
				From your first inquiry to the moment you step off the boat, our team is dedicated to
				making every detail seamless. We are not just a charter company -- we are your hosts on the
				water.
			</p>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container content-container--narrow">
			<h2 class="section-title">Our Mission</h2>
			<p class="body-text">
				To redefine the Chicago boating experience by making luxury yacht charters accessible,
				personalized, and genuinely memorable. We believe the best moments happen on the water,
				and we are here to make them happen for you.
			</p>
			<div class="cta-row">
				<a href="/contact" class="cta-link">Get in Touch</a>
				<a href="/experiences" class="cta-link cta-link--outline">Explore Experiences</a>
			</div>
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
		color: #014cba;
		margin-bottom: var(--space-3, 0.75rem);
	}

	.hero-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-3xl, 2.5rem);
		font-weight: var(--font-weight-bold, 700);
		line-height: var(--line-height-tight, 1.15);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4, 1rem) 0;
	}

	.hero-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg, 1.125rem);
		font-weight: var(--font-weight-regular, 400);
		line-height: var(--line-height-relaxed, 1.6);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.content-section {
		padding: var(--space-10, 3rem) var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.content-section--alt {
		background-color: var(--color-bg-secondary, #fff);
	}

	.content-container {
		max-width: var(--content-max-width, 1100px);
		margin: 0 auto;
	}

	.content-container--narrow {
		max-width: var(--content-narrow-width, 680px);
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl, 1.5rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-5, 1.25rem) 0;
	}

	.body-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md, 1rem);
		line-height: var(--line-height-relaxed, 1.6);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4, 1rem) 0;
	}

	.body-text:last-of-type {
		margin-bottom: 0;
	}

	.values-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6, 1.5rem);
		margin-top: var(--space-6, 1.5rem);
	}

	.value-card {
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-lg, 12px);
		padding: var(--space-6, 1.5rem);
	}

	.value-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg, 1.125rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2, 0.5rem) 0;
	}

	.value-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		line-height: var(--line-height-relaxed, 1.6);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.cta-row {
		display: flex;
		gap: var(--space-3, 0.75rem);
		margin-top: var(--space-6, 1.5rem);
	}

	.cta-link {
		display: inline-block;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		font-weight: var(--font-weight-semibold, 600);
		color: #fff;
		background-color: #014cba;
		padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
		border-radius: var(--radius-md, 8px);
		text-decoration: none;
		transition: opacity var(--motion-duration-fast, 150ms) var(--motion-ease-standard, ease);
	}

	.cta-link:hover {
		opacity: 0.85;
	}

	.cta-link--outline {
		background-color: transparent;
		color: #014cba;
		border: 2px solid #014cba;
	}

	.cta-link--outline:hover {
		background-color: #014cba;
		color: #fff;
		opacity: 1;
	}

	@media (max-width: 768px) {
		.hero {
			padding-top: var(--space-10, 3rem);
		}

		.hero-title {
			font-size: var(--font-size-xl, 1.5rem);
		}

		.values-grid {
			grid-template-columns: 1fr;
		}

		.cta-row {
			flex-direction: column;
		}

		.cta-link {
			text-align: center;
		}
	}
</style>
