<script lang="ts">
</script>

<svelte:head>
	<title>About Us - Windy City Cruise</title>
</svelte:head>

<main class="page">
	<section class="hero-section">
		<div class="hero-image-container">
			<img
				src="https://chicagoboatinghub.com/cdn/shop/files/ECD07BFE-553A-49AB-8A7A-B231C62A3FAE.jpg?v=1707426319&width=1500"
				alt="Chicago Playpen aerial view"
				class="hero-image"
			/>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container">
			<h1 class="page-title">Chicago's Infamous Boating Spot: The Playpen</h1>
			<p class="body-text">
				Nestled between Oak Street Beach and Navy Pier, the Playpen stands as an iconic summertime
				sanctuary in the heart of Chicago. This lakeside gem, cherished by the city's passionate
				boaters and party enthusiasts, epitomizes the essence of summer fun and camaraderie.
			</p>
			<p class="body-text">
				Protected by its break wall, the Playpen offers tranquil waters and a breathtaking backdrop
				of Chicago's iconic skyline, setting the stage for unforgettable experiences on the water.
				Beyond being a mere destination, it's a vibrant community where strangers become friends and
				every moment feels like home.
			</p>
			<p class="body-text">
				Here, amidst the laughter and shared adventures, you'll find a sense of belonging that keeps
				you anchored in the present moment. As a beloved muse for capturing cherished memories, the
				Playpen is not just a spot on the map – it's a cherished chapter in the stories of those who
				revel in its magic.
			</p>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container">
			<h2 class="section-title">Our Mission</h2>
			<p class="body-text">
				We are dedicated to infusing the vibrant spirit of the Playpen into every Chicago boating
				adventure. Our passionate team is committed to empowering our customers with the essential
				tools to craft unforgettable experiences on the water.
			</p>
			<p class="body-text">
				With our innovative booking platform, discovering and securing the perfect boating excursion
				tailored to your preferences has never been easier. And it doesn't end there – we're proud
				to offer a carefully curated selection of Chicago boating merchandise, from chic apparel to
				must-have accessories, designed to elevate your boating experience and help you conquer
				Chicago's ever-changing weather.
			</p>
			<p class="body-text">
				Join us as we redefine the Chicago boating experience, one adventure at a time.
			</p>

			<div class="social-links">
				<a
					href="https://www.instagram.com/chicagoboatcrew/"
					class="social-link"
					target="_blank"
					rel="noopener noreferrer"
				>
					Instagram: @chicagoboatcrew
				</a>
				<a
					href="https://www.tiktok.com/@chicagoboatcrewofficial"
					class="social-link"
					target="_blank"
					rel="noopener noreferrer"
				>
					TikTok: @chicagoboatcrewofficial
				</a>
				<a
					href="https://www.youtube.com/channel/UCjBW4C0qUUxCIhwktRVeFFQ"
					class="social-link"
					target="_blank"
					rel="noopener noreferrer"
				>
					YouTube: @chicagoboatcrew
				</a>
			</div>
		</div>
	</section>
</main>

<style>
	.page {
		min-height: 100vh;
	}

	.hero-section {
		width: 100%;
		max-width: var(--content-max-width);
		margin: 0 auto;
		padding: var(--space-6) var(--space-5);
	}

	.hero-image-container {
		width: 100%;
		height: 400px;
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.hero-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.content-section {
		padding: var(--space-10) var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.content-section--alt {
		background-color: var(--color-bg-secondary);
	}

	.content-container {
		max-width: var(--content-narrow-width);
		margin: 0 auto;
	}

	.page-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-6) 0;
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-5) 0;
	}

	.body-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	.body-text:last-of-type {
		margin-bottom: 0;
	}

	.social-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}

	.social-link {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent-primary);
		text-decoration: none;
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.social-link:hover {
		opacity: var(--state-hover-opacity);
	}

	@media (max-width: 768px) {
		.hero-image-container {
			height: 280px;
		}

		.page-title {
			font-size: var(--font-size-xl);
		}

		.section-title {
			font-size: var(--font-size-lg);
		}
	}
</style>
