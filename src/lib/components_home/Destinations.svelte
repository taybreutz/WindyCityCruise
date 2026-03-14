<script lang="ts">
	const destinations = [
		{
			title: 'Chicago River Cruise',
			image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80'
		},
		{
			title: 'The Playpen',
			image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80'
		},
		{
			title: 'Navy Pier Marina',
			image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80'
		},
		{
			title: 'Monroe Harbor',
			image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80'
		}
	];
</script>

<section class="destinations">
	<div class="destinations-header">
		<h2 class="destinations-heading">We can do it all.</h2>
		<p class="destinations-description">
			Our vessels navigate to every iconic Chicago destination — whether you're planning a corporate
			cruise, a friends-only party adventure, or even a wedding on the water.
		</p>
	</div>
	<div class="destinations-strip">
		{#each destinations as dest, i (dest.title)}
			<a href="/rentals" class="dest-panel" style="background-image: url({dest.image})">
				<div class="dest-overlay">
					<h3 class="dest-title">{dest.title}</h3>
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	.destinations {
		overflow: hidden;
	}

	.destinations-header {
		max-width: var(--content-narrow-width, 640px);
		margin: 0 auto;
		padding: var(--space-10, 64px) var(--space-5, 20px) var(--space-6, 24px);
		text-align: center;
	}

	.destinations-heading {
		font-family: var(--font-family-system, system-ui);
		font-size: clamp(28px, 3.2vw, 44px);
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3, 12px) 0;
	}

	.destinations-description {
		font-family: var(--font-family-system, system-ui);
		font-size: clamp(var(--font-size-md, 16px), 1.15vw, 20px);
		font-weight: var(--font-weight-regular, 400);
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.destinations-strip {
		display: flex;
		margin: 0 -2%;
	}

	.dest-panel {
		flex: 1;
		position: relative;
		height: clamp(340px, 50vh, 520px);
		background-size: cover;
		background-position: center;
		clip-path: polygon(12% 0, 100% 0, 88% 100%, 0% 100%);
		margin: 0 -1.5%;
		text-decoration: none;
		transition: flex var(--motion-duration-default, 0.3s) var(--motion-ease-standard, ease);
	}

	.dest-panel:first-child {
		clip-path: polygon(0 0, 100% 0, 88% 100%, 0% 100%);
	}

	.dest-panel:last-child {
		clip-path: polygon(12% 0, 100% 0, 100% 100%, 0% 100%);
	}

	.dest-panel:hover {
		flex: 1.3;
	}

	.dest-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: var(--space-6, 24px);
		background: linear-gradient(to top, rgba(10, 37, 64, 0.82) 0%, rgba(10, 37, 64, 0.1) 50%, transparent 100%);
		transition: background var(--motion-duration-default, 0.3s) var(--motion-ease-standard, ease);
	}

	.dest-panel:hover .dest-overlay {
		background: linear-gradient(to top, rgba(10, 37, 64, 0.9) 0%, rgba(10, 37, 64, 0.2) 60%, transparent 100%);
	}

	.dest-title {
		font-family: var(--font-family-system, system-ui);
		font-size: clamp(16px, 1.4vw, 22px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-inverse, #f9f2f0);
		text-align: center;
		margin: 0;
		letter-spacing: 0.02em;
	}

	@media (max-width: 768px) {
		.destinations-strip {
			flex-direction: column;
			margin: 0;
		}

		.dest-panel {
			height: 200px;
			clip-path: polygon(0 12%, 100% 0, 100% 88%, 0 100%);
			margin: -2% 0;
		}

		.dest-panel:first-child {
			clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
		}

		.dest-panel:last-child {
			clip-path: polygon(0 12%, 100% 0, 100% 100%, 0 100%);
		}

		.dest-panel:hover {
			flex: 1.3;
		}
	}
</style>
