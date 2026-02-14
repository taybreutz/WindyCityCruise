<script lang="ts"></script>

<section class="hero">
	<div class="hero-content">
		<h1 class="hero-title">Chicago Boat Rentals & <br /> Luxury Yacht Charters</h1>
		<p class="hero-subtitle">
			The all in one place for the best boats, yachts, and water experiences in Chicago.
		</p>
		<div class="hero-cta-container">
			<a href="/rentals" class="hero-cta hero-cta-primary">Book a Boat</a>
			<a href="/boat-club" class="hero-cta hero-cta-secondary">Memberships</a>
		</div>
	</div>
	<div class="hero-media">
		<video
			src="https://cdn.shopify.com/videos/c/o/v/11ba9511dd96488baa7ab28c502cf80a.mp4"
			autoplay
			loop
			muted
			playsinline
			preload="auto"
			class="hero-video"
		></video>
	</div>
</section>

<style>
	.hero {
		position: relative;
		height: 70vh;
		max-width: var(--content-max-width);
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		align-items: center;
		gap: var(--space-8);
		margin: 0 auto;
		padding: var(--space-8) var(--space-5);
		overflow: visible;
	}

	.hero-media {
		position: relative;
		height: 100%;
		min-height: 400px;
		border-radius: var(--radius-lg);
		overflow: visible;
		animation: fadeIn var(--motion-duration-slow) var(--motion-ease-emphasized);
	}

	.hero-video {
		border-radius: var(--radius-lg);
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			filter: blur(8px);
		}
		100% {
			opacity: 1;
			filter: blur(0);
		}
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-5);
	}

	.hero-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-2xl);
		font-weight: 900;
		line-height: var(--line-height-tight);
		margin: 0;
	}

	.hero-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		max-width: 480px;
		margin: 0;
	}

	.hero-cta-container {
		display: flex;
		flex-direction: row;
		gap: var(--space-3);
		margin-top: var(--space-3);
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-target-min);
		padding: 0 var(--space-5);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		line-height: var(--line-height-tight);
		text-decoration: none;
		border-radius: var(--radius-sm);
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.hero-cta-primary {
		background-color: var(--button-primary-bg);
		color: var(--button-primary-text);
	}

	.hero-cta-secondary {
		background-color: var(--button-secondary-bg);
		color: var(--button-secondary-text);
	}

	.hero-cta:hover {
		opacity: var(--state-hover-opacity);
		text-decoration: none;
	}

	.hero-cta:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	@media (max-width: 900px) {
		.hero {
			grid-template-columns: 1fr;
			min-height: auto;
			height: auto;
			padding: var(--space-6) var(--space-4);
		}

		.hero-content {
			align-items: center;
			text-align: center;
			order: 2;
		}

		.hero-media {
			order: 1;
			min-height: 300px;
		}

		.hero-subtitle {
			max-width: 100%;
		}

		.hero-cta-container {
			justify-content: center;
		}
	}

	@media (min-width: 768px) {
		.hero-title {
			font-size: 40px;
		}
	}

	@media (min-width: 1024px) {
		.hero-title {
			font-size: 48px;
		}
	}
</style>
