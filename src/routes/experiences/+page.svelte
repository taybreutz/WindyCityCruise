<svelte:head>
	<title>Experiences - Windy City Cruise</title>
</svelte:head>

<main class="page">
	<section class="hero">
		<div class="hero-inner">
			<span class="kicker">Unforgettable Moments</span>
			<h1 class="hero-title">Experiences on the Water</h1>
			<p class="hero-subtitle">
				Whether it's a corporate retreat, dream wedding, or a golden sunset cruise, we craft
				bespoke experiences on Lake Michigan.
			</p>
		</div>
	</section>

	<section class="download-banner">
		<div class="download-inner">
			<div class="download-left">
				<div class="download-text">
					<span class="download-kicker">Plan Your Event</span>
					<h2 class="download-title">Download Our 2026 Events Kit</h2>
					<p class="download-description">
						Everything you need to plan the perfect outing — vessel specs, catering menus, drink
						packages, and pricing all in one place.
					</p>
				</div>
				<a href="/KMBC_Events_Kit_2026.pdf" download class="download-cta">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
					Download PDF
				</a>
			</div>
			<div class="pdf-preview-wrap">
				<div class="pdf-preview">
					<iframe src="/KMBC_Events_Kit_2026.pdf#toolbar=0&navpanes=0&scrollbar=0" title="Events Kit Preview"></iframe>
					<div class="pdf-fade"></div>
				</div>
			</div>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container">
			<div class="experience-grid">
				<div class="experience-card">
					<div class="experience-icon">&#9734;</div>
					<h3 class="experience-name">Sunset Cruises</h3>
					<p class="experience-description">
						Watch the Chicago skyline glow as the sun dips below the horizon. Our sunset cruises
						feature complimentary champagne and curated playlists for the perfect evening on the
						water.
					</p>
				</div>
				<div class="experience-card">
					<div class="experience-icon">&#9829;</div>
					<h3 class="experience-name">Weddings & Proposals</h3>
					<p class="experience-description">
						Say "I do" with the city as your backdrop. From intimate proposals to full wedding
						receptions, our team handles every detail to make your day magical.
					</p>
				</div>
				<div class="experience-card">
					<div class="experience-icon">&#9881;</div>
					<h3 class="experience-name">Corporate Events</h3>
					<p class="experience-description">
						Impress clients and reward your team with a unique venue on the lake. We offer
						customizable packages for team-building outings, client entertainment, and company
						celebrations.
					</p>
				</div>
				<div class="experience-card">
					<div class="experience-icon">&#9836;</div>
					<h3 class="experience-name">Party Cruises</h3>
					<p class="experience-description">
						Birthdays, bachelor and bachelorette parties, or just because. Our party cruises come
						with premium sound, optional DJ, and everything you need for a night to remember.
					</p>
				</div>
				<div class="experience-card">
					<div class="experience-icon">&#9733;</div>
					<h3 class="experience-name">Holiday Specials</h3>
					<p class="experience-description">
						Celebrate the Fourth of July fireworks from the water, ring in the New Year on the lake,
						or book a spooky Halloween cruise. Seasonal experiences you won't find anywhere else.
					</p>
				</div>
				<div class="experience-card">
					<div class="experience-icon">&#9992;</div>
					<h3 class="experience-name">Private Charters</h3>
					<p class="experience-description">
						Design your own experience. Choose your route, duration, and amenities for a fully
						private outing tailored to your vision. The lake is yours.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container content-container--narrow">
			<h2 class="section-title">How It Works</h2>
			<div class="steps">
				<div class="step">
					<span class="step-number">1</span>
					<div>
						<h4 class="step-title">Choose Your Experience</h4>
						<p class="step-text">Browse our offerings and pick the experience that fits your vision.</p>
					</div>
				</div>
				<div class="step">
					<span class="step-number">2</span>
					<div>
						<h4 class="step-title">Customize Your Trip</h4>
						<p class="step-text">Work with our team to tailor the details, from catering to music.</p>
					</div>
				</div>
				<div class="step">
					<span class="step-number">3</span>
					<div>
						<h4 class="step-title">Set Sail</h4>
						<p class="step-text">Show up, relax, and let us handle the rest. It's that easy.</p>
					</div>
				</div>
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
		margin: 0 0 var(--space-6, 1.5rem) 0;
	}

	.experience-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6, 1.5rem);
	}

	.experience-card {
		background-color: var(--color-bg-secondary, #fff);
		border-radius: var(--radius-lg, 12px);
		padding: var(--space-6, 1.5rem);
		transition: transform var(--motion-duration-fast, 150ms) var(--motion-ease-standard, ease);
	}

	.experience-card:hover {
		transform: translateY(-4px);
	}

	.experience-icon {
		font-size: 1.75rem;
		margin-bottom: var(--space-3, 0.75rem);
	}

	.experience-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg, 1.125rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2, 0.5rem) 0;
	}

	.experience-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		line-height: var(--line-height-relaxed, 1.6);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.steps {
		display: flex;
		flex-direction: column;
		gap: var(--space-5, 1.25rem);
	}

	.step {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4, 1rem);
	}

	.step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: #014cba;
		color: #fff;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		font-weight: var(--font-weight-semibold, 600);
	}

	.step-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md, 1rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1, 0.25rem) 0;
	}

	.step-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		line-height: var(--line-height-relaxed, 1.6);
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Download Banner */
	.download-banner {
		padding: 0 var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.download-inner {
		max-width: var(--content-max-width, 1100px);
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: clamp(24px, 4vw, 48px);
		padding: clamp(24px, 3vw, 36px);
		border-radius: var(--radius-lg, 12px);
		background: var(--color-frosted-blue, #014cba);
		color: #f9f2f0;
	}

	.download-left {
		display: flex;
		flex-direction: column;
		gap: var(--space-5, 20px);
		flex: 1;
	}

	.download-text {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.download-kicker {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 0.75rem);
		font-weight: var(--font-weight-semibold, 600);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		opacity: 0.72;
	}

	.download-title {
		font-family: var(--font-family-system);
		font-size: clamp(20px, 2vw, 26px);
		font-weight: 800;
		letter-spacing: -0.01em;
		margin: 0;
	}

	.download-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		line-height: 1.5;
		opacity: 0.8;
		margin: 4px 0 0 0;
		max-width: 480px;
	}

	.download-cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 48px;
		padding: 0 var(--space-6, 24px);
		border-radius: var(--radius-md, 8px);
		background: #f9f2f0;
		color: var(--color-frosted-blue, #014cba);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		font-weight: var(--font-weight-semibold, 600);
		text-decoration: none;
		white-space: nowrap;
		align-self: flex-start;
		transition:
			opacity var(--motion-duration-fast, 150ms) var(--motion-ease-standard, ease),
			transform var(--motion-duration-fast, 150ms) var(--motion-ease-standard, ease);
	}

	.download-cta svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.download-cta:hover {
		opacity: var(--state-hover-opacity, 0.88);
	}

	.download-cta:active {
		transform: scale(0.98);
	}

	/* PDF Preview */
	.pdf-preview-wrap {
		flex-shrink: 0;
		width: 220px;
	}

	.pdf-preview {
		position: relative;
		width: 100%;
		height: 300px;
		border-radius: var(--radius-md, 8px);
		overflow: hidden;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.3),
			0 2px 8px rgba(0, 0, 0, 0.15);
		transform: rotate(2deg);
	}

	.pdf-preview iframe {
		width: 100%;
		height: 100%;
		border: none;
		pointer-events: none;
	}

	.pdf-fade {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 40%;
		background: linear-gradient(to bottom, transparent, var(--color-frosted-blue, #014cba));
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.hero {
			padding-top: var(--space-10, 3rem);
		}

		.hero-title {
			font-size: var(--font-size-xl, 1.5rem);
		}

		.experience-grid {
			grid-template-columns: 1fr;
		}

		.download-inner {
			flex-direction: column;
			text-align: center;
			align-items: stretch;
		}

		.download-left {
			align-items: center;
		}

		.download-description {
			max-width: none;
		}

		.download-cta {
			align-self: center;
			justify-content: center;
		}

		.pdf-preview-wrap {
			width: 180px;
			align-self: center;
		}

		.pdf-preview {
			height: 240px;
		}
	}
</style>
