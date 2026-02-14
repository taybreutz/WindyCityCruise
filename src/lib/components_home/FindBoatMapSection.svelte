<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { BOAT_POPUP_IMAGE, boatLocations, type BoatLocation } from '$lib/data/boats';
	import { onMount } from 'svelte';

	const mapboxToken = env.PUBLIC_MAPBOX_TOKEN;
	const CHICAGO_BBOX = [-87.95, 41.6, -87.5, 42.05] as const;
	const CHICAGO_PROXIMITY = '-87.6298,41.8781';

	interface PointOfInterest {
		name: string;
		lng: number;
		lat: number;
		description?: string;
		bookHref?: string;
	}

	interface GeocodeLookupResult {
		point: PointOfInterest | null;
		reason: 'ok' | 'not_found' | 'outside_chicago';
	}

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
	let plannerError = $state('');
	let plannerMode = $state<'manual' | 'ai'>('manual');
	let activePlannerTab = $state<
		'boat_charter' | 'large_commercial_charter' | 'sailboat' | 'kayak' | 'jet_ski'
	>('boat_charter');
	let checkInDate = $state('');
	let checkOutDate = $state('');
	let guests = $state('2');
	let aiPrompt = $state('');
	let liveLookupState = $state<'idle' | 'searching' | 'ready' | 'outside' | 'not_found' | 'error'>('idle');
	let liveLookupMessage = $state('');
	let liveLookupPoint = $state<PointOfInterest | null>(null);
	let liveLookupQuery = $state('');
	let liveLookupRequestId = 0;

	function escapeHtml(value: string) {
		return value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#039;');
	}

	function getBoatPopupHtml(boat: BoatLocation) {
		const boatName = escapeHtml(boat.name);
		const boatDescription = escapeHtml(boat.description ?? 'Chicago Pickup');
		const bookHref = boat.bookHref ?? '/rentals';

		return `
			<div class="boat-popup-card">
				<img src="${BOAT_POPUP_IMAGE}" alt="${boatName}" class="boat-popup-image" />
				<div class="boat-popup-body">
					<p class="boat-popup-title">${boatName}</p>
					<p class="boat-popup-description">${boatDescription}</p>
					<a href="${bookHref}" class="boat-popup-book">Book Now</a>
				</div>
			</div>
		`;
	}

	function isWithinChicagoBounds(lng: number, lat: number) {
		const [minLng, minLat, maxLng, maxLat] = CHICAGO_BBOX;
		return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
	}

	function isChicagoFeature(feature: any) {
		const contexts = Array.isArray(feature?.context) ? feature.context : [];
		const combined = [
			feature?.place_name,
			feature?.text,
			...contexts.map((entry: any) => entry?.text)
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		return combined.includes('chicago');
	}

	async function geocodeAddress(query: string): Promise<GeocodeLookupResult> {
		if (!mapboxToken) {
			return { point: null, reason: 'not_found' };
		}

		const search = encodeURIComponent(query);
		const bbox = CHICAGO_BBOX.join(',');
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?limit=1&types=address,poi,place,neighborhood,locality&country=us&bbox=${bbox}&proximity=${CHICAGO_PROXIMITY}&access_token=${mapboxToken}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Failed to geocode address.');
		}

		const result = await response.json();
		const feature = result?.features?.[0];
		if (!feature?.center || !Array.isArray(feature.center)) {
			return { point: null, reason: 'not_found' };
		}

		const [lng, lat] = feature.center as [number, number];
		if (!isWithinChicagoBounds(lng, lat) || !isChicagoFeature(feature)) {
			return { point: null, reason: 'outside_chicago' };
		}

		return {
			point: {
				name: feature.place_name ?? query,
				lng,
				lat
			},
			reason: 'ok'
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

	async function resolveStayPoint() {
		const query = stayAddress.trim();
		if (!query) {
			addressError = 'Enter a city, hotel, airport, address or landmark.';
			return false;
		}

		const normalizedQuery = query.toLowerCase();
		if (liveLookupPoint && liveLookupQuery === normalizedQuery) {
			addressError = '';
			stayPoint = liveLookupPoint;
			stayAddress = liveLookupPoint.name;
			return true;
		}

		addressError = '';
		geocoding = true;

		if (!mapboxToken) {
			stayAddress = query;
			geocoding = false;
			return true;
		}

		try {
			const result = await geocodeAddress(query);
			if (!result.point) {
				addressError =
					result.reason === 'outside_chicago'
						? 'Only Chicago locations are supported.'
						: 'Address not found in Chicago. Try a neighborhood, hotel, or landmark.';
				return false;
			}

			stayPoint = result.point;
			stayAddress = result.point.name;
		} catch (error) {
			console.error(error);
			addressError = 'Could not look up that address right now.';
			return false;
		} finally {
			geocoding = false;
		}

		return true;
	}

	$effect(() => {
		const query = stayAddress.trim();
		const normalizedQuery = query.toLowerCase();

		if (plannerMode !== 'manual' || !mapboxToken || query.length < 3) {
			if (query.length < 3) {
				liveLookupState = 'idle';
				liveLookupMessage = '';
				liveLookupPoint = null;
				liveLookupQuery = '';
			}
			return;
		}

		if (normalizedQuery === stayPoint.name.toLowerCase()) {
			liveLookupState = 'ready';
			liveLookupMessage = `Ready: ${stayPoint.name}`;
			liveLookupPoint = stayPoint;
			liveLookupQuery = normalizedQuery;
			return;
		}

		const requestId = ++liveLookupRequestId;
		liveLookupState = 'searching';
		liveLookupMessage = 'Checking Chicago match...';

		const timer = setTimeout(async () => {
			try {
				const result = await geocodeAddress(query);
				if (requestId !== liveLookupRequestId) {
					return;
				}

				if (result.point) {
					liveLookupPoint = result.point;
					liveLookupQuery = normalizedQuery;
					liveLookupState = 'ready';
					liveLookupMessage = `Ready: ${result.point.name}`;
					return;
				}

				liveLookupPoint = null;
				liveLookupQuery = '';
				if (result.reason === 'outside_chicago') {
					liveLookupState = 'outside';
					liveLookupMessage = 'Only Chicago addresses are supported.';
					return;
				}

				liveLookupState = 'not_found';
				liveLookupMessage = 'No Chicago match yet.';
			} catch (error) {
				if (requestId !== liveLookupRequestId) {
					return;
				}

				console.error(error);
				liveLookupPoint = null;
				liveLookupQuery = '';
				liveLookupState = 'error';
				liveLookupMessage = 'Could not validate location right now.';
			}
		}, 350);

		return () => clearTimeout(timer);
	});

	function handleWidgetSearch(payload: { date: string; guests: string; category: string }) {
		const params = new URLSearchParams({
			date: payload.date,
			guests: payload.guests,
			category: payload.category,
			stay: stayPoint.name,
			lat: String(stayPoint.lat),
			lng: String(stayPoint.lng)
		});

		goto(`/find-your-boat?${params.toString()}`);
	}

	function mapPlannerTabToCategory(
		tab: 'boat_charter' | 'large_commercial_charter' | 'sailboat' | 'kayak' | 'jet_ski'
	) {
		const mapping = {
			boat_charter: 'yachts',
			large_commercial_charter: 'yacht',
			sailboat: 'wakesurf',
			kayak: 'club',
			jet_ski: 'yachts'
		} as const;

		return mapping[tab];
	}

	async function handlePlannerSearch(event: SubmitEvent) {
		event.preventDefault();
		plannerError = '';

		if (!checkInDate) {
			plannerError = 'Pick a start date to search.';
			return;
		}

		if (checkOutDate && checkOutDate < checkInDate) {
			plannerError = 'Check-out must be after check-in.';
			return;
		}

		const stayResolved = await resolveStayPoint();
		if (!stayResolved) {
			return;
		}

		handleWidgetSearch({
			date: checkInDate,
			guests,
			category: mapPlannerTabToCategory(activePlannerTab)
		});
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

		<div class="planner-stack">
			<div class="planner-products">
				<button
					type="button"
					class="planner-product"
					class:active={plannerMode === 'ai'}
					onclick={() => (plannerMode = 'ai')}
				>
					<span class="planner-product-chip">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M12 2l1.3 6.3L20 12l-6.7 3.7L12 22l-1.3-6.3L4 12l6.7-3.7L12 2z" />
							<path d="M19 4l.5 2.3L22 7l-2.5.7L19 10l-.5-2.3L16 7l2.5-.7L19 4z" />
						</svg>
					</span>
					<span class="planner-product-label">AI</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={plannerMode === 'manual' && activePlannerTab === 'boat_charter'}
					onclick={() => {
						activePlannerTab = 'boat_charter';
						plannerMode = 'manual';
					}}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M3 16h18M5 16l2-6h10l2 6"></path>
							<path d="M7 9h10M9 6h6"></path>
						</svg>
					</span>
					<span class="planner-product-label">Boat</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={plannerMode === 'manual' && activePlannerTab === 'large_commercial_charter'}
					onclick={() => {
						activePlannerTab = 'large_commercial_charter';
						plannerMode = 'manual';
					}}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<rect x="3.5" y="9" width="17" height="7" rx="1.5"></rect>
							<path d="M5 9l2-4h10l2 4"></path>
							<circle cx="7" cy="16" r="1.2"></circle>
							<circle cx="17" cy="16" r="1.2"></circle>
						</svg>
					</span>
					<span class="planner-product-label">Big</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={plannerMode === 'manual' && activePlannerTab === 'sailboat'}
					onclick={() => {
						activePlannerTab = 'sailboat';
						plannerMode = 'manual';
					}}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M4 17h16"></path>
							<path d="M12 4v13"></path>
							<path d="M12 5l7 5h-7"></path>
							<path d="M12 11L5 16h7"></path>
						</svg>
					</span>
					<span class="planner-product-label">Sailboat</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={plannerMode === 'manual' && activePlannerTab === 'kayak'}
					onclick={() => {
						activePlannerTab = 'kayak';
						plannerMode = 'manual';
					}}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M3 15c4-2 14-2 18 0"></path>
							<path d="M8 14l4-5 4 5"></path>
							<path d="M12 9v9"></path>
						</svg>
					</span>
					<span class="planner-product-label">Kayak</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={plannerMode === 'manual' && activePlannerTab === 'jet_ski'}
					onclick={() => {
						activePlannerTab = 'jet_ski';
						plannerMode = 'manual';
					}}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M4 14h10l3-3h3"></path>
							<path d="M5 17h12"></path>
							<path d="M7 11l2-2h3"></path>
						</svg>
					</span>
					<span class="planner-product-label">Jet Ski</span>
				</button>
			</div>

			{#if plannerMode === 'manual'}
				<form class="planner-search-bar" onsubmit={handlePlannerSearch}>
					<input
						id="stay-address"
						type="text"
						class="planner-location-input"
						placeholder="Enter a Chicago Address"
						bind:value={stayAddress}
					/>

					<div class="planner-bar-divider"></div>

					<div class="planner-date-range">
						<input id="check-in" type="date" bind:value={checkInDate} aria-label="Check in date" />
						<span aria-hidden="true">-</span>
						<input
							id="check-out"
							type="date"
							bind:value={checkOutDate}
							aria-label="Check out date"
						/>
					</div>

					<div class="planner-bar-divider"></div>

					<div class="planner-guests">
						<select id="guests" bind:value={guests} aria-label="Guests">
							<option value="2">1 room, 2 guests</option>
							<option value="4">1 room, 4 guests</option>
							<option value="6">1 room, 6 guests</option>
							<option value="8">2 rooms, 8 guests</option>
							<option value="10">2 rooms, 10+ guests</option>
						</select>
					</div>

					<button
						type="submit"
						class="planner-submit"
						disabled={geocoding}
						aria-label={geocoding ? 'Searching' : 'Search'}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<circle cx="11" cy="11" r="7"></circle>
							<path d="M20 20l-4.2-4.2"></path>
						</svg>
					</button>
				</form>
			{:else}
				<div class="planner-ai-card">
					<div class="planner-ai-logo" aria-hidden="true">
						<svg viewBox="0 0 180 80" role="img">
							<rect x="2" y="2" width="176" height="76" rx="20"></rect>
							<path d="M31 60l14-40h12l14 40h-11l-2.5-8h-14l-2.5 8z"></path>
							<path d="M45 43h10l-5-16z"></path>
							<path d="M91 20h11v40h-11z"></path>
							<path d="M117 20h11v31h20v9h-31z"></path>
							<path d="M153 17l7 7M149 27h11"></path>
						</svg>
					</div>
					<input
						id="ai-prompt"
						type="text"
						class="planner-ai-input"
						placeholder="Tell AI where you're staying and what kind of boat day you want"
						bind:value={aiPrompt}
					/>
					<button type="button" class="planner-ai-back" onclick={() => (plannerMode = 'manual')}>
						Use Standard Search
					</button>
				</div>
			{/if}

			{#if addressError || plannerError}
				<p class="planner-error">{addressError || plannerError}</p>
			{/if}
		</div>

		<div class="map-shell">
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
		box-shadow: var(--shadow-2);
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
		background: linear-gradient(
			135deg,
			var(--color-bg-secondary) 0%,
			var(--color-bg-primary) 55%,
			var(--color-accent-quiet) 100%
		);
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

	.planner-stack {
		margin: 0 0 var(--space-4);
	}

	.planner-products {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-5);
		margin-bottom: var(--space-4);
	}

	.planner-product {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		padding: 0;
		border: none;
		background: transparent;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		cursor: pointer;
		text-align: center;
		transition: color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.planner-product-chip {
		display: grid;
		place-items: center;
		width: 50px;
		height: 50px;
		border-radius: var(--radius-md);
		background: var(--color-surface);
		border: 1px solid var(--color-border-default);
		box-shadow: var(--shadow-2);
		transition:
			background var(--motion-duration-fast) var(--motion-ease-standard),
			border-color var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.planner-product svg {
		width: 28px;
		height: 28px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.planner-product-label {
		line-height: var(--line-height-tight);
	}

	.planner-product.active {
		color: var(--color-text-inverse);
	}

	.planner-product.active .planner-product-chip {
		background: var(--button-primary-bg);
		border-color: var(--color-accent-primary);
	}

	.planner-product.active .planner-product-label {
		color: var(--color-text-primary);
	}

	.planner-product:not(.active):hover .planner-product-chip {
		transform: translateY(-1px);
	}

	.planner-product:first-child.active .planner-product-chip {
		background: var(--color-text-primary);
		border-color: var(--color-text-primary);
	}

	.planner-search-bar {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto auto auto auto;
		align-items: center;
		gap: 0;
		border-radius: var(--radius-lg);
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		box-shadow: var(--shadow-2);
		overflow: hidden;
		padding: var(--space-2);
	}

	.planner-location-input,
	.planner-date-range input,
	.planner-guests select {
		/* height: calc(var(--button-height) + var(--space-4)); */
		border: none;
		background: transparent;
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		color: var(--color-text-primary);
		outline: none;
	}

	.planner-location-input {
		width: 100%;
		padding: 0 var(--space-4);
	}

	.planner-location-input::placeholder {
		color: var(--input-placeholder);
	}

	.planner-bar-divider {
		width: 1px;
		height: calc(var(--space-6) + var(--space-2));
		background: var(--divider-color);
	}

	.planner-date-range {
		display: flex;
		align-items: center;
		padding: 0 var(--space-3);
	}

	.planner-date-range input {
		width: 128px;
		padding: 0;
	}

	.planner-date-range span {
		font-size: var(--font-size-xl);
		font-weight: 300;
		color: var(--color-text-secondary);
		padding: 0 var(--space-2);
	}

	.planner-guests {
		padding: 0 var(--space-3);
	}

	.planner-guests select {
		appearance: none;
		padding-right: var(--space-2);
		cursor: pointer;
	}

	.planner-submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--button-height);
		height: var(--button-height);
		margin-right: var(--space-2);
		border: none;
		border-radius: var(--radius-md);
		background: var(--button-primary-bg);
		color: var(--button-primary-text);
		cursor: pointer;
		transition:
			transform var(--motion-duration-fast) var(--motion-ease-standard),
			opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.planner-submit svg {
		width: 24px;
		height: 24px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
	}

	.planner-submit:hover {
		transform: scale(1.02);
		opacity: var(--state-hover-opacity);
	}

	.planner-submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.planner-ai-card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		background:
			radial-gradient(circle at 10% -10%, var(--color-accent-muted), transparent 45%),
			radial-gradient(circle at 90% 10%, var(--color-accent-quiet), transparent 48%), var(--card-bg);
		border: 1px solid var(--card-border);
		box-shadow: var(--shadow-2);
	}

	.planner-ai-logo svg {
		width: 96px;
		height: 44px;
		fill: none;
		stroke: var(--color-primary);
		stroke-width: 5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.planner-ai-input {
		height: calc(var(--button-height) + var(--space-4));
		padding: 0 var(--space-3);
		border: 1px solid var(--input-border);
		border-radius: var(--radius-md);
		background: var(--input-bg);
		font-family: var(--font-family-system);
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
		outline: none;
	}

	.planner-ai-input:focus {
		border-color: var(--color-border-strong);
		box-shadow: 0 0 0 var(--focus-ring-width) var(--focus-ring-color);
	}

	.planner-ai-back {
		height: var(--button-height);
		padding: 0 var(--space-3);
		border: none;
		border-radius: var(--radius-md);
		background: var(--button-secondary-bg);
		color: var(--button-secondary-text);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.planner-ai-back:hover {
		opacity: var(--state-hover-opacity);
	}

	.planner-error {
		margin: var(--space-2) 0 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-error);
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
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		backdrop-filter: var(--blur-glass);
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
		background: var(--color-text-primary);
	}

	.dot-boat {
		background: var(--color-primary);
	}

	.map-shell :global(.boat-popup-frame .mapboxgl-popup-content) {
		padding: 0;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: var(--shadow-2);
	}

	.map-shell :global(.boat-popup-frame .mapboxgl-popup-tip) {
		border-top-color: var(--color-surface);
	}

	.map-shell :global(.boat-popup-card) {
		background: var(--color-surface);
	}

	.map-shell :global(.boat-popup-image) {
		display: block;
		width: 100%;
		height: 140px;
		object-fit: cover;
	}

	.map-shell :global(.boat-popup-body) {
		padding: var(--space-3);
	}

	.map-shell :global(.boat-popup-title) {
		margin: 0 0 var(--space-1);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		line-height: 1.3;
	}

	.map-shell :global(.boat-popup-description) {
		margin: 0 0 var(--space-3);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.map-shell :global(.boat-popup-book) {
		display: flex;
		align-items: center;
		justify-content: center;
		height: var(--button-height);
		border-radius: var(--radius-md);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		text-decoration: none;
		color: var(--button-primary-text);
		background: var(--button-primary-bg);
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.map-shell :global(.boat-popup-book:hover) {
		opacity: 0.9;
	}

	@media (max-width: 900px) {
		.map-shell {
			min-height: 600px;
		}

		.legend {
			right: var(--space-3);
			top: var(--space-3);
		}

		.planner-product {
			width: 96px;
			font-size: var(--font-size-sm);
		}

		.planner-product-chip {
			width: 84px;
			height: 84px;
		}

		.planner-search-bar {
			grid-template-columns: 1fr;
			padding: var(--space-2);
			gap: var(--space-2);
		}

		.planner-location-input,
		.planner-date-range input,
		.planner-guests select {
			height: 52px;
			font-size: var(--font-size-base);
		}

		.planner-location-input,
		.planner-date-range,
		.planner-guests {
			border: 1px solid var(--color-border-default);
			border-radius: var(--radius-md);
		}

		.planner-date-range,
		.planner-guests {
			padding-left: var(--space-3);
			padding-right: var(--space-3);
		}

		.planner-bar-divider {
			display: none;
		}

		.planner-date-range input {
			width: 100%;
		}

		.planner-submit {
			width: 100%;
			height: 52px;
			margin-right: 0;
			border-radius: var(--radius-md);
		}

		.planner-submit svg {
			width: 26px;
			height: 26px;
		}

		.planner-ai-card {
			grid-template-columns: 1fr;
		}

		.planner-ai-logo {
			justify-self: center;
		}
	}

	@media (max-width: 640px) {
		.find-boat-map-section {
			padding: var(--space-4) var(--space-4) var(--space-8);
		}

		.map-shell {
			min-height: 520px;
		}

		.legend {
			display: none;
		}

		.planner-products {
			gap: var(--space-3);
		}

		.planner-product {
			width: 78px;
			padding: 0;
			font-size: var(--font-size-xs);
		}

		.planner-product-chip {
			width: 72px;
			height: 72px;
			border-radius: var(--radius-sm);
		}

		.planner-product svg {
			width: 20px;
			height: 20px;
		}

		.planner-location-input {
			padding: 0 var(--space-3);
		}

		.planner-ai-logo svg {
			width: 96px;
			height: 44px;
		}
	}
</style>
