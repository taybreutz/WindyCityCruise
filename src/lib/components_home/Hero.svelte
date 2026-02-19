<script lang="ts">
	const mediaRingText = 'The Playpen • Chicago, Illinois • ';
	const mediaRingContent = mediaRingText.repeat(12);
</script>

<section class="hero-shell">
	<div class="hero container">
		<div class="hero-content">
			<h1 class="hero-title">
				Connect, cruise, and
				<br />
				celebrate <span>everywhere</span>
			</h1>
			<p class="hero-subtitle">
				We make rentals, memberships, and premium charters simpler and safer so your crew can spend
				more time on the water.
			</p>
			<div class="hero-cta-container">
				<a href="/rentals" class="hero-cta hero-cta-primary">View All Experiences</a>
				<a href="/boat-club" class="hero-cta hero-cta-secondary">How It Works</a>
			</div>
		</div>

		<div class="planner-banner">
			<div class="planner-banner-top">
				<div class="planner-banner-header">
					<p class="planner-banner-kicker">Plan Your Day</p>
					<h2 class="planner-banner-title">Find Your Boat</h2>
				</div>
				<div class="planner-banner-chips">
					<button type="button" class="planner-chip active">Boat</button>
					<button type="button" class="planner-chip">Big</button>
					<button type="button" class="planner-chip">Sailboat</button>
					<button type="button" class="planner-chip">Kayak</button>
					<button type="button" class="planner-chip">Jet Ski</button>
				</div>
			</div>

			<form class="planner-banner-form" action="/find-your-boat" method="GET">
				<input
					type="text"
					name="near"
					class="planner-banner-input"
					placeholder="Chicago neighborhood, hotel, or address"
				/>
				<input type="date" name="checkIn" class="planner-banner-input planner-banner-date" />
				<input type="date" name="checkOut" class="planner-banner-input planner-banner-date" />
				<select name="guests" class="planner-banner-input planner-banner-select">
					<option value="2">2 guests</option>
					<option value="4">4 guests</option>
					<option value="6">6 guests</option>
					<option value="8">8 guests</option>
					<option value="10">10+ guests</option>
				</select>
				<button type="submit" class="planner-banner-submit">Find Your Boat</button>
			</form>
		</div>
	</div>
	<div class="hero-media" aria-hidden="true">
		<video
			src="https://cdn.shopify.com/videos/c/o/v/11ba9511dd96488baa7ab28c502cf80a.mp4"
			autoplay
			loop
			muted
			playsinline
			preload="auto"
			class="hero-video"
		></video>
		<div class="hero-video-ring">
			<svg viewBox="0 0 100 100" role="presentation" focusable="false">
				<defs>
					<path
						id="hero-video-ring-path"
						d="M 50,50 m -50.5,0 a 50.5,50.5 0 1,1 101,0 a 50.5,50.5 0 1,1 -101,0"
					/>
				</defs>
				<text>
					<textPath href="#hero-video-ring-path">{mediaRingContent}</textPath>
				</text>
			</svg>
		</div>
	</div>
</section>

