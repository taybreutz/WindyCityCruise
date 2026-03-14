<script lang="ts">
	const beveragePackages = [
		{
			name: 'Beer & Wine',
			price: '$13',
			unit: '/ hr · per person',
			items: ['Sauvignon blanc', 'Pinot grigio', 'Rosé', 'Domestic beers']
		},
		{
			name: 'Call Package',
			price: '$18',
			unit: '/ hr · per person',
			featured: false,
			items: [
				'White Claw Hard Seltzers',
				'White Claw Vodka',
				'Tanqueray Gin',
				'Teremana Tequila',
				'Bacardi Rum',
				'Jim Beam Bourbon',
				'Plus beer & wine'
			],
			image: '/images/call-drinks.png'
		},
		{
			name: 'Premium Package',
			price: '$22',
			unit: '/ hr · per person',
			featured: true,
			items: [
				'Prosecco',
				'Ketel One Vodka',
				"Hendrick's Gin",
				'Casamigos Tequila',
				'Bulleit Bourbon',
				'Import beers',
				'Plus full call package'
			],
			image: '/images/premium-drinks.png'
		}
	];

	const stationedMenus = [
		{
			name: 'BBQ Bliss',
			price: '$42',
			description:
				'Garden salad with ranch and balsamic; sweet apple coleslaw; grilled vegetable kabobs; smoked pulled pork and beef brisket with brioche buns, cheddar, crispy onion strings, and BBQ sauce'
		},
		{
			name: 'Italian Street Station',
			price: '$40',
			description:
				'Caesar salad; garlic parmesan roasted potato wedges; roasted peppers and onions; Italian beef; Italian sausage, both served with French bread and mild giardiniera'
		},
		{
			name: 'Taco Truck',
			price: '$40',
			description:
				'Chipotle chopped salad; street corn salad; blue corn tortilla chips with guacamole and salsa; seasoned skirt steak and shredded chicken; hard corn and soft flour tortillas & toppings'
		},
		{
			name: "It's a Picnic!",
			price: '$35',
			description:
				'Spinach salad with poppyseed dressing; potato salad; pasta salad; all-beef hot dogs and grilled chicken with buns; assorted toppings and chips'
		}
	];

	const platters = [
		{ name: 'Classic Charcuterie Board', price: '$165', tag: 'GF' },
		{ name: 'Cheese Board', price: '$165', tag: 'Veg' },
		{ name: 'Fresh Fruit Board', price: '$140', tag: 'Veg, V, GF' },
		{ name: 'Pulled Chicken Quesadillas', price: '$155', tag: '' },
		{ name: 'Chicken Tenders', price: '$150', tag: '' },
		{ name: 'Chips & Salsa', price: '$95', tag: 'Veg, V, GF' },
		{ name: 'Pita Chips & Hummus', price: '$95', tag: 'Veg, V' },
		{ name: 'Vegetable Crudité & Ranch', price: '$95', tag: 'Veg, GF' }
	];

	const sandwiches = [
		{ name: 'Italian Sandwich', description: 'Salami, capicola, mortadella, provolone & Italian dressing on tomato focaccia' },
		{ name: 'Chicken Sandwich', description: 'Roasted chicken, bacon, and Colby Jack on a brioche roll' },
		{ name: 'Turkey Wrap', description: 'Roasted turkey, bacon, cheddar & lettuce in a flour wrap' },
		{ name: 'Caprese Sandwich', description: 'Fresh mozzarella, basil, tomato & balsamic on tomato focaccia', tag: 'Veg' },
		{ name: 'Chipotle Chicken Wrap', description: 'Chicken, romaine, pepper jack & chipotle ranch in a sundried tomato wrap' },
		{ name: 'Caesar Chicken Wrap', description: 'Chicken, romaine, shaved parmesan & Caesar dressing in a flour wrap' },
		{ name: 'Grilled Veggie Wrap', description: 'Grilled peppers, squash, zucchini, spinach & red pepper hummus in a spinach tortilla', tag: 'Veg' }
	];

	const hors = [
		{ name: 'Garlic Pesto Chicken Sliders', price: '$6.00' },
		{ name: 'Angus Cheeseburger Sliders', price: '$7.00' },
		{ name: 'Petite Italian Beef', price: '$7.00' },
		{ name: 'Antipasto Skewers', price: '$5.00', tag: 'GF' },
		{ name: 'Bacon-Wrapped Dates', price: '$5.00', tag: 'GF' },
		{ name: 'Caprese Skewers', price: '$4.00', tag: 'Veg, GF' },
		{ name: 'Truffle Mac & Cheese Bites', price: '$5.00', tag: 'Veg' },
		{ name: 'Bruschetta with Tomato & Basil', price: '$4.00', tag: 'Veg' }
	];

	const desserts = [
		{ name: 'Assorted Brownies', price: '$120', description: 'Rich chocolate brownies cut into individual portions', tag: 'Veg' },
		{ name: 'Assorted Cookies', price: '$120', description: 'Classic chocolate chip and rich double chocolate cookies', tag: 'Veg' }
	];
