<script lang="ts">
	import Home_Hero from '$lib/components_home/Hero.svelte';
</script>

<Home_Hero
	title="Chicago Boat Rentals"
	subtitle="The Best Boats, Yachts, and Experiences in Chicago all in one place."
	ctaText="Book Now"
	ctaHref="/book"
	ctaText2="Explore Boats"
	ctaHref2="/boats"
/>

<section class="content-section">
	<div class="content-container">
		<h2 class="section-title">Welcome to Chicago Boating Hub</h2>
		<p class="section-text">
			Partnered with the leading boat rental companies in Chicago, we provide a platform for
			customers to find and book the perfect boat for their needs. Our partners are vetted and
			insured, and we offer a seamless booking experience.
		</p>
	</div>
</section>

<style>
	.content-section {
		padding: var(--space-10) var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.content-container {
		max-width: var(--content-narrow-width);
		margin: 0 auto;
		text-align: center;
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.section-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		margin: 0;
	}
</style>
