<script lang="ts">
	const membershipTiers = [
		{
			name: 'Half Membership',
			reservations: 10,
			weekendDays: 4,
			weekdays: 6,
			coMembers: 2
		},
		{
			name: 'Full Membership',
			reservations: 20,
			weekendDays: 8,
			weekdays: 12,
			coMembers: 4
		}
	];

	const fleet = [
		{
			name: "34' Rinker Fiesta Vee",
			description:
				'One of our newest vessels, this Rinker comes equipped with a fully upgraded JL Audio bluetooth system, a spacious cockpit for its class, and a modern cherry finish interior equipped with a bathroom.',
			halfPrice: '$6,450',
			fullPrice: '$10,950',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/34_Rinker.png?v=1708121367&width=1420'
		},
		{
			name: "37' Sea Ray Sundancer",
			description:
				"This yacht's cockpit is well-equipped featuring a full wet bar with sink and fridge, an extended bimini, and a walk through windshield. The interior features modern cherry finishes, a galley, and 2 beds.",
			halfPrice: '$6,950',
			fullPrice: '$11,950',
			image:
				'https://chicagoboatinghub.com/cdn/shop/files/2_2a0176fc-7951-43ca-bc87-f02441c2844a.jpg?v=1726095104&width=1420'
		},
		{
			name: "37' Rinker Fiesta Vee",
			description:
				"This yacht's cockpit is well-equipped featuring a full wet bar with sink and fridge, an extended bimini, and a walk through windshield. The interior features modern cherry finishes, a galley, and 2 beds.",
			halfPrice: '$7,650',
			fullPrice: '$12,950',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/37_Rinker.png?v=1708121357&width=1420'
		},
		{
			name: "46' Sea Ray Express",
			description:
				'Equipped with an upgraded JL audio bluetooth sound system, starboard facing U-shaped seating area, and full sized cabin with bathroom. This express style cruiser is great for family outings and entertainment.',
			halfPrice: '$9,250',
			fullPrice: '$15,850',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/46_Sea_Ray.png?v=1708121344&width=1420'
		},
		{
			name: "55' Sea Ray Sundancer",
			description:
				"Configured with wraparound seating for 8 and an additional cockpit bench, this yacht's cockpit is great for all social, family, and business occasions. Below deck, the salon features a plush circular lounge, custom countertop, 2 bedrooms, and 2 bathrooms.",
			halfPrice: '$11,150',
			fullPrice: '$18,950',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/55_Sea_Ray.png?v=1708121053&width=1420'
		},
		{
			name: "70' Sea Ray Sun Sport",
			description:
				"Equipped with an enormous cockpit with ample seating, sun pad, and wet bar, this sleek and luxurious 70' ft yacht has one of the largest entertaining cockpits that Sea Ray ever made. The cabin is equipped with a full size saloon, kitchen galley, 3 staterooms, and 3 bathrooms.",
			halfPrice: '$13,750',
			fullPrice: '$23,550',
			image: 'https://chicagoboatinghub.com/cdn/shop/files/70_Sea_Ray.png?v=1708121013&width=1420'
		}
	];

	const benefits = [
		{
			title: 'Turn Key',
			description:
				'Enjoy a boat all summer without the hassles of ownership. This means no cleaning, storage, docking, and routine maintenance. Just jump aboard and take off!'
		},
		{
			title: 'No Hidden Fees',
			description:
				'NO initiation or hidden fees. Fuel costs, taxes, docking, and cleaning are already bundled in the membership cost. With us, everything is included.'
		},
		{
			title: 'Advanced Booking',
			description:
				'Book with confidence and enjoy full access to an online booking platform to reserve, modify, and cancel the dates and times you want, when you want!'
		},
		{
			title: 'Training',
			description:
				'As a member, you will receive an extensive on-site training and additional 1 on 1 captain training sessions.'
		}
	];
</script>

<svelte:head>
	<title>Chicago Boat Club - Chicago Boating Hub</title>
