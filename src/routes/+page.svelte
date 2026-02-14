<script lang="ts">
	import Home_Hero from '$lib/components_home/Hero.svelte';
	import FindBoatMapSection from '$lib/components_home/FindBoatMapSection.svelte';

	const experiences = [
		{
			title: 'Chicago Boat Rentals',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/IMG_8731.jpg?v=1749571238&width=1420',
			href: '/rentals'
		},
		{
			title: 'Chicago Boat Club',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/IMG-9453.jpg?v=1709607508&width=1420',
			href: '/boat-club'
		}
	];

	const fleetTiers = [
		{
			name: 'Sport',
			description:
				"This tier offers 30-40' boats that are ideal for day trips and river cruises, and are an efficient way to explore the waters and scenery.",
			boats: [
				{
					name: "33' Rinker Fiesta Vee",
					rate: '$200 per hour',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/33_Rinker_Fiesta_Vee_f8cd916e-85bc-481a-ab10-0f89d378431f.png?v=1709595569&width=3840'
				},
				{
					name: "34' Rinker Fiesta Vee",
					rate: '$237.50 per hour',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/1_cfae6624-578b-4260-957b-20f99c077c62.png?v=1709596310&width=3840'
				},
				{
					name: "37' Rinker Fiesta Vee",
					rate: '$262.50 per hour',
					image: 'https://chicagoboatinghub.com/cdn/shop/files/1_1.png?v=1709597532&width=3840'
				},
				{
					name: "37' Sea Ray Sundancer",
					rate: '$262.50 per hour',
					image: 'https://chicagoboatinghub.com/cdn/shop/files/1.jpg?v=1709597983&width=3840'
				}
			]
		},
		{
			name: 'Premium',
			description:
				"For more luxury and comfort, we suggest one of the premium vessels. Ranging from 40-50' in length, these yachts are equipped with additional amenities such as air conditioned cabins, full kitchens and ample entertaining areas. They are the perfect choice for longer outings on the water.",
			boats: [
				{
					name: "46' Sea Ray Express",
					rate: '$325 per hour',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/1_e454cb2e-4054-48a2-b88c-a05bfd3b530a.jpg?v=1709601158&width=3840'
				},
				{
					name: "50' Sea Ray Sundancer",
					rate: '$275 per hour',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/Copy_of_1.jpg?v=1709601859&width=3840'
				}
			]
		},
		{
			name: 'Luxe',
			description:
				"For the ultimate entertaining experience, the Luxe offerings will always impress. These high end 50-70' yachts come equipped with state of the art sound systems, multiple staterooms, and newly updated interiors. These yachts are the most luxurious option for hosting unforgettable events and celebrations.",
			boats: [
				{
					name: "55' Sea Ray Sundancer",
					rate: '$337.50 per hour',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/393068.5f37d0254c05527fce4a49ac.xl.jpg?v=1709602387&width=3840'
				},
				{
					name: "56' Sea Ray Sundancer",
					rate: '$362.50 per hour',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/5129859_20150619083624215_1_LARGE_d4464b55-5c05-4a11-8dc8-c0112cde0c5c.jpg?v=1709603332&width=3840'
				},
				{
					name: "70' Sea Ray Sun Sport",
					rate: '$387.50 per hour',
					image: 'https://chicagoboatinghub.com/cdn/shop/files/1_1.jpg?v=1709603806&width=3840'
				}
			]
		}
	];

	const merchCategories = [
		{
			title: 'Sweatshirts',
			href: 'https://chicagoboatinghub.com/collections/sweatshirts',
			products: [
				{
					name: 'Summertime Chi Hoodie - Black',
					price: '$48.00',
					image: 'https://chicagoboatinghub.com/cdn/shop/files/IMG_2462.jpg?v=1716132709&width=533'
				},
				{
					name: 'Chicago Boat Crew Classic Hoodie - Sky Blue',
					price: '$48.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/unisex-premium-hoodie-sky-blue-front-684720f020e61.jpg?v=1749491960&width=533'
				},
				{
					name: 'Always Be Kind Hoodie - White',
					price: '$48.00',
					image: 'https://chicagoboatinghub.com/cdn/shop/files/Subject_8.png?v=1717252031&width=533'
				},
				{
					name: 'Chicago Boat Crew Classic Hoodie - Navy',
					price: '$48.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/unisex-premium-hoodie-navy-blazer-front-6847204f6faf6.jpg?v=1749491800&width=533'
				}
			]
		},
		{
			title: 'T-Shirts',
			href: 'https://chicagoboatinghub.com/collections/t-shirts',
			products: [
				{
					name: 'Summertime Chi - Ivory',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/IvorySummertimeChiT-Shirt.png?v=1749600129&width=533'
				},
				{
					name: 'Summertime Chi - Navy',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/Navy_Summertime_Chi_T-Shirt.png?v=1749600048&width=533'
				},
				{
					name: 'Long Sleeve T-Shirt - Black',
					price: '$32.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/unisex-long-sleeve-tee-black-front-684738e761075.jpg?v=1749498097&width=533'
				},
				{
					name: 'Long Sleeve T-Shirt - White',
					price: '$32.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/unisex-long-sleeve-tee-white-front-68471bfd2cab3.jpg?v=1749490694&width=533'
				}
			]
		},
		{
			title: 'Hats',
			href: 'https://chicagoboatinghub.com/collections/hats',
			products: [
				{
					name: 'Chicago Boat Crew Trucker',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/foam-trucker-hat-white-royal-red-one-size-front-68470f034aeb0.jpg?v=1749487371&width=533'
				},
				{
					name: 'Snapback - Black',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/classic-snapback-black-front-684711eeafd6b.jpg?v=1749488117&width=533'
				},
				{
					name: 'Bucket - Light Denim',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/denim-bucket-hat-light-denim-front-68470ffb6675c.jpg?v=1749487618&width=533'
				},
				{
					name: 'Visor - White',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/visor-white-front-684714571b871.jpg?v=1749488733&width=533'
				}
			]
		},
		{
			title: 'Tanks',
			href: 'https://chicagoboatinghub.com/collections/tanks',
			products: [
				{
					name: 'Chicago Boat Crew - Black',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/mens-premium-tank-top-black-front-6843616f65340.jpg?v=1749246329&width=533'
				},
				{
					name: 'Chicago Boat Crew - Blue',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/mens-premium-tank-top-team-royal-front-684361c8d327c.jpg?v=1749246420&width=533'
				},
				{
					name: 'Chicago Boat Crew - White',
					price: '$28.00',
					image:
						'https://chicagoboatinghub.com/cdn/shop/files/mens-premium-tank-top-white-front-6843627c4cf7b.jpg?v=1749246599&width=533'
				}
			]
		}
	];

	const jacketCategories = [
		{
			title: "Men's Jackets",
			href: 'https://chicagoboatinghub.com/collections/jacket',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/embroidered-champion-packable-jacket-black-front-68471fb448110.jpg?v=1749491646&width=1420'
		},
		{
			title: "Women's Jackets",
			href: 'https://chicagoboatinghub.com/collections/jackets-women',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/all-over-print-womens-cropped-windbreaker-black-front-6847195c54e31.jpg?v=1749490024&width=1420'
		}
	];
