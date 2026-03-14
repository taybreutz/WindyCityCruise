<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { BOAT_POPUP_IMAGE, seedBoatLocations, type BoatLocation } from '$lib/data/boats';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	interface BoatWithDistance extends BoatLocation {
		distanceMiles: number;
	}

	let { data }: Props = $props();

	const mapboxToken = env.PUBLIC_MAPBOX_TOKEN;

	let primaryMapContainer = $state<HTMLDivElement | undefined>(undefined);
	let northMapContainer = $state<HTMLDivElement | undefined>(undefined);
	let southMapContainer = $state<HTMLDivElement | undefined>(undefined);

	let mapboxgl: any = null;
	let maps: any[] = [];
	let mapBoats = $state<BoatLocation[]>(seedBoatLocations);
	let mapReady = $state(false);
	let mapError = $state('');
	const guestLimit = $derived(Math.max(1, Number(data.guests) || 13));

	function toRadians(value: number) {
		return (value * Math.PI) / 180;
	}

	function milesBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
		const earthRadiusMiles = 3958.8;
		const dLat = toRadians(lat2 - lat1);
		const dLng = toRadians(lng2 - lng1);
		const a =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
		return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	}

	function escapeHtml(value: string) {
		return value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#039;');
	}

	function boatCapacityValue(boat: BoatLocation) {
		const capacity = Number(boat.capacity);
		return Number.isFinite(capacity) && capacity > 0 ? capacity : 150;
	}

	function compareByGuestPreference(a: BoatWithDistance, b: BoatWithDistance) {
		const aCapacity = boatCapacityValue(a);
		const bCapacity = boatCapacityValue(b);
		const aFits = aCapacity <= guestLimit ? 0 : 1;
		const bFits = bCapacity <= guestLimit ? 0 : 1;
		if (aFits !== bFits) {
			return aFits - bFits;
		}

		const aCapacityGap = Math.abs(guestLimit - aCapacity);
		const bCapacityGap = Math.abs(guestLimit - bCapacity);
		if (aCapacityGap !== bCapacityGap) {
			return aCapacityGap - bCapacityGap;
		}

		return a.distanceMiles - b.distanceMiles;
	}

	const boatsByDistance = $derived(
		mapBoats
			.map((boat) => ({
				...boat,
				distanceMiles: milesBetween(data.stayLat, data.stayLng, boat.lat, boat.lng)
			}))
			.sort(compareByGuestPreference)
	);

	const closestBoats = $derived(data.hasSearch ? boatsByDistance.slice(0, 4) : []);
	const northBoats = $derived(
		data.hasSearch
			? boatsByDistance.filter((boat) => boat.lat > data.stayLat && boat.distanceMiles <= 2.5)
			: []
	);
	const southBoats = $derived(
		data.hasSearch
			? boatsByDistance.filter((boat) => boat.lat < data.stayLat && boat.distanceMiles <= 2.5)
			: []
	);

	function mapCenter(boats: BoatWithDistance[]) {
		if (boats.length === 0) {
			return [data.stayLng, data.stayLat] as [number, number];
		}

		const points = [{ lat: data.stayLat, lng: data.stayLng }, ...boats];
		const center = points.reduce(
			(acc, point) => {
				acc.lat += point.lat;
				acc.lng += point.lng;
				return acc;
			},
			{ lat: 0, lng: 0 }
		);

		return [center.lng / points.length, center.lat / points.length] as [number, number];
	}

	function getBoatPopupHtml(boat: BoatWithDistance) {
		const boatName = escapeHtml(boat.name);
		const boatDescription = escapeHtml(boat.description);
		const boatImage = boat.imageUrl ?? BOAT_POPUP_IMAGE;
		const bookingUrl = getBookingUrl(boat);

		return `
			<div class="boat-popup-card">
				<img src="${boatImage}" alt="${boatName}" class="boat-popup-image" />
				<div class="boat-popup-body">
					<p class="boat-popup-title">${boatName}</p>
					<p class="boat-popup-description">${boatDescription}</p>
					<a href="${bookingUrl}" class="boat-popup-book">Book Now</a>
				</div>
			</div>
		`;
	}

	function getBookingUrl(boat: BoatLocation) {
		const baseBookHref = boat.bookHref ?? '/book';
		return data.date && data.guests
			? `${baseBookHref}?date=${encodeURIComponent(data.date)}&guests=${encodeURIComponent(data.guests)}`
			: baseBookHref;
	}

	function addMapboxCss() {
		if (document.getElementById('mapbox-gl-css')) {
			return;
		}

		const css = document.createElement('link');
		css.id = 'mapbox-gl-css';
		css.rel = 'stylesheet';
		css.href = 'https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css';
		document.head.append(css);
	}

	function loadMapboxScript() {
		return new Promise<void>((resolve, reject) => {
			const existing = document.getElementById('mapbox-gl-js') as HTMLScriptElement | null;
			if (existing) {
				if ((window as Window & { mapboxgl?: any }).mapboxgl) {
					resolve();
					return;
				}

				existing.addEventListener('load', () => resolve(), { once: true });
				existing.addEventListener(
					'error',
					() => reject(new Error('Mapbox script failed to load.')),
					{ once: true }
				);
				return;
			}

			const script = document.createElement('script');
			script.id = 'mapbox-gl-js';
			script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.js';
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Mapbox script failed to load.'));
			document.head.append(script);
		});
	}

	async function getMapboxGl() {
		if ((window as Window & { mapboxgl?: any }).mapboxgl) {
			return (window as Window & { mapboxgl?: any }).mapboxgl;
		}

		addMapboxCss();
		await loadMapboxScript();
		const loadedMapbox = (window as Window & { mapboxgl?: any }).mapboxgl;
		if (!loadedMapbox) {
			throw new Error('Mapbox failed to initialize.');
		}

		return loadedMapbox;
	}

	async function loadMapBoats() {
		try {
			const response = await fetch('/api/book-now-boats');
			if (!response.ok) {
				return;
			}

			const payload = await response.json();
			if (Array.isArray(payload?.boats) && payload.boats.length > 0) {
				mapBoats = payload.boats;
			}
		} catch (error) {
			console.error('Unable to load map boats from Book Now API.', error);
		}
	}

	function clearMaps() {
		maps.forEach((entry) => entry.remove());
		maps = [];
	}

	function renderMap(
		container: HTMLDivElement,
		boats: BoatWithDistance[],
		center: [number, number],
		zoom: number,
		boatColor: string
	) {
		const map = new mapboxgl.Map({
			container,
			style: 'mapbox://styles/mapbox/light-v11',
			center,
			zoom
		});

		map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
		map.on('load', () => {
			if (!data.hasSearch) {
				return;
			}

			new mapboxgl.Marker({ color: '#f97316' })
				.setLngLat([data.stayLng, data.stayLat])
				.setPopup(
					new mapboxgl.Popup({ offset: 20 }).setHTML(
						`<strong>Stay</strong><br/>${escapeHtml(data.stay)}`
					)
				)
				.addTo(map);

			boats.forEach((boat) => {
				new mapboxgl.Marker({ color: boatColor })
					.setLngLat([boat.lng, boat.lat])
					.setPopup(
						new mapboxgl.Popup({ offset: 20, className: 'boat-popup-frame' }).setHTML(
							getBoatPopupHtml(boat)
						)
					)
					.addTo(map);
			});
		});

		maps.push(map);
	}

	function rebuildMaps() {
		if (
			!mapReady ||
			!mapboxgl ||
			!primaryMapContainer ||
			!northMapContainer ||
			!southMapContainer
		) {
			return;
		}

		clearMaps();

		renderMap(primaryMapContainer, closestBoats, mapCenter(closestBoats), 13, '#0f5f9a');
		renderMap(northMapContainer, northBoats, mapCenter(northBoats), 12, '#0f766e');
		renderMap(southMapContainer, southBoats, mapCenter(southBoats), 12, '#1d4ed8');
	}

	onMount(() => {
		let destroyed = false;
		void loadMapBoats();

		async function initMaps() {
			if (!mapboxToken) {
				mapError = 'Add PUBLIC_MAPBOX_TOKEN to render route maps.';
				return;
			}

			try {
				mapboxgl = await getMapboxGl();
				if (destroyed) {
					return;
				}

				mapboxgl.accessToken = mapboxToken;
				mapReady = true;
				rebuildMaps();
			} catch (error) {
				console.error(error);
				mapError = 'Unable to load map views right now.';
			}
		}

		initMaps();

		return () => {
			destroyed = true;
			clearMaps();
		};
	});

	$effect(() => {
		if (!mapReady) {
			return;
		}

		rebuildMaps();
	});
