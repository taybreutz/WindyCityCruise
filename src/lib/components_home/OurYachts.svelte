<script lang="ts">
	const yachts = [
		{
			name: "The Sophisticated Lady",
			capacity: 49,
			length: "55'",
			tagline: 'Intimate cruises with skyline views',
			image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80',
			rate: 'From $337/hr'
		},
		{
			name: 'Chicago Spirit',
			capacity: 100,
			length: "72'",
			tagline: 'Corporate events & celebrations',
			image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1200&q=80',
			rate: 'From $475/hr'
		},
		{
			name: 'Lake Queen',
			capacity: 49,
			length: "56'",
			tagline: 'Premium sunset cruises',
			image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=80',
			rate: 'From $362/hr'
		},
		{
			name: 'Windy City Voyager',
			capacity: 150,
			length: "90'",
			tagline: 'Large-scale events on the water',
			image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
			rate: 'From $625/hr'
		},
		{
			name: 'Navy Pier Dreamer',
			capacity: 200,
			length: "110'",
			tagline: 'The ultimate wedding & gala yacht',
			image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=80',
			rate: 'From $850/hr'
		}
	];

	let track: HTMLDivElement | undefined = $state(undefined);
	let activeIndex = $state(0);

	function scrollToIndex(i: number) {
		if (!track) return;
		const cards = track.querySelectorAll('.yacht-card');
		if (!cards[i]) return;
		(cards[i] as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
		activeIndex = i;
	}

	function onScroll() {
		if (!track) return;
		const cards = track.querySelectorAll('.yacht-card');
		const trackLeft = track.scrollLeft;
		let closest = 0;
		let closestDist = Infinity;
		cards.forEach((card, i) => {
			const dist = Math.abs((card as HTMLElement).offsetLeft - trackLeft);
			if (dist < closestDist) {
				closestDist = dist;
				closest = i;
			}
		});
		activeIndex = closest;
	}
</script>

<section class="our-yachts">
	<div class="yachts-container">
		<div class="yachts-sidebar">
			<h2 class="yachts-heading">Our Yachts</h2>
			<p class="yachts-subtext">
				From intimate gatherings to large-scale celebrations — find the perfect vessel for your crew.
			</p>
			<div class="yachts-nav-list">
				{#each yachts as yacht, i (yacht.name)}
					<button
						type="button"
						class="yacht-nav-item"
						class:active={activeIndex === i}
						onclick={() => scrollToIndex(i)}
					>
						<span class="yacht-nav-name">{yacht.name}</span>
						<span class="yacht-nav-capacity">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<circle cx="12" cy="7" r="3.2"></circle>
								<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
							</svg>
							{yacht.capacity}
						</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="yachts-track" bind:this={track} onscroll={onScroll}>
			{#each yachts as yacht, i (yacht.name)}
				<a href="/rentals" class="yacht-card">
					<div class="yacht-card-image" style="background-image: url({yacht.image})">
						<div class="yacht-card-badge">{yacht.length}</div>
					</div>
					<div class="yacht-card-body">
						<div class="yacht-card-top">
							<h3 class="yacht-card-name">{yacht.name}</h3>
							<p class="yacht-card-tagline">{yacht.tagline}</p>
						</div>
						<div class="yacht-card-bottom">
							<span class="yacht-card-capacity">
								<svg viewBox="0 0 24 24" aria-hidden="true">
									<circle cx="12" cy="7" r="3.2"></circle>
									<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
								</svg>
								Up to {yacht.capacity} guests
							</span>
							<span class="yacht-card-rate">{yacht.rate}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<div class="yachts-dots">
		{#each yachts as _, i (i)}
			<button
				type="button"
				class="yacht-dot"
				class:active={activeIndex === i}
				onclick={() => scrollToIndex(i)}
				aria-label="Go to yacht {i + 1}"
			></button>
		{/each}
	</div>
</section>

<style>
	.our-yachts {
		padding: var(--space-10, 64px) 0 var(--space-8, 32px);
		background: var(--nav-bg);
	}

	.yachts-container {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: var(--space-6, 24px);
		max-width: 1360px;
		margin: 0 auto;
		padding-left: clamp(var(--space-4, 16px), 3.5vw, var(--space-6, 24px));
	}

	.yachts-sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--space-4, 16px);
		padding-top: var(--space-2, 8px);
	}

	.yachts-heading {
		font-family: var(--font-family-system, system-ui);
		font-size: clamp(28px, 3vw, 40px);
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
		margin: 0;
	}

	.yachts-subtext {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.yachts-nav-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1, 4px);
		margin-top: var(--space-2, 8px);
	}

	.yacht-nav-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2, 8px);
		padding: 10px 14px;
		border-radius: var(--radius-sm, 6px);
		border: 1px solid transparent;
		background: transparent;
		cursor: pointer;
		transition:
			background var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease),
			border-color var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.yacht-nav-item:hover {
		background: var(--color-bg-secondary);
	}

	.yacht-nav-item.active {
		background: var(--color-bg-secondary);
		border-color: var(--color-border-default);
	}

	.yacht-nav-name {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-medium, 500);
		color: var(--color-text-primary);
	}

	.yacht-nav-capacity {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-xs, 12px);
		color: var(--color-text-tertiary);
	}

	.yacht-nav-capacity svg {
		width: 14px;
		height: 14px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* Track / Carousel */
	.yachts-track {
		display: flex;
		gap: var(--space-4, 16px);
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-left: 0;
		padding-right: clamp(var(--space-4, 16px), 3.5vw, var(--space-6, 24px));
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.yachts-track::-webkit-scrollbar {
		display: none;
	}

	.yacht-card {
		flex: 0 0 clamp(320px, 56vw, 640px);
		scroll-snap-align: start;
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-lg, 12px);
		overflow: hidden;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-elevated);
		text-decoration: none;
		transition: box-shadow var(--motion-duration-default, 0.3s) var(--motion-ease-standard, ease);
	}

	.yacht-card:hover {
		box-shadow:
			0 16px 40px rgba(2, 8, 23, 0.12),
			0 4px 12px rgba(2, 8, 23, 0.08);
	}

	.yacht-card-image {
		position: relative;
		height: clamp(220px, 32vw, 380px);
		background-size: cover;
		background-position: center;
	}

	.yacht-card-badge {
		position: absolute;
		top: var(--space-3, 12px);
		left: var(--space-3, 12px);
		padding: 5px 12px;
		border-radius: 999px;
		background: rgba(10, 37, 64, 0.72);
		backdrop-filter: blur(8px);
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-inverse, #f9f2f0);
	}

	.yacht-card-body {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-4, 16px);
		padding: var(--space-5, 20px);
		flex: 1;
	}

	.yacht-card-top {
		display: flex;
		flex-direction: column;
		gap: var(--space-1, 4px);
	}

	.yacht-card-name {
		font-family: var(--font-family-system, system-ui);
		font-size: clamp(18px, 1.6vw, 24px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0;
	}

	.yacht-card-tagline {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.yacht-card-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.yacht-card-capacity {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		color: var(--color-text-secondary);
	}

	.yacht-card-capacity svg {
		width: 16px;
		height: 16px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.yacht-card-rate {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
	}

	/* Dots */
	.yachts-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: var(--space-5, 20px);
	}

	.yacht-dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		border: none;
		background: var(--color-border-default);
		cursor: pointer;
		padding: 0;
		transition:
			width var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease),
			background var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.yacht-dot.active {
		width: 24px;
		background: var(--color-accent-primary);
	}

	@media (max-width: 960px) {
		.yachts-container {
			grid-template-columns: 1fr;
			padding-left: clamp(var(--space-4, 16px), 3.5vw, var(--space-6, 24px));
		}

		.yachts-sidebar {
			padding-right: clamp(var(--space-4, 16px), 3.5vw, var(--space-6, 24px));
		}

		.yachts-nav-list {
			display: none;
		}

		.yacht-card {
			flex: 0 0 clamp(280px, 80vw, 480px);
		}
	}
</style>
