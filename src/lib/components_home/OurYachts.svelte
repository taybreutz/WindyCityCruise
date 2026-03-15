<script lang="ts">
	import { scale } from 'svelte/transition';

	const yachts = [
		{
			name: "57' Power Catamaran",
			capacity: 49,
			length: "57'",
			tagline: 'Perfect for intimate gatherings & day cruises',
			image:
				'https://res.cloudinary.com/dlobqp00u/image/upload/w_1600,q_auto,f_auto/v1771256209/chicago-boat-rental-57ft-power-catamaran.webp',
			rate: 'From $337/hr'
		},
		{
			name: "72' Classic Chris Craft",
			capacity: 49,
			length: "72'",
			tagline: 'Iconic vintage yacht with timeless elegance',
			image:
				'https://res.cloudinary.com/dlobqp00u/image/upload/w_1600,q_auto,f_auto/v1771256386/chicago-boat-rental-72ft-classic-chris-craft-sophisticated-lady.webp',
			rate: 'From $362/hr'
		},
		{
			name: "75' Power Catamaran",
			capacity: 100,
			length: "75'",
			tagline: 'Corporate events & milestone celebrations',
			image:
				'https://res.cloudinary.com/dlobqp00u/image/upload/w_1600,q_auto,f_auto/v1772565318/1772513966043-423-IMG_2785_dekeoz.webp',
			rate: 'From $475/hr'
		},
		{
			name: "85' Power Catamaran",
			capacity: 200,
			length: "85'",
			tagline: 'The ultimate wedding & gala yacht',
			image:
				'https://res.cloudinary.com/dlobqp00u/image/upload/w_1600/v1769703495/b10261dd-6987-4c43-841e-3a289b7ee719_tlvuze.jpg',
			rate: 'From $625/hr'
		}
	];

	const departurePoints = [
		{
			name: 'Burnham Harbor',
			image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&q=80',
			mapQuery: 'Burnham+Harbor,+Chicago,+IL'
		},
		{
			name: 'Chicago River',
			image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
			mapQuery: 'Chicago+River,+Chicago,+IL'
		},
		{
			name: 'River North Marina',
			image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80',
			mapQuery: 'River+North,+Chicago,+IL'
		},
		{
			name: 'Navy Pier Marina',
			image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&q=80',
			mapQuery: 'Navy+Pier,+Chicago,+IL'
		}
	];

	let track: HTMLDivElement | undefined = $state(undefined);
	let activeIndex = $state(0);
	let departureView: 'photos' | 'map' = $state('photos');
	let isScrolling = false;
	let scrollTimer: ReturnType<typeof setTimeout>;

	function scrollToIndex(i: number) {
		if (!track) return;
		const cards = track.querySelectorAll('.yacht-card-wrapper');
		if (!cards[i]) return;
		isScrolling = true;
		activeIndex = i;
		(cards[i] as HTMLElement).scrollIntoView({
			behavior: 'smooth',
			inline: 'start',
			block: 'nearest'
		});
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(() => {
			isScrolling = false;
		}, 600);
	}

	function nextYacht() {
		scrollToIndex((activeIndex + 1) % yachts.length);
	}

	function prevYacht() {
		scrollToIndex((activeIndex - 1 + yachts.length) % yachts.length);
	}

	function onScroll() {
		if (!track || isScrolling) return;
		const cards = track.querySelectorAll('.yacht-card-wrapper');
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
				From intimate gatherings to large-scale celebrations — find the perfect vessel for your
				crew.
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

		<div class="yachts-track-area">
			<div class="yachts-track" bind:this={track} onscroll={onScroll}>
				{#each yachts as yacht, i (yacht.name)}
					<div class="yacht-card-wrapper">
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
					</div>
				{/each}
			</div>

			<div class="yacht-card-nav">
				{#if activeIndex > 0}
					<button
						type="button"
						class="yacht-arrow"
						onclick={prevYacht}
						aria-label="Previous yacht"
						transition:scale={{ duration: 250, start: 0, opacity: 0 }}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M15 6l-6 6 6 6" />
						</svg>
					</button>
				{/if}
				<button type="button" class="yacht-arrow" onclick={nextYacht} aria-label="Next yacht">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M9 6l6 6-6 6" />
					</svg>
				</button>
			</div>
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

	<div class="departures">
		<div class="departures-top">
			<h3 class="departures-heading">
				<svg class="departures-icon" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
					<circle cx="12" cy="9" r="2.5" />
				</svg>
				Our Departure Points
			</h3>
			<div class="departures-toggle">
				<button
					type="button"
					class="toggle-btn"
					class:active={departureView === 'photos'}
					onclick={() => (departureView = 'photos')}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<rect x="3" y="3" width="18" height="18" rx="2" />
						<circle cx="8.5" cy="8.5" r="1.5" />
						<path d="m21 15-5-5L5 21" />
					</svg>
					Photos
				</button>
				<button
					type="button"
					class="toggle-btn"
					class:active={departureView === 'map'}
					onclick={() => (departureView = 'map')}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="m9 18-6 3V7l6-3m0 14 6 3m-6-3V4m6 17 6-3V4l-6 3m0 14V7M9 4l6 3" />
					</svg>
					Map
				</button>
			</div>
		</div>
		<div class="departures-grid">
			{#each departurePoints as point (point.name)}
				<div class="departure-card">
					{#if departureView === 'photos'}
						<div class="departure-image" style="background-image: url({point.image})"></div>
					{:else}
						<iframe
							class="departure-map"
							title="{point.name} map"
							src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q={point.mapQuery}&zoom=14&maptype=satellite"
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
						></iframe>
					{/if}
					<span class="departure-name">{point.name}</span>
				</div>
			{/each}
		</div>
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
		max-width: 900px;
		margin: 0 auto;
		padding-left: clamp(var(--space-4, 16px), 3.5vw, var(--space-6, 24px));
		padding-right: clamp(var(--space-4, 16px), 3.5vw, var(--space-6, 24px));
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
	.yachts-track-area {
		position: relative;
	}

	.yachts-track {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-left: 0;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.yachts-track::-webkit-scrollbar {
		display: none;
	}

	.yacht-card-wrapper {
		flex: 0 0 100%;
		scroll-snap-align: start;
	}

	.yacht-card {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-lg, 12px);
		overflow: hidden;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-elevated);
		text-decoration: none;
		transition: box-shadow var(--motion-duration-default, 0.3s) var(--motion-ease-standard, ease);
	}

	.yacht-card-nav {
		position: absolute;
		right: 0;
		top: 15%;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 6px;
		background: var(--nav-bg, #f9f2f0);
		padding: 5px 0 5px 5px;
		border-radius: 26px 0 0 26px;
		z-index: 2;
	}

	.yacht-arrow {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		border: none;
		background: var(--color-frosted-blue, #014cba);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.yacht-arrow:hover {
		background: #0140a0;
	}

	.yacht-arrow svg {
		width: 20px;
		height: 20px;
		fill: none;
		stroke: #fff;
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
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

		.yacht-card-wrapper {
			flex: 0 0 100%;
		}
	}

	/* Departure Points */
	.departures-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4, 16px);
	}

	.departures-toggle {
		display: flex;
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-sm, 6px);
		overflow: hidden;
	}

	.toggle-btn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 6px 14px;
		border: none;
		background: transparent;
		color: var(--color-text-secondary);
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-xs, 12px);
		font-weight: var(--font-weight-medium, 500);
		cursor: pointer;
		transition:
			background var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease),
			color var(--motion-duration-fast, 0.15s) var(--motion-ease-standard, ease);
	}

	.toggle-btn + .toggle-btn {
		border-left: 1px solid var(--color-border-default);
	}

	.toggle-btn svg {
		width: 14px;
		height: 14px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.toggle-btn:hover {
		background: var(--color-bg-secondary);
	}

	.toggle-btn.active {
		background: var(--color-frosted-blue);
		color: #f9f2f0;
	}

	.toggle-btn.active svg {
		stroke: #f9f2f0;
	}

	.departures {
		max-width: 1360px;
		margin: var(--space-8, 32px) auto 0;
		padding: 0 clamp(var(--space-4, 16px), 3.5vw, var(--space-6, 24px));
	}

	.departures-heading {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-md, 16px);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0;
	}

	.departures-icon {
		width: 20px;
		height: 20px;
		fill: none;
		stroke: var(--color-frosted-blue);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.departures-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-3, 12px);
	}

	.departure-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2, 8px);
		align-items: center;
	}

	.departure-image,
	.departure-map {
		width: 100%;
		aspect-ratio: 16 / 10;
		border-radius: var(--radius-md, 8px);
		border: 1px solid var(--color-border-subtle);
	}

	.departure-image {
		background-size: cover;
		background-position: center;
	}

	.departure-name {
		font-family: var(--font-family-system, system-ui);
		font-size: var(--font-size-sm, 14px);
		font-weight: var(--font-weight-medium, 500);
		color: var(--color-text-primary);
	}

	@media (max-width: 640px) {
		.departures-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
