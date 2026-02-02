<script lang="ts">
	import Home_Hero from '$lib/components/Home_Hero.svelte';
</script>

<Home_Hero
	title="Chicago Boat Rentals"
	subtitle="The Best Boats, Yachts, and Experiences in Chicago"
	ctaText="Explore Boats"
	ctaHref="/boats"
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
		padding: var(--spacing-layout-section-gap) var(--spacing-layout-page-margin);
		background-color: var(--color-surface-background);
	}

	.content-container {
		max-width: var(--spacing-layout-content-max-width);
		margin: 0 auto;
		text-align: center;
	}

	.section-title {
		font-size: var(--font-size-title1);
		font-weight: var(--font-weight-title1);
		line-height: var(--line-height-title1);
		letter-spacing: var(--letter-spacing-title1);
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-4) 0;
	}

	.section-text {
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-body);
		line-height: var(--line-height-body);
		letter-spacing: var(--letter-spacing-body);
		color: var(--color-text-secondary);
		max-width: 700px;
		margin: 0 auto;
	}
</style>
