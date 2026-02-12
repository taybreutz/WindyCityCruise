<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import BookingWidget from './BookingWidget.svelte';

	const mapboxToken = env.PUBLIC_MAPBOX_TOKEN;
	const boatPopupImage =
		'https://res.cloudinary.com/dlobqp00u/image/upload/w_2560,q_auto,f_auto/v1770920545/chicago-boat-rental-56ft-sea-ray-sundancer-chicago-skyline.png';

	interface PointOfInterest {
		name: string;
		lng: number;
		lat: number;
		description?: string;
		bookHref?: string;
	}

	const boatLocations: PointOfInterest[] = [
		{
			name: "33' Rinker Fiesta Vee",
			lng: -87.6097,
			lat: 41.8922,
			description: 'Burnham Harbor Pickup',
			bookHref: '/rentals'
		},
		{
			name: "37' Sea Ray Sundancer",
			lng: -87.6074,
			lat: 41.8872,
			description: 'Monroe Harbor Pickup',
			bookHref: '/rentals'
		},
		{
			name: "46' Sea Ray Express",
			lng: -87.6162,
			lat: 41.8988,
			description: 'Navy Pier Pickup',
			bookHref: '/rentals'
		},
		{
			name: "55' Sea Ray Sundancer",
			lng: -87.6354,
			lat: 41.8784,
			description: 'Chicago River Pickup',
			bookHref: '/rentals'
		},
		{
			name: "70' Sea Ray Sun Sport",
			lng: -87.6028,
			lat: 41.8713,
			description: '31st Street Harbor Pickup',
			bookHref: '/rentals'
		}
	];

	let stayAddress = $state('River North, Chicago, IL');
	let stayPoint = $state<PointOfInterest>({
		name: 'River North, Chicago, IL',
		lng: -87.6316,
		lat: 41.8925
	});

	let mapContainer = $state<HTMLDivElement | undefined>(undefined);
	let map: any = null;
	let mapboxgl: any = null;
	let stayMarker: any = null;
	let boatMarkers: any[] = [];

	let mapReady = $state(false);
	let geocoding = $state(false);
	let mapError = $state('');
	let addressError = $state('');

	function escapeHtml(value: string) {
		return value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#039;');
	}

	function getBoatPopupHtml(boat: PointOfInterest) {
		const boatName = escapeHtml(boat.name);
		const boatDescription = escapeHtml(boat.description ?? 'Chicago Pickup');
		const bookHref = boat.bookHref ?? '/rentals';

		return `
			<div class="boat-popup-card">
				<img src="${boatPopupImage}" alt="${boatName}" class="boat-popup-image" />
				<div class="boat-popup-body">
					<p class="boat-popup-title">${boatName}</p>
					<p class="boat-popup-description">${boatDescription}</p>
					<a href="${bookHref}" class="boat-popup-book">Book Now</a>
				</div>
			</div>
		`;
	}

	async function geocodeAddress(query: string): Promise<PointOfInterest | null> {
		if (!mapboxToken) {
			return null;
		}

		const search = encodeURIComponent(query);
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?limit=1&types=address,poi,place,neighborhood&proximity=-87.6298,41.8781&access_token=${mapboxToken}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Failed to geocode address.');
		}

		const result = await response.json();
		const feature = result?.features?.[0];
		if (!feature?.center || !Array.isArray(feature.center)) {
			return null;
		}

		return {
			name: feature.place_name ?? query,
			lng: feature.center[0],
			lat: feature.center[1]
		};
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
					{
						once: true
					}
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

	function plotBoatMarkers() {
		if (!map || !mapboxgl) {
			return;
		}

		boatMarkers.forEach((marker) => marker.remove());
		boatMarkers = boatLocations.map((boat) =>
			new mapboxgl.Marker({ color: '#0f5f9a' })
				.setLngLat([boat.lng, boat.lat])
				.setPopup(
					new mapboxgl.Popup({ offset: 20, className: 'boat-popup-frame' }).setHTML(
						getBoatPopupHtml(boat)
					)
				)
				.addTo(map)
		);
	}

	function plotStayMarker() {
		if (!map || !mapboxgl || !stayPoint) {
			return;
		}

		if (stayMarker) {
			stayMarker.remove();
		}

		stayMarker = new mapboxgl.Marker({ color: '#f97316' })
			.setLngLat([stayPoint.lng, stayPoint.lat])
			.setPopup(
				new mapboxgl.Popup({ offset: 20 }).setHTML(
					`<strong>Staying Near</strong><br/>${escapeHtml(stayPoint.name)}`
				)
			)
			.addTo(map);
	}

	async function handleAddressSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!mapReady || !map) {
			return;
		}

		const query = stayAddress.trim();
		if (!query) {
			addressError = 'Enter an address or hotel.';
			return;
		}

		addressError = '';
		geocoding = true;

		try {
			const point = await geocodeAddress(query);
			if (!point) {
				addressError = 'Address not found. Try a nearby hotel or neighborhood.';
				return;
			}

			stayPoint = point;
			stayAddress = point.name;
		} catch (error) {
			console.error(error);
			addressError = 'Could not look up that address right now.';
		} finally {
			geocoding = false;
		}
	}

	onMount(() => {
		let isDestroyed = false;

		async function initMap() {
			if (!mapContainer) {
				return;
			}

			if (!mapboxToken) {
				mapError = 'Add PUBLIC_MAPBOX_TOKEN to enable the interactive map.';
				return;
			}

			try {
				mapboxgl = await getMapboxGl();
				if (isDestroyed) {
					return;
				}

				mapboxgl.accessToken = mapboxToken;
				map = new mapboxgl.Map({
					container: mapContainer,
					style: 'mapbox://styles/mapbox/light-v11',
					center: [stayPoint.lng, stayPoint.lat],
					zoom: 11.5
				});

				map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
				map.on('load', () => {
					if (isDestroyed) {
						return;
					}

					mapReady = true;
					plotBoatMarkers();
					plotStayMarker();
				});
			} catch (error) {
				console.error(error);
				mapError = 'Unable to load the map right now.';
			}
		}

		initMap();

		return () => {
			isDestroyed = true;
			boatMarkers.forEach((marker) => marker.remove());
			stayMarker?.remove();
			map?.remove();
		};
	});

	$effect(() => {
		if (!mapReady || !map || !stayPoint) {
			return;
		}

		map.flyTo({
			center: [stayPoint.lng, stayPoint.lat],
			zoom: 12,
			essential: true
		});

		plotStayMarker();
	});
