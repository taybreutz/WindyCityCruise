<script lang="ts">
	interface Props {
		title?: string;
		subtitle?: string;
		ctaText?: string;
		ctaHref?: string;
	}

	let {
		title = 'Chicago Boat Rentals',
		subtitle = 'The Best Boats, Yachts, and Experiences in Chicago',
		ctaText = 'Explore Boats',
		ctaHref = '/boats'
	}: Props = $props();
</script>

<section class="hero">
	<div class="hero-overlay"></div>
	<div class="hero-content">
		<h1 class="hero-title">{title}</h1>
		<p class="hero-subtitle">{subtitle}</p>
		<a href={ctaHref} class="hero-cta">{ctaText}</a>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface-inverse);
		background-image: linear-gradient(
			135deg,
			var(--color-surface-inverse) 0%,
			var(--color-fill-accent) 100%
		);
		overflow: hidden;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(10, 37, 64, 0.3) 0%, rgba(10, 37, 64, 0.6) 100%);
		z-index: var(--z-index-base);
	}

	.hero-content {
		position: relative;
		z-index: calc(var(--z-index-base) + 1);
		max-width: var(--spacing-layout-content-max-width);
		padding: var(--spacing-layout-page-margin);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-6);
	}

	.hero-title {
		font-size: var(--font-size-large-title);
		font-weight: var(--font-weight-large-title);
		line-height: var(--line-height-large-title);
		letter-spacing: var(--letter-spacing-large-title);
		color: var(--color-text-inverse);
		margin: 0;
	}

	.hero-subtitle {
		font-size: var(--font-size-title3);
		font-weight: var(--font-weight-body);
		line-height: var(--line-height-title3);
		letter-spacing: var(--letter-spacing-title3);
		color: var(--color-text-inverse);
		opacity: 0.9;
		max-width: 600px;
		margin: 0;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: var(--spacing-4);
		padding: var(--spacing-3) var(--spacing-6);
		background-color: var(--color-surface-background);
		color: var(--color-fill-primary);
		font-size: var(--font-size-headline);
		font-weight: var(--font-weight-headline);
		line-height: var(--line-height-headline);
		letter-spacing: var(--letter-spacing-headline);
		text-decoration: none;
		border-radius: var(--radius-component-button);
		box-shadow: var(--elevation-raised);
		transition:
			background-color var(--motion-duration-fast) var(--motion-easing-default),
			transform var(--motion-duration-fast) var(--motion-easing-default),
			box-shadow var(--motion-duration-fast) var(--motion-easing-default);
	}

	.hero-cta:hover {
		background-color: var(--color-surface-primary);
		box-shadow: var(--elevation-floating);
		text-decoration: none;
		transform: translateY(-2px);
	}

	.hero-cta:active {
		transform: translateY(0);
		box-shadow: var(--elevation-raised);
	}

	@media (min-width: 768px) {
		.hero-title {
			font-size: 48px;
			line-height: 56px;
		}

		.hero-subtitle {
			font-size: var(--font-size-title2);
			line-height: var(--line-height-title2);
		}
	}

	@media (min-width: 1024px) {
		.hero-title {
			font-size: 64px;
			line-height: 72px;
		}
	}
</style>