</script>

<svelte:head>
	<title>Catering & Drinks - Windy City Cruise</title>
</svelte:head>

<main class="page">
	<section class="hero">
		<div class="hero-inner">
			<span class="kicker">Food & Beverage</span>
			<h1 class="hero-title">Catering Menu</h1>
			<p class="hero-subtitle">
				From craft cocktails to chef-prepared stations — elevate your cruise with our full-service catering and bar packages.
			</p>
		</div>
	</section>

	<!-- Beverage Packages -->
	<section class="section">
		<div class="container">
			<h2 class="section-heading">Beverage Packages</h2>
			<div class="bev-grid">
				{#each beveragePackages as pkg (pkg.name)}
					<div class="bev-card" class:featured={pkg.featured}>
						{#if pkg.featured}
							<span class="bev-badge">Most Popular</span>
						{/if}
						<h3 class="bev-name">{pkg.name}</h3>
						<div class="bev-price">
							<span class="bev-amount">{pkg.price}</span>
							<span class="bev-unit">{pkg.unit}</span>
						</div>
						<ul class="bev-items">
							{#each pkg.items as item (item)}
								<li>{item}</li>
							{/each}
						</ul>
						{#if pkg.image}
							<div class="bev-image-wrapper">
								<img src={pkg.image} alt="{pkg.name} selection" class="bev-image" />
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Stationed Menus -->
	<section class="section section--alt">
		<div class="container">
			<div class="section-header">
				<h2 class="section-heading">Stationed Menus</h2>
				<p class="section-note">Priced per person · 20-guest minimum</p>
			</div>
			<div class="station-grid">
				{#each stationedMenus as menu (menu.name)}
					<div class="station-card">
						<div class="station-top">
							<h3 class="station-name">{menu.name}</h3>
							<span class="station-price">{menu.price}<span class="station-unit"> / person</span></span>
						</div>
						<p class="station-description">{menu.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Platters & Boards -->
	<section class="section">
		<div class="container">
			<div class="section-header">
				<h2 class="section-heading">Platters & Boards</h2>
				<p class="section-note">Serves 15–20 guests</p>
			</div>
			<div class="items-grid">
				{#each platters as item (item.name)}
					<div class="item-row">
						<div class="item-name-group">
							<span class="item-name">{item.name}</span>
							{#if item.tag}<span class="diet-tag">{item.tag}</span>{/if}
						</div>
						<span class="item-price">{item.price}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Sandwiches & Wraps -->
	<section class="section section--alt">
		<div class="container">
			<div class="section-header">
				<h2 class="section-heading">Sandwiches & Wraps</h2>
				<p class="section-note">Serves 15–20 guests · Pick up to 3 · $210</p>
			</div>
			<div class="sandwich-grid">
				{#each sandwiches as item (item.name)}
					<div class="sandwich-card">
						<div class="sandwich-name-row">
							<h4 class="sandwich-name">{item.name}</h4>
							{#if item.tag}<span class="diet-tag">{item.tag}</span>{/if}
						</div>
						<p class="sandwich-desc">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Hors d'Oeuvres -->
	<section class="section">
		<div class="container">
			<div class="section-header">
				<h2 class="section-heading">Hors d'Oeuvres</h2>
				<p class="section-note">Minimum 12 per selection</p>
			</div>
			<div class="items-grid">
				{#each hors as item (item.name)}
					<div class="item-row">
						<div class="item-name-group">
							<span class="item-name">{item.name}</span>
							{#if item.tag}<span class="diet-tag">{item.tag}</span>{/if}
						</div>
						<span class="item-price">{item.price}<span class="price-unit"> / ea</span></span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Desserts -->
	<section class="section section--alt">
		<div class="container">
			<div class="section-header">
				<h2 class="section-heading">Desserts</h2>
				<p class="section-note">Serves 15–20 guests</p>
			</div>
			<div class="dessert-grid">
				{#each desserts as item (item.name)}
					<div class="dessert-card">
						<div class="dessert-top">
							<h4 class="dessert-name">
								{item.name}
								{#if item.tag}<span class="diet-tag">{item.tag}</span>{/if}
							</h4>
							<span class="dessert-price">{item.price}</span>
						</div>
						<p class="dessert-desc">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Fine Print -->
	<section class="section">
		<div class="container container--narrow fine-print">
			<p>All food and beverage purchases are subject to an 11.25% sales tax.</p>
			<p>An 18% service charge is applied to all commercial (COI) charters to support our onboard crew and administrative operations.</p>
			<p>Catering orders require a $500 minimum and include complimentary delivery, setup, plates, and flatware.</p>
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
	}

	.hero-inner {
		max-width: var(--content-narrow-width, 680px);
		margin: 0 auto;
	}

	.kicker {
		display: inline-block;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-semibold, 600);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-frosted-blue);
		margin-bottom: var(--space-3);
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
		font-size: var(--font-size-lg, 18px);
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.section {
		padding: var(--space-10, 64px) var(--space-5, 20px);
	}

	.section--alt {
		background: var(--color-bg-secondary);
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
	}

	.container--narrow {
		max-width: 640px;
	}

	.section-header {
		margin-bottom: var(--space-5, 20px);
	}

	.section-heading {
		font-family: var(--font-family-system);
		font-size: clamp(22px, 2.5vw, 30px);
		font-weight: 800;
		letter-spacing: -0.01em;
		color: var(--color-text-primary);
		margin: 0 0 var(--space-5, 20px) 0;
	}

	.section-header .section-heading {
		margin-bottom: var(--space-1, 4px);
	}

	.section-note {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		color: var(--color-text-tertiary);
		margin: 0;
	}

	/* Beverage Packages */
	.bev-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4, 16px);
	}

	.bev-card {
		position: relative;
		background: var(--nav-bg);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg, 12px);
		padding: var(--space-5, 20px);
		display: flex;
		flex-direction: column;
		gap: var(--space-3, 12px);
		overflow: hidden;
	}

	.bev-card.featured {
		border-color: var(--color-frosted-blue);
		box-shadow: 0 0 0 1px var(--color-frosted-blue);
	}

	.bev-badge {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		padding: 4px 14px;
		border-radius: 999px;
		background: var(--color-frosted-blue);
		color: #f9f2f0;
		font-family: var(--font-family-system);
		font-size: 11px;
		font-weight: var(--font-weight-semibold, 600);
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.bev-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md, 16px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0;
	}

	.bev-price {
		display: flex;
		align-items: baseline;
		gap: 4px;
	}

	.bev-amount {
		font-family: var(--font-family-system);
		font-size: clamp(28px, 2.5vw, 36px);
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.bev-unit {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 12px);
		color: var(--color-text-tertiary);
	}

	.bev-items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		color: var(--color-text-secondary);
		line-height: 1.4;
	}

	.bev-items li::before {
		content: '· ';
		color: var(--color-frosted-blue);
		font-weight: 700;
	}

	.bev-image-wrapper {
		margin-top: auto; /* pushes it to the bottom of the flex card */
		padding-top: var(--space-4, 16px);
		display: flex;
		justify-content: center;
		margin-bottom: -40px; /* pull the margin down to let the image overflow the padding */
	}

	.bev-image {
		max-width: 100%;
		height: auto;
		object-fit: contain;
		max-height: 200px; 
		transform: translateY(20px);
		/* filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)); */
	}

	/* Stationed Menus */
	.station-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4, 16px);
	}

	.station-card {
		background: var(--nav-bg);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg, 12px);
		padding: var(--space-5, 20px);
	}

	.station-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-2, 8px);
		margin-bottom: var(--space-3, 12px);
	}

	.station-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md, 16px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0;
	}

	.station-price {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg, 18px);
		font-weight: 800;
		color: var(--color-text-primary);
		white-space: nowrap;
	}

	.station-unit {
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-regular, 400);
		color: var(--color-text-tertiary);
	}

	.station-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		line-height: 1.6;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Items Grid (Platters, Hors d'oeuvres) */
	.items-grid {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3, 12px);
		padding: 14px 0;
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.item-row:last-child {
		border-bottom: none;
	}

	.item-name-group {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.item-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-medium, 500);
		color: var(--color-text-primary);
	}

	.diet-tag {
		display: inline-flex;
		padding: 2px 8px;
		border-radius: 999px;
		background: rgba(1, 76, 186, 0.08);
		font-family: var(--font-family-system);
		font-size: 10px;
		font-weight: var(--font-weight-medium, 500);
		color: var(--color-frosted-blue);
		letter-spacing: 0.02em;
	}

	.item-price {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		white-space: nowrap;
	}

	.price-unit {
		font-weight: var(--font-weight-regular, 400);
		color: var(--color-text-tertiary);
		font-size: var(--font-size-xs, 12px);
	}

	/* Sandwiches */
	.sandwich-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3, 12px);
	}

	.sandwich-card {
		background: var(--nav-bg);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md, 8px);
		padding: var(--space-4, 16px);
	}

	.sandwich-name-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
	}

	.sandwich-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0;
	}

	.sandwich-desc {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 12px);
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Desserts */
	.dessert-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4, 16px);
	}

	.dessert-card {
		background: var(--nav-bg);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md, 8px);
		padding: var(--space-4, 16px);
	}

	.dessert-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-2, 8px);
		margin-bottom: 4px;
	}

	.dessert-name {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0;
	}

	.dessert-price {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		white-space: nowrap;
	}

	.dessert-desc {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 12px);
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Fine Print */
	.fine-print {
		text-align: center;
	}

	.fine-print p {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 12px);
		line-height: 1.6;
		color: var(--color-text-tertiary);
		margin: 0 0 var(--space-2, 8px) 0;
	}

	.fine-print p:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.hero {
			padding-top: var(--space-10, 3rem);
		}

		.bev-grid {
			grid-template-columns: 1fr;
		}

		.station-grid {
			grid-template-columns: 1fr;
		}

		.sandwich-grid {
			grid-template-columns: 1fr;
		}

		.dessert-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