</script>

<svelte:head>
	<title>Chicago Boating Hub | Boat Rentals & Charters in the Playpen</title>
</svelte:head>

<Home_Hero />

<FindBoatMapSection />

<!-- Boating Experiences -->
<section class="section">
	<div class="container">
		<h2 class="section-title centered">Boating Experiences</h2>
		<div class="experiences-grid">
			{#each experiences as exp (exp.title)}
				<a href={exp.href} class="experience-card">
					<div class="experience-image-container">
						<img src={exp.image} alt={exp.title} class="experience-image" />
					</div>
					<div class="experience-overlay">
						<h3 class="experience-title">{exp.title}</h3>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Why Choose Us -->
<section class="section section--alt">
	<div class="container-narrow">
		<p class="section-label">About Chicago Boating Hub</p>
		<h2 class="section-title">Why Choose Us?</h2>
		<p class="section-text">
			Chicago Boating Hub is a boat rental company that specializes in yacht rentals, memberships,
			and corporate events for up to 150 passengers. Offering over 30 iconic vessels from 37' sport
			cruisers to 72' luxurious yachts, our teams bring 20+ years of boating and hospitality
			experience, providing the best boat rentals in Chicago.
		</p>
	</div>
</section>

<!-- The Fleet -->
<section class="section">
	<div class="container">
		<h2 class="section-title centered">The Fleet</h2>

		{#each fleetTiers as tier (tier.name)}
			<div class="fleet-tier">
				<div class="tier-header">
					<h3 class="tier-name">{tier.name}</h3>
					<p class="tier-description">{tier.description}</p>
				</div>
				<div class="boats-grid">
					{#each tier.boats as boat (boat.name)}
						<div class="boat-card">
							<div class="boat-image-container">
								<img src={boat.image} alt={boat.name} class="boat-image" />
							</div>
							<div class="boat-info">
								<h4 class="boat-name">{boat.name}</h4>
								<p class="boat-rate">Rates start at {boat.rate}</p>
								<a href="/rentals" class="boat-cta">Book Now</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- Merch Section -->
<section class="section section--alt">
	<div class="container">
		<h2 class="section-title centered">Shop Our Chicago Boating Merch</h2>

		{#each merchCategories as category (category.title)}
			<div class="merch-category">
				<div class="merch-header">
					<h3 class="merch-category-title">{category.title}</h3>
					<a href={category.href} class="view-all-link" target="_blank" rel="noopener noreferrer"
						>View all</a
					>
				</div>
				<div class="products-grid">
					{#each category.products as product (product.name)}
						<div class="product-card">
							<div class="product-image-container">
								<img src={product.image} alt={product.name} class="product-image" />
							</div>
							<div class="product-info">
								<h4 class="product-name">{product.name}</h4>
								<p class="product-price">{product.price} USD</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<!-- Jackets -->
		<div class="merch-category">
			<h3 class="merch-category-title">Jackets</h3>
			<div class="jackets-grid">
				{#each jacketCategories as jacket (jacket.title)}
					<a href={jacket.href} class="jacket-card" target="_blank" rel="noopener noreferrer">
						<div class="jacket-image-container">
							<img src={jacket.image} alt={jacket.title} class="jacket-image" />
						</div>
						<div class="jacket-overlay">
							<span class="jacket-title">{jacket.title}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<div class="shop-all-container">
			<a
				href="https://chicagoboatinghub.com/collections/all"
				class="shop-all-button"
				target="_blank"
				rel="noopener noreferrer"
			>
				Shop All Products
			</a>
		</div>
	</div>
</section>

<style>
	.section {
		padding: var(--space-10) var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.section--alt {
		background-color: var(--color-bg-secondary);
	}

	.container {
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.container-narrow {
		max-width: var(--content-narrow-width);
		margin: 0 auto;
		text-align: center;
	}

	.section-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 var(--space-2) 0;
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-5) 0;
	}

	.section-title.centered {
		text-align: center;
	}

	.section-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Experiences */
	.experiences-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-5);
	}

	.experience-card {
		position: relative;
		display: block;
		height: 320px;
		border-radius: var(--radius-md);
		overflow: hidden;
		text-decoration: none;
	}

	.experience-image-container {
		position: absolute;
		inset: 0;
	}

	.experience-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--motion-duration-default) var(--motion-ease-standard);
	}

	.experience-card:hover .experience-image {
		transform: scale(1.05);
	}

	.experience-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		padding: var(--space-6);
		background: linear-gradient(to top, rgba(10, 37, 64, 0.8) 0%, transparent 50%);
	}

	.experience-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-inverse);
		margin: 0;
	}

	/* Fleet */
	.fleet-tier {
		margin-bottom: var(--space-10);
	}

	.fleet-tier:last-child {
		margin-bottom: 0;
	}

	.tier-header {
		margin-bottom: var(--space-5);
	}

	.tier-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.tier-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0;
		max-width: 720px;
	}

	.boats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: var(--space-5);
	}

	.boat-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.boat-image-container {
		width: 100%;
		height: 180px;
		overflow: hidden;
	}

	.boat-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.boat-info {
		padding: var(--space-4);
	}

	.boat-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.boat-rate {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-3) 0;
	}

	.boat-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 36px;
		padding: 0 var(--space-4);
		background-color: var(--button-primary-bg);
		color: var(--button-primary-text);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		text-decoration: none;
		border-radius: var(--radius-sm);
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.boat-cta:hover {
		opacity: var(--state-hover-opacity);
	}

	.boat-cta:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	/* Merch */
	.merch-category {
		margin-bottom: var(--space-8);
	}

	.merch-category:last-child {
		margin-bottom: 0;
	}

	.merch-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.merch-category-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.view-all-link {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent-primary);
		text-decoration: none;
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.view-all-link:hover {
		opacity: var(--state-hover-opacity);
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-4);
	}

	.product-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.product-image-container {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.product-info {
		padding: var(--space-3);
	}

	.product-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.product-price {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Jackets */
	.jackets-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-5);
		margin-top: var(--space-4);
	}

	.jacket-card {
		position: relative;
		display: block;
		height: 280px;
		border-radius: var(--radius-md);
		overflow: hidden;
		text-decoration: none;
	}

	.jacket-image-container {
		position: absolute;
		inset: 0;
	}

	.jacket-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--motion-duration-default) var(--motion-ease-standard);
	}

	.jacket-card:hover .jacket-image {
		transform: scale(1.05);
	}

	.jacket-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		padding: var(--space-5);
		background: linear-gradient(to top, rgba(10, 37, 64, 0.8) 0%, transparent 50%);
	}

	.jacket-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-inverse);
	}

	.shop-all-container {
		display: flex;
		justify-content: center;
		margin-top: var(--space-8);
	}

	.shop-all-button {
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

	.shop-all-button:hover {
		opacity: var(--state-hover-opacity);
	}

	.shop-all-button:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	@media (max-width: 768px) {
		.section-title {
			font-size: var(--font-size-lg);
		}

		.experiences-grid {
			grid-template-columns: 1fr;
		}

		.experience-card {
			height: 240px;
		}

		.jackets-grid {
			grid-template-columns: 1fr;
		}

		.jacket-card {
			height: 200px;
		}

		.products-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