</script>

<section class="find-boat-map-section">
	<div class="container">
		<div class="find-boat-header">
			<p class="section-label">Plan Your Day</p>
			<h2 class="section-title">Find Your Boat</h2>
		</div>

		<div class="map-shell">
			<form class="stay-card" onsubmit={handleAddressSubmit}>
				<label for="stay-address" class="stay-label">Where are you staying?</label>
				<div class="stay-controls">
					<input
						id="stay-address"
						type="text"
						class="stay-input"
						placeholder="Enter hotel or address"
						bind:value={stayAddress}
					/>
					<button
						type="submit"
						class="stay-submit"
						disabled={!mapReady || geocoding || !stayAddress.trim()}
					>
						{geocoding ? 'Locating...' : 'Set Location'}
					</button>
				</div>
				{#if addressError}
					<p class="stay-error">{addressError}</p>
				{/if}
			</form>

			{#if mapError}
				<div class="map-fallback">
					<p>{mapError}</p>
				</div>
			{:else}
				<div class="map-canvas" bind:this={mapContainer}></div>
			{/if}

			<div class="legend">
				<span><i class="dot dot-stay"></i>Your stay</span>
				<span><i class="dot dot-boat"></i>Boat locations</span>
			</div>

			<BookingWidget class="map-booking-widget" />
		</div>
	</div>
</section>

<style>
	.find-boat-map-section {
		padding: var(--space-3) var(--space-5) var(--space-10);
		background: var(--color-bg-primary);
	}

	.container {
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.find-boat-header {
		margin-bottom: var(--space-4);
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
		margin: 0;
	}

	.map-shell {
		position: relative;
		min-height: 640px;
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border-subtle);
		/* overflow: hidden; */
		box-shadow:
			0 12px 36px rgba(2, 8, 23, 0.12),
			0 2px 12px rgba(2, 8, 23, 0.08);
	}

	.map-canvas,
	.map-fallback {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-lg);
	}

	.map-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #dbeafe 0%, #f8fafc 55%, #e0f2fe 100%);
		padding: var(--space-5);
	}

	.map-fallback p {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		margin: 0;
		text-align: center;
	}

	.stay-card {
		position: absolute;
		top: var(--space-4);
		left: var(--space-4);
		z-index: 12;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		max-width: 460px;
		width: calc(100% - 32px);
		backdrop-filter: blur(8px);
		box-shadow: 0 8px 20px rgba(2, 8, 23, 0.12);
	}

	.stay-label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.stay-controls {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.stay-input {
		flex: 1;
		height: 42px;
		padding: 0 var(--space-3);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
	}

	.stay-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
	}

	.stay-submit {
		height: 42px;
		padding: 0 var(--space-3);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: #fff;
		background: linear-gradient(135deg, #0f5f9a 0%, #1843a8 100%);
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		white-space: nowrap;
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.stay-submit:hover {
		opacity: 0.9;
	}

	.stay-submit:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.stay-error {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: 12px;
		font-weight: var(--font-weight-medium);
		color: #b42318;
	}

	.legend {
		position: absolute;
		right: var(--space-4);
		top: var(--space-4);
		z-index: 12;
		display: flex;
		gap: var(--space-3);
		align-items: center;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid var(--color-border-subtle);
		backdrop-filter: blur(8px);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 999px;
	}

	.dot-stay {
		background: #f97316;
	}

	.dot-boat {
		background: #0f5f9a;
	}

	.map-shell :global(.boat-popup-frame .mapboxgl-popup-content) {
		padding: 0;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 14px 30px rgba(2, 8, 23, 0.22);
	}

	.map-shell :global(.boat-popup-frame .mapboxgl-popup-tip) {
		border-top-color: #ffffff;
	}

	.map-shell :global(.boat-popup-card) {
		/* width: 260px; */
		background: #ffffff;
	}

	.map-shell :global(.boat-popup-image) {
		display: block;
		width: 100%;
		height: 140px;
		object-fit: cover;
	}

	.map-shell :global(.boat-popup-body) {
		padding: 12px;
	}

	.map-shell :global(.boat-popup-title) {
		margin: 0 0 4px;
		font-family: var(--font-family-system);
		font-size: 14px;
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		line-height: 1.3;
	}

	.map-shell :global(.boat-popup-description) {
		margin: 0 0 10px;
		font-family: var(--font-family-system);
		font-size: 12px;
		color: var(--color-text-secondary);
	}

	.map-shell :global(.boat-popup-book) {
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

	.map-shell :global(.boat-popup-book:hover) {
		opacity: 0.9;
	}

	.map-shell :global(.map-booking-widget) {
		position: absolute;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%) translateY(50%);
		z-index: 12;
		width: min(100% - 32px, 980px);
	}

	@media (max-width: 900px) {
		.map-shell {
			min-height: 760px;
		}

		.legend {
			top: auto;
			bottom: 210px;
			right: var(--space-3);
			left: var(--space-3);
			justify-content: center;
		}

		.stay-card {
			top: var(--space-3);
			left: var(--space-3);
			right: var(--space-3);
			width: auto;
			max-width: none;
		}

		.stay-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.map-shell :global(.map-booking-widget) {
			bottom: var(--space-3);
			width: calc(100% - 24px);
		}
	}

	@media (max-width: 640px) {
		.find-boat-map-section {
			padding: var(--space-4) var(--space-4) var(--space-8);
		}

		.map-shell {
			min-height: 860px;
		}

		.legend {
			display: none;
		}
	}
</style>