<style>
	.hero-shell {
		--hero-accent: var(--color-frosted-blue);
		--hero-inline-pad: 40px;
		--hero-video-size: clamp(460px, 60vw, 1000px);
		--hero-video-offset-x: 18%;
		--hero-video-offset-y: 28%;
		position: relative;
		background: var(--color-bg-secondary);
		overflow: hidden;
		min-height: clamp(620px, 89svh, 860px);
	}

	.hero {
		position: relative;
		width: 100%;
		min-height: inherit;
		padding-block: clamp(38px, 7vh, 76px) clamp(160px, 17vh, 220px);
		z-index: 2;
	}

	.hero.container {
		margin: 0 auto;
		padding-inline: clamp(var(--space-4), 3.5vw, var(--space-6));
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: clamp(var(--space-3), 1.6vw, var(--space-5));
		max-width: min(62ch, 56vw);
		padding-top: clamp(12px, 3.5vw, 64px);
		z-index: 2;
	}

	.hero-title {
		font-family: var(--font-family-system);
		font-size: clamp(40px, 5.1vw, 64px);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: -0.03em;
		color: var(--color-text-primary);
		margin: 0;
	}

	.hero-title span {
		color: var(--hero-accent);
	}

	.hero-subtitle {
		font-family: var(--font-family-system);
		font-size: clamp(var(--font-size-md), 1.25vw, 26px);
		font-weight: var(--font-weight-regular);
		line-height: 1.4;
		color: var(--color-text-secondary);
		max-width: 42ch;
		margin: 0;
	}

	.hero-cta-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-1);
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-target-min);
		padding: 0 clamp(var(--space-5), 2vw, var(--space-8));
		font-family: var(--font-family-system);
		font-size: clamp(var(--font-size-sm), 0.95vw, var(--font-size-md));
		font-weight: var(--font-weight-medium);
		line-height: 1;
		text-decoration: none;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard),
			border-color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.hero-cta-primary {
		background-color: var(--hero-accent);
		color: var(--color-text-primary);
	}

	.hero-cta-secondary {
		background-color: var(--color-surface);
		color: var(--color-text-primary);
		border-color: var(--color-border-strong);
	}

	.hero-cta:hover {
		opacity: var(--state-hover-opacity);
		text-decoration: none;
	}

	.hero-cta:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	.hero-media {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
	}

	.hero-video {
		position: absolute;
		width: var(--hero-video-size);
		height: var(--hero-video-size);
		right: 0;
		bottom: 0;
		transform: translate(var(--hero-video-offset-x), var(--hero-video-offset-y));
		object-fit: cover;
		border-radius: 999px;
		box-shadow: var(--shadow-2);
		filter: saturate(1.08) contrast(1.02);
	}

	.hero-video-ring {
		position: absolute;
		width: var(--hero-video-size);
		height: var(--hero-video-size);
		right: 0;
		bottom: 0;
		transform: translate(var(--hero-video-offset-x), var(--hero-video-offset-y));
		display: grid;
		place-items: center;
		z-index: 3;
		animation: media-ring-spin 34s linear infinite;
	}

	.hero-video-ring svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.hero-video-ring text {
		font-family: var(--font-family-system);
		font-size: clamp(1px, 0.12vw, 1px);
		font-weight: var(--font-weight-medium);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		fill: color-mix(in srgb, var(--color-text-primary) 88%, white 12%);
	}

	.hero-video-ring textPath {
		dominant-baseline: middle;
	}

	@keyframes media-ring-spin {
		from {
			transform: translate(var(--hero-video-offset-x), var(--hero-video-offset-y)) rotate(0deg);
		}
		to {
			transform: translate(var(--hero-video-offset-x), var(--hero-video-offset-y)) rotate(360deg);
		}
	}

	.hero-cta:focus-visible {
		outline: var(--focus-ring-width) solid var(--focus-ring-color);
		outline-offset: var(--focus-ring-offset);
		border-radius: var(--radius-sm);
	}

	.planner-banner {
		position: absolute;
		left: clamp(var(--space-4), 3.2vw, var(--space-8));
		right: clamp(var(--space-4), 3.2vw, var(--space-8));
		bottom: clamp(var(--space-3), 2.8vh, var(--space-7));
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-bottom: 5px solid var(--hero-accent);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-2);
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		z-index: 4;
	}

	.planner-banner-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.planner-banner-header {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.planner-banner-kicker {
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text-tertiary);
		margin: 0;
	}

	.planner-banner-title {
		font-size: var(--font-size-xl);
		line-height: var(--line-height-tight);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.planner-banner-chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: var(--space-2);
	}

	.planner-chip {
		padding: 7px 12px;
		border-radius: 999px;
		border: 1px solid var(--color-border-default);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		line-height: 1;
	}

	.planner-chip.active {
		background: var(--hero-accent);
		border-color: var(--hero-accent);
		color: var(--color-text-primary);
	}

	.planner-banner-form {
		display: grid;
		grid-template-columns: 1.6fr 1fr 1fr 0.9fr auto;
		gap: var(--space-2);
		align-items: stretch;
	}

	.planner-banner-input {
		min-height: var(--tap-target-min);
		padding: 0 12px;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-primary);
		font-size: var(--font-size-sm);
	}

	.planner-banner-date,
	.planner-banner-select {
		min-width: 0;
	}

	.planner-banner-submit {
		min-height: var(--tap-target-min);
		padding: 0 var(--space-4);
		border-radius: var(--radius-sm);
		border: 1px solid transparent;
		background: var(--hero-accent);
		color: var(--color-text-primary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
	}

	@media (min-width: 1000px) {
		.hero.container {
			max-width: 1000px;
			padding-right: var(--hero-inline-pad);
			padding-left: var(--hero-inline-pad);
		}
	}

	@media (min-width: 1200px) {
		.hero.container {
			max-width: 1200px;
			padding-right: var(--hero-inline-pad);
			padding-left: var(--hero-inline-pad);
		}
	}

	@media (min-width: 1360px) {
		.hero.container {
			max-width: 1360px;
			padding-right: var(--hero-inline-pad);
			padding-left: var(--hero-inline-pad);
		}
	}

	@media (max-width: 1040px) {
		.hero-shell {
			--hero-video-size: clamp(420px, 76vw, 680px);
			--hero-video-offset-x: 20%;
			--hero-video-offset-y: 34%;
			min-height: clamp(620px, 84svh, 860px);
		}

		.hero {
			padding-block: clamp(28px, 6vh, 52px) clamp(180px, 20vh, 260px);
		}

		.hero-content {
			padding-top: 0;
			max-width: min(58ch, 70vw);
		}

		.planner-banner-top {
			flex-direction: column;
			align-items: flex-start;
		}

		.planner-banner-chips {
			justify-content: flex-start;
		}

		.planner-banner-form {
			grid-template-columns: 1fr 1fr;
		}

		.planner-banner-submit {
			grid-column: span 2;
		}
	}

	@media (max-width: 640px) {
		.hero-shell {
			--hero-video-size: clamp(360px, 98vw, 540px);
			--hero-video-offset-x: 30%;
			--hero-video-offset-y: 36%;
			min-height: 760px;
		}

		.hero {
			padding-block: var(--space-6) 300px;
		}

		.hero-content {
			max-width: 100%;
		}

		.hero-subtitle {
			max-width: 30ch;
		}

		.hero-cta {
			min-height: 50px;
			padding: 0 20px;
			font-size: 16px;
		}

		.planner-banner {
			left: var(--space-3);
			right: var(--space-3);
			bottom: var(--space-3);
			padding: var(--space-3);
		}

		.planner-banner-form {
			grid-template-columns: 1fr;
		}

		.planner-banner-submit {
			grid-column: auto;
		}
	}
</style>
