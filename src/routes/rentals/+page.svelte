<script lang="ts">
	const boatingOptions = [
		{
			title: 'Large Groups',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/Tailgate_The_Lake.jpg?v=1704772970&width=1420',
			href: '/rentals/large-groups'
		},
		{
			title: 'Luxury',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/luxury.jpg?v=1701712522&width=1420',
			href: '/luxury'
		},
		{
			title: 'Wakesurfing',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/IMG_2870_524a6adb-7e61-44ec-b795-3076514dc0ba.jpg?v=1701575842&width=1420',
			href: '/wakesurfing'
		}
	];

	const galleryImages = [
		{
			src: 'https://chicagoboatinghub.com/cdn/shop/files/DJI_0984.jpg?v=1701788456&width=3000',
			alt: 'Aerial view of Chicago lakefront'
		},
		{
			src: 'https://chicagoboatinghub.com/cdn/shop/files/Fireworks.png?v=1749579185&width=3000',
			alt: 'Fireworks over Chicago'
		},
		{
			src: 'https://chicagoboatinghub.com/cdn/shop/files/DJI_0986.jpg?v=1701788934&width=3000',
			alt: 'Chicago skyline from the lake'
		}
	];
</script>

<svelte:head>
	<title>Chicago Boat Rentals & Luxury Yacht Charters - Chicago Boating Hub</title>
</svelte:head>

<main class="page">
	<section class="hero-section">
		<div class="hero-content">
			<h1 class="hero-title">Chicago Boat Rentals & Luxury Yacht Charters</h1>
			<div class="cta-group">
				<a
					href="https://fareharbor.com/embeds/book/knotmyboatcharters/?sheet-uuid=b525af1c-800e-4d14-a26b-6d45dacef65b&asn=theplaypenchicago&full-items=yes"
					class="cta-button cta-primary"
					target="_blank"
					rel="noopener noreferrer"
				>
					Book a Powerboat
				</a>
				<a href="/rentals/sailboats" class="cta-button cta-secondary">Book a Sailboat</a>
			</div>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container">
			<h2 class="section-title centered">Other Boating Options</h2>
			<div class="options-grid">
				{#each boatingOptions as option}
					<a href={option.href} class="option-card">
						<div class="option-image-container">
							<img src={option.image} alt={option.title} class="option-image" />
						</div>
						<div class="option-overlay">
							<h3 class="option-title">{option.title}</h3>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="gallery-section">
		<div class="gallery-grid">
			{#each galleryImages as image}
				<div class="gallery-item">
					<img src={image.src} alt={image.alt} class="gallery-image" />
				</div>
			{/each}
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container centered">
			<p class="promo-text">
				Use Code <strong>BOATCREW10</strong> For 10% Off All Powerboats
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
		margin: 0 0 var(--space-6) 0;
	}

	.cta-group {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-3);
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-target-min);
		padding: 0 var(--space-6);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		text-decoration: none;
		border-radius: var(--radius-sm);
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.cta-primary {
		background-color: var(--button-primary-bg);
		color: var(--button-primary-text);
	}

	.cta-secondary {
		background-color: var(--button-secondary-bg);
		color: var(--button-secondary-text);
	}

	.cta-button:hover {
		opacity: var(--state-hover-opacity);
	}

	.cta-button:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	.content-section {
		padding: var(--space-10) var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.content-section--alt {
		background-color: var(--color-bg-secondary);
	}

	.content-container {
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.centered {
		text-align: center;
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-6) 0;
	}

	.options-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-5);
	}

	.option-card {
		position: relative;
		display: block;
		height: 280px;
		border-radius: var(--radius-md);
		overflow: hidden;
		text-decoration: none;
	}

	.option-image-container {
		position: absolute;
		inset: 0;
	}

	.option-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--motion-duration-default) var(--motion-ease-standard);
	}

	.option-card:hover .option-image {
		transform: scale(1.05);
	}

	.option-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		padding: var(--space-5);
		background: linear-gradient(to top, rgba(10, 37, 64, 0.8) 0%, transparent 60%);
	}

	.option-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-inverse);
		margin: 0;
	}

	.gallery-section {
		padding: var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3);
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.gallery-item {
		aspect-ratio: 16 / 10;
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.gallery-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.promo-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-regular);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.promo-text strong {
		color: var(--color-accent-primary);
		font-weight: var(--font-weight-semibold);
	}

	@media (max-width: 900px) {
		.options-grid {
			grid-template-columns: 1fr;
		}

		.gallery-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: var(--font-size-xl);
		}

		.section-title {
			font-size: var(--font-size-lg);
		}

		.option-card {
			height: 200px;
		}
	}
</style>