</svelte:head>

<main class="page">
	<section class="hero-section">
		<div class="hero-content">
			<h1 class="hero-title">Chicago Boat Club</h1>
			<p class="hero-subtitle">The Smarter Alternative To Boat Ownership</p>
			<a href="/boat-club/apply" class="cta-button">Apply Now</a>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container">
			<div class="tiers-grid">
				{#each membershipTiers as tier}
					<div class="tier-card">
						<h3 class="tier-name">{tier.name}</h3>
						<ul class="tier-details">
							<li>{tier.reservations} Reservations</li>
							<li>{tier.weekendDays} Weekend Days + {tier.weekdays} Weekdays</li>
							<li>Up to {tier.coMembers} Co-Members</li>
						</ul>
					</div>
				{/each}
			</div>
			<p class="price-callout">
				Get all the perks of boat ownership without the hassle! Enjoy boating all summer for
				<strong>$340/month</strong> with our membership program!
			</p>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container">
			<h2 class="section-title">Yacht Membership Program</h2>
			<p class="body-text">
				Experience the exclusivity of Chicago's best yacht membership. Enjoy access to a premium
				fleet, no hidden fees, hassle-free booking, and dedicated concierge support—all starting at
				just <strong>$340/month</strong>. Elevate your summers with effortless luxury and join the
				elite boating lifestyle today.
			</p>
		</div>
	</section>

	<section class="content-section">
		<div class="wide-container">
			<h2 class="section-title centered">Membership Fleet Options</h2>
			<div class="fleet-grid">
				{#each fleet as boat}
					<div class="fleet-card">
						<div class="fleet-image-container">
							<img src={boat.image} alt={boat.name} class="fleet-image" />
						</div>
						<div class="fleet-info">
							<h3 class="fleet-name">{boat.name}</h3>
							<p class="fleet-description">{boat.description}</p>
							<p class="fleet-pricing">
								<span class="price-label">Half:</span> {boat.halfPrice}
								<span class="price-divider"></span>
								<span class="price-label">Full:</span> {boat.fullPrice}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container">
			<h2 class="section-title centered">Membership Benefits</h2>
			<div class="benefits-grid">
				{#each benefits as benefit}
					<div class="benefit-card">
						<h3 class="benefit-title">{benefit.title}</h3>
						<p class="benefit-description">{benefit.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container centered">
			<h2 class="section-title">Ready to Get Started?</h2>
			<p class="body-text">
				Apply today and start enjoying hassle-free boating on Lake Michigan.
			</p>
			<a href="/boat-club/apply" class="cta-button">Apply Now</a>
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
		margin: 0 0 var(--space-3) 0;
	}

	.hero-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-6) 0;
	}

	.cta-button {
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
		max-width: var(--content-narrow-width);
		margin: 0 auto;
	}

	.wide-container {
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

	.tiers-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-5);
		margin-bottom: var(--space-6);
	}

	.tier-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-6);
	}

	.tier-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.tier-details {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.tier-details li {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.tier-details li:last-child {
		border-bottom: none;
	}

	.price-callout {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		color: var(--color-text-secondary);
		text-align: center;
		margin: 0;
	}

	.price-callout strong {
		color: var(--color-accent-primary);
		font-weight: var(--font-weight-semibold);
	}

	.fleet-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		gap: var(--space-6);
	}

	.fleet-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.fleet-image-container {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.fleet-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.fleet-info {
		padding: var(--space-5);
	}

	.fleet-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.fleet-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0 0 var(--space-4) 0;
	}

	.fleet-pricing {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		margin: 0;
	}

	.price-label {
		color: var(--color-text-tertiary);
	}

	.price-divider {
		display: inline-block;
		width: var(--space-4);
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: var(--space-5);
		margin-top: var(--space-6);
	}

	.benefit-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-5);
	}

	.benefit-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.benefit-description {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: var(--font-size-xl);
		}

		.section-title {
			font-size: var(--font-size-lg);
		}

		.fleet-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