</script>

<svelte:head>
	<title>Find Your Boat Results | Windy City Cruise</title>
</svelte:head>

<section class="results-page">
	<div class="container">
		<header class="results-header">
			<p class="results-eyebrow">Availability</p>
			<h1 class="results-title">Find Your Boat Results</h1>
			<p class="results-meta">
				<span>{data.date || 'Date not set'}</span>
				<span>{data.guestLabel}</span>
				<span>{data.stay}</span>
			</p>
		</header>

		<div class="map-layout">
			<article class="map-card map-card-primary">
				<div class="map-card-header">
					<h2>Closest Boat Options</h2>
					<p>Zoomed in to highlight the nearest matches from your stay location.</p>
				</div>
				{#if mapError}
					<div class="map-fallback"><p>{mapError}</p></div>
				{:else}
					<div class="map-canvas map-canvas-primary" bind:this={primaryMapContainer}></div>
				{/if}
			</article>

			<div class="map-secondary-grid">
				<article class="map-card map-card-secondary">
					<div class="map-card-header">
						<h2>Within 2.5 Miles North</h2>
						<p>{northBoats.length} options in the northern band.</p>
					</div>
					{#if mapError}
						<div class="map-fallback"><p>{mapError}</p></div>
					{:else}
						<div class="map-canvas map-canvas-secondary" bind:this={northMapContainer}></div>
					{/if}
				</article>

				<article class="map-card map-card-secondary">
					<div class="map-card-header">
						<h2>Within 2.5 Miles South</h2>
						<p>{southBoats.length} options in the southern band.</p>
					</div>
					{#if mapError}
						<div class="map-fallback"><p>{mapError}</p></div>
					{:else}
						<div class="map-canvas map-canvas-secondary" bind:this={southMapContainer}></div>
					{/if}
				</article>
			</div>
		</div>

		<section class="boat-column-panel" aria-label="Boat options">
			<div class="boat-column-header">
				<h2>Boat Options</h2>
				<p>Ordered by guest tier: {data.guestLabel}</p>
			</div>

			{#if !data.hasSearch}
				<p class="boat-column-empty">
					Search with a Chicago neighborhood, hotel, or address to populate boat pins and options.
				</p>
			{:else if boatsByDistance.length === 0}
				<p class="boat-column-empty">
					No boats available right now. Try another guest tier or nearby Chicago location.
				</p>
			{:else}
				<div class="boat-column-list">
					{#each boatsByDistance as boat (boat.id)}
						<article class="boat-column-card">
							<img
								src={boat.imageUrl ?? BOAT_POPUP_IMAGE}
								alt={boat.name}
								class="boat-column-image"
							/>
							<div class="boat-column-body">
								<p class="boat-column-title">{boat.name}</p>
								<p class="boat-column-meta">
									Up to {boat.capacity ?? 150} passengers
									<span>{boat.distanceMiles.toFixed(1)} mi away</span>
								</p>
								<p class="boat-column-description">{boat.description}</p>
								<a href={getBookingUrl(boat)} class="boat-column-book">Book Now</a>
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</section>

<style>
	.results-page {
		padding: var(--space-7) var(--space-5) var(--space-10);
		background: var(--color-bg-primary);
	}

	.container {
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.results-header {
		margin-bottom: var(--space-6);
	}

	.results-eyebrow {
		margin: 0 0 var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-text-tertiary);
	}

	.results-title {
		margin: 0 0 var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.results-meta {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.results-meta span {
		padding: 6px 10px;
		border-radius: 999px;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-elevated);
	}

	.map-layout {
		display: grid;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.map-secondary-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
	}

	.map-card {
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-elevated);
		overflow: hidden;
		box-shadow:
			0 12px 28px rgba(2, 8, 23, 0.1),
			0 2px 8px rgba(2, 8, 23, 0.08);
	}

	.map-card-header {
		padding: var(--space-3) var(--space-4);
		background: linear-gradient(180deg, rgba(248, 250, 252, 1) 0%, rgba(255, 255, 255, 1) 100%);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.map-card-header h2 {
		margin: 0 0 4px;
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.map-card-header p {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.map-canvas {
		width: 100%;
	}

	.map-canvas-primary {
		height: 420px;
	}

	.map-canvas-secondary {
		height: 320px;
	}

	.map-fallback {
		height: 320px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-5);
		background: linear-gradient(135deg, #dbeafe 0%, #f8fafc 55%, #e0f2fe 100%);
	}

	.map-card-primary .map-fallback {
		height: 420px;
	}

	.map-fallback p {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		text-align: center;
	}

	.map-layout :global(.boat-popup-frame .mapboxgl-popup-content) {
		padding: 0;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 14px 30px rgba(2, 8, 23, 0.22);
	}

	.map-layout :global(.boat-popup-frame .mapboxgl-popup-tip) {
		border-top-color: #ffffff;
	}

	.map-layout :global(.boat-popup-card) {
		width: 260px;
		background: #ffffff;
	}

	.map-layout :global(.boat-popup-image) {
		display: block;
		width: 100%;
		height: 140px;
		object-fit: cover;
	}

	.map-layout :global(.boat-popup-body) {
		padding: 12px;
	}

	.map-layout :global(.boat-popup-title) {
		margin: 0 0 4px;
		font-family: var(--font-family-system);
		font-size: 14px;
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		line-height: 1.3;
	}

	.map-layout :global(.boat-popup-description) {
		margin: 0 0 10px;
		font-family: var(--font-family-system);
		font-size: 12px;
		color: var(--color-text-secondary);
	}

	.map-layout :global(.boat-popup-book) {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 38px;
		border-radius: 10px;
		font-family: var(--font-family-system);
		font-size: 13px;
		font-weight: var(--font-weight-semibold);
		text-decoration: none;
		color: #fff;
		background: linear-gradient(135deg, #0f5f9a 0%, #1843a8 100%);
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.map-layout :global(.boat-popup-book:hover) {
		opacity: 0.9;
	}

	.boat-column-panel {
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-elevated);
		box-shadow:
			0 12px 28px rgba(2, 8, 23, 0.1),
			0 2px 8px rgba(2, 8, 23, 0.08);
		padding: var(--space-4);
	}

	.boat-column-header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.boat-column-header h2 {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.boat-column-header p {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.boat-column-empty {
		margin: 0;
		padding: var(--space-2) 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.boat-column-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		max-height: 360px;
		overflow-y: auto;
		padding-right: var(--space-1);
	}

	.boat-column-card {
		display: grid;
		grid-template-columns: 110px minmax(0, 1fr);
		gap: var(--space-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		background: #fff;
		padding: var(--space-2);
	}

	.boat-column-image {
		width: 110px;
		height: 96px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.boat-column-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

	.boat-column-title {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.boat-column-meta {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.boat-column-description {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.boat-column-book {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		padding: 0 14px;
		height: 34px;
		border-radius: var(--radius-sm);
		font-family: var(--font-family-system);
		font-size: 12px;
		font-weight: var(--font-weight-semibold);
		text-decoration: none;
		color: #fff;
		background: linear-gradient(135deg, #0f5f9a 0%, #1843a8 100%);
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.boat-column-book:hover {
		opacity: 0.9;
	}

	@media (max-width: 900px) {
		.map-secondary-grid {
			grid-template-columns: 1fr;
		}

		.map-canvas-primary,
		.map-card-primary .map-fallback {
			height: 360px;
		}

		.map-canvas-secondary,
		.map-fallback {
			height: 280px;
		}
	}

	@media (max-width: 640px) {
		.results-page {
			padding: var(--space-5) var(--space-4) var(--space-8);
		}

		.results-title {
			font-size: var(--font-size-xl);
		}

		.boat-column-card {
			grid-template-columns: 1fr;
		}

		.boat-column-image {
			width: 100%;
			height: 150px;
		}
	}
</style>
