<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { BOAT_POPUP_IMAGE, seedBoatLocations, type BoatLocation } from '$lib/data/boats';
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

	interface BoatWithDistance extends BoatLocation {
		distanceMiles: number;
	}

	let stayAddress = $state('River North, Chicago, IL');
	let stayPoint = $state<PointOfInterest>({
		name: 'River North, Chicago, IL',
		lng: -87.6316,
		lat: 41.8925
	});

	let mapContainer = $state<HTMLDivElement | undefined>(undefined);
	let mapShell = $state<HTMLDivElement | undefined>(undefined);
	let map: any = null;
	let mapboxgl: any = null;
	let stayMarker: any = null;
	let boatMarkers: any[] = [];
	let mapBoats = $state<BoatLocation[]>(seedBoatLocations);
	let hasMapSearch = $state(false);
	let chicagoOverlayOpacity = $state(1);

	let mapReady = $state(false);
	let geocoding = $state(false);
	let mapError = $state('');
	let addressError = $state('');
	let plannerError = $state('');
	let activePlannerTab = $state<
		'bareboat' | 'light_commercial' | 'commercial' | 'sailboat' | 'kayak' | 'jet_ski'
	>('bareboat');
	let checkInDate = $state('');
	let guests = $state('13');
	let searchedDate = $state('');
	let searchedGuests = $state(13);
	let searchedCategory = $state<'yachts' | 'yacht' | 'wakesurf' | 'club'>('yachts');
	let liveLookupState = $state<
		'idle' | 'searching' | 'ready' | 'outside_chicago' | 'not_found' | 'error'
	>('idle');
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

	function boatCapacityValue(boat: BoatLocation) {
		const capacity = Number(boat.capacity);
		return Number.isFinite(capacity) && capacity > 0 ? capacity : 150;
	}

	function compareByGuestPreference(a: BoatWithDistance, b: BoatWithDistance) {
		const aCapacity = boatCapacityValue(a);
		const bCapacity = boatCapacityValue(b);
		const aFits = aCapacity <= searchedGuests ? 0 : 1;
		const bFits = bCapacity <= searchedGuests ? 0 : 1;
		if (aFits !== bFits) {
			return aFits - bFits;
		}

		const aCapacityGap = Math.abs(searchedGuests - aCapacity);
		const bCapacityGap = Math.abs(searchedGuests - bCapacity);
		if (aCapacityGap !== bCapacityGap) {
			return aCapacityGap - bCapacityGap;
		}

		return a.distanceMiles - b.distanceMiles;
	}

	const searchedBoats = $derived.by(() => {
		if (!hasMapSearch) {
			return [] as BoatWithDistance[];
		}

		return mapBoats
			.map((boat) => ({
				...boat,
				distanceMiles: milesBetween(stayPoint.lat, stayPoint.lng, boat.lat, boat.lng)
			}))
			.sort(compareByGuestPreference);
	});

	function buildBookHref(baseHref: string) {
		const params = new URLSearchParams();
		if (searchedDate) {
			params.set('date', searchedDate);
		}
		if (searchedGuests) {
			params.set('guests', String(searchedGuests));
		}

		const query = params.toString();
		return query ? `${baseHref}?${query}` : baseHref;
	}

	function getBoatPopupHtml(boat: BoatLocation) {
		const boatName = escapeHtml(boat.name);
		const boatDescription = escapeHtml(boat.description ?? 'Chicago Pickup');
		const bookHref = buildBookHref(boat.bookHref ?? '/book');
		const boatImage = boat.imageUrl ?? BOAT_POPUP_IMAGE;

		return `
			<div class="boat-popup-card">
				<img src="${boatImage}" alt="${boatName}" class="boat-popup-image" />
				<div class="boat-popup-body">
					<p class="boat-popup-title">${boatName}</p>
					<p class="boat-popup-description">${boatDescription}</p>
					<a href="${bookHref}" class="boat-popup-book">Book Now</a>
				</div>
			</div>
		`;
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
		boatMarkers = [];
		if (!hasMapSearch) {
			return;
		}

		boatMarkers = searchedBoats.map((boat) =>
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
			stayMarker = null;
		}

		if (!hasMapSearch) {
			return;
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
			addressError = 'Enter a Chicago neighborhood, hotel, or address.';
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
		if (!browser) {
			return;
		}

		const query = stayAddress.trim();
		const normalizedQuery = query.toLowerCase();

		if (query.length < 3) {
			liveLookupState = 'idle';
			liveLookupMessage = '';
			liveLookupPoint = null;
			liveLookupQuery = '';
			return;
		}

		if (!mapboxToken) {
			liveLookupState = 'error';
			liveLookupMessage = 'Live Chicago validation is unavailable right now.';
			liveLookupPoint = null;
			liveLookupQuery = '';
			return;
		}

		if (liveLookupPoint && liveLookupQuery === normalizedQuery) {
			liveLookupState = 'ready';
			liveLookupMessage = `Ready: ${liveLookupPoint.name}`;
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
					liveLookupState = 'outside_chicago';
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

	function applySearchContext(payload: { date: string; guests: string; category: string }) {
		searchedDate = payload.date;
		searchedGuests = Number(payload.guests) || 13;
		searchedCategory = payload.category as 'yachts' | 'yacht' | 'wakesurf' | 'club';
	}

	function mapPlannerTabToCategory(
		tab: 'bareboat' | 'light_commercial' | 'commercial' | 'sailboat' | 'kayak' | 'jet_ski'
	) {
		const mapping = {
			bareboat: 'yachts',
			light_commercial: 'yacht',
			commercial: 'yacht',
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

		const stayResolved = await resolveStayPoint();
		if (!stayResolved) {
			return;
		}
		hasMapSearch = true;
		applySearchContext({
			date: checkInDate,
			guests,
			category: mapPlannerTabToCategory(activePlannerTab)
		});
		plotStayMarker();
		plotBoatMarkers();
	}

	async function hydrateSearchFromUrl() {
		if (typeof window === 'undefined') {
			return;
		}

		const params = new URLSearchParams(window.location.search);
		const near = params.get('near') ?? params.get('stay');
		if (!near) {
			return;
		}

		const date = params.get('date') ?? params.get('checkIn') ?? '';
		const guestsFromParams = params.get('guests') ?? '';
		const categoryFromParams = params.get('category');

		stayAddress = near;
		checkInDate = date;
		if (guestsFromParams) {
			guests = guestsFromParams;
		}

		const stayResolved = await resolveStayPoint();
		if (!stayResolved) {
			return;
		}

		hasMapSearch = true;
		applySearchContext({
			date,
			guests: guestsFromParams || guests,
			category:
				categoryFromParams && ['yachts', 'yacht', 'wakesurf', 'club'].includes(categoryFromParams)
					? categoryFromParams
					: mapPlannerTabToCategory(activePlannerTab)
		});
		plotStayMarker();
		plotBoatMarkers();
	}

	if (browser) {
		afterNavigate(() => {
			void hydrateSearchFromUrl();
		});
	}

	onMount(() => {
		let isDestroyed = false;
		void loadMapBoats();
		void hydrateSearchFromUrl();

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
		if (!mapReady || !map || !stayPoint || !hasMapSearch) {
			return;
		}

		map.flyTo({
			center: [stayPoint.lng, stayPoint.lat],
			zoom: 12,
			essential: true
		});

		plotStayMarker();
	});

	$effect(() => {
		if (!mapReady || !map) {
			return;
		}

		plotBoatMarkers();
	});

	$effect(() => {
		if (typeof window === 'undefined' || !mapShell) {
			return;
		}

		const shell = mapShell;
		let rafId = 0;

		const updateOverlayOpacity = () => {
			const rect = shell.getBoundingClientRect();
			const viewportHeight = window.innerHeight || 1;
			const fadeStart = viewportHeight * 0.72;
			const fadeEnd = viewportHeight * 0.12;
			const rawProgress = (fadeStart - rect.top) / (fadeStart - fadeEnd);
			const clampedProgress = Math.max(0, Math.min(1, rawProgress));
			chicagoOverlayOpacity = 1 - clampedProgress;
		};

		const handleScroll = () => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(updateOverlayOpacity);
		};

		updateOverlayOpacity();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	});
</script>

<section class="find-boat-map-section" id="find-your-boat-map">
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
					class:active={activePlannerTab === 'bareboat'}
					onclick={() => (activePlannerTab = 'bareboat')}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M3 16h18M5 16l2-6h10l2 6"></path>
							<path d="M7 9h10M9 6h6"></path>
						</svg>
					</span>
					<span class="planner-product-label">Bareboat</span>
					<span class="planner-product-capacity">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<circle cx="12" cy="7" r="3.2"></circle>
							<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
						</svg>
						13
					</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={activePlannerTab === 'light_commercial'}
					onclick={() => (activePlannerTab = 'light_commercial')}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<rect x="3.5" y="9" width="17" height="7" rx="1.5"></rect>
							<path d="M5 9l2-4h10l2 4"></path>
							<circle cx="7" cy="16" r="1.2"></circle>
							<circle cx="17" cy="16" r="1.2"></circle>
						</svg>
					</span>
					<span class="planner-product-label">Light-Commercial</span>
					<span class="planner-product-capacity">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<circle cx="12" cy="7" r="3.2"></circle>
							<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
						</svg>
						20
					</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={activePlannerTab === 'commercial'}
					onclick={() => (activePlannerTab = 'commercial')}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<rect x="3" y="8.5" width="18" height="8.5" rx="1.6"></rect>
							<path d="M6 8.5V5.5h12v3"></path>
							<path d="M8 17.5v2M16 17.5v2"></path>
						</svg>
					</span>
					<span class="planner-product-label">Commercial</span>
					<span class="planner-product-capacity">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<circle cx="12" cy="7" r="3.2"></circle>
							<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
						</svg>
						49
					</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={activePlannerTab === 'sailboat'}
					onclick={() => (activePlannerTab = 'sailboat')}
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
					<span class="planner-product-capacity">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<circle cx="12" cy="7" r="3.2"></circle>
							<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
						</svg>
						7
					</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={activePlannerTab === 'jet_ski'}
					onclick={() => (activePlannerTab = 'jet_ski')}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M4 14h10l3-3h3"></path>
							<path d="M5 17h12"></path>
							<path d="M7 11l2-2h3"></path>
						</svg>
					</span>
					<span class="planner-product-label">JetSki</span>
					<span class="planner-product-capacity">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<circle cx="12" cy="7" r="3.2"></circle>
							<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
						</svg>
						2
					</span>
				</button>

				<button
					type="button"
					class="planner-product"
					class:active={activePlannerTab === 'kayak'}
					onclick={() => (activePlannerTab = 'kayak')}
				>
					<span class="planner-product-chip">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M3 15c4-2 14-2 18 0"></path>
							<path d="M8 14l4-5 4 5"></path>
							<path d="M12 9v9"></path>
						</svg>
					</span>
					<span class="planner-product-label">Kayak</span>
					<span class="planner-product-capacity">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<circle cx="12" cy="7" r="3.2"></circle>
							<path d="M6.5 19.5c0-2.9 2.4-5.3 5.5-5.3s5.5 2.4 5.5 5.3"></path>
						</svg>
						1
					</span>
				</button>
			</div>

			<form class="planner-search-bar" onsubmit={handlePlannerSearch}>
				<button type="button" class="planner-ai-trigger" aria-label="AI planner (coming soon)">
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
				</button>

				<input
					id="stay-address"
					type="text"
					class="planner-location-input"
					placeholder="Enter a Chicago neighborhood, hotel, or address"
					bind:value={stayAddress}
				/>

				<div class="planner-bar-divider"></div>

				<div class="planner-date-range">
					<input id="check-in" type="date" bind:value={checkInDate} aria-label="Trip date" />
				</div>

				<div class="planner-bar-divider"></div>

				<div class="planner-guests">
					<select id="guests" bind:value={guests} aria-label="Guests">
						<option value="13">13 or less</option>
						<option value="20">20 or less</option>
						<option value="49">49 or less</option>
						<option value="150">Up to 150</option>
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

			{#if liveLookupState !== 'idle' && !addressError && !plannerError}
				<p
					class="planner-live-hint"
					class:ready={liveLookupState === 'ready'}
					class:warning={liveLookupState === 'outside_chicago' || liveLookupState === 'not_found'}
					class:error={liveLookupState === 'error'}
					aria-live="polite"
				>
					{liveLookupMessage}
				</p>
			{/if}

			{#if addressError || plannerError}
				<p class="planner-error">{addressError || plannerError}</p>
			{/if}
		</div>

		<div class="map-planner-spacer" aria-hidden="true"></div>

		<div class="map-shell" bind:this={mapShell}>
			{#if mapError}
				<div class="map-fallback">
					<p>{mapError}</p>
				</div>
			{:else}
				<div class="map-canvas" bind:this={mapContainer}></div>
			{/if}
			<div
				class="map-chicago-overlay"
				style:opacity={chicagoOverlayOpacity}
				aria-hidden="true"
			></div>

			<div class="legend">
				<span><i class="dot dot-stay"></i>Your stay</span>
				<span><i class="dot dot-boat"></i>Boat locations</span>
			</div>
		</div>

		<section class="home-map-results" id="find-your-boat-map-results">
			<div class="home-map-results-header">
				<h3>Boat Matches</h3>
				{#if hasMapSearch}
					<p>Ordered for {searchedGuests} guests · {searchedCategory}</p>
				{/if}
			</div>

			{#if !hasMapSearch}
				<p class="home-map-results-empty">
					Use the planner above to search by neighborhood, hotel, or address.
				</p>
			{:else if searchedBoats.length === 0}
				<p class="home-map-results-empty">
					No boats matched this search yet. Try a different date or guest size.
				</p>
			{:else}
				<div class="home-map-results-list">
					{#each searchedBoats as boat (boat.id)}
						<article class="home-map-results-card">
							<img
								src={boat.imageUrl ?? BOAT_POPUP_IMAGE}
								alt={boat.name}
								class="home-map-results-image"
							/>
							<div class="home-map-results-body">
								<p class="home-map-results-title">{boat.name}</p>
								<p class="home-map-results-meta">
									Up to {boat.capacity ?? 150} passengers
									<span>{boat.distanceMiles.toFixed(1)} mi</span>
								</p>
								<p class="home-map-results-description">{boat.description}</p>
								<a href={buildBookHref(boat.bookHref ?? '/book')} class="home-map-results-book"
									>Book Now</a
								>
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</section>

<style>
	.find-boat-map-section {
		padding: var(--space-3) var(--space-5) var(--space-10);
		background: var(--color-bg-primary);
	}

	.find-boat-header,
	.planner-stack {
		display: none;
	}

	.map-planner-spacer {
		height: clamp(150px, 16vh, 230px);
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

	.map-chicago-overlay {
		position: absolute;
		inset: 0;
		z-index: 8;
		pointer-events: none;
		background: rgba(248, 249, 250, 0.26);
		backdrop-filter: blur(12px) saturate(1.06);
		-webkit-backdrop-filter: blur(12px) saturate(1.06);
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 700'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial,Helvetica,sans-serif' font-weight='900' font-size='260' letter-spacing='14' textLength='96%25' lengthAdjust='spacingAndGlyphs' fill='black'%3ECHICAGO%3C/text%3E%3C/svg%3E");
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		-webkit-mask-mode: luminance;
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 700'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial,Helvetica,sans-serif' font-weight='900' font-size='260' letter-spacing='14' textLength='96%25' lengthAdjust='spacingAndGlyphs' fill='black'%3ECHICAGO%3C/text%3E%3C/svg%3E");
		mask-repeat: no-repeat;
		mask-size: 100% 100%;
		mask-mode: luminance;
		transition: opacity var(--motion-duration-default) linear;
		will-change: opacity;
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

	.planner-product-chip svg {
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
		color: var(--color-text-primary);
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

	.planner-product-capacity {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.planner-product-capacity svg {
		width: 14px;
		height: 14px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.planner-product.active .planner-product-capacity {
		color: var(--color-text-primary);
	}

	.planner-search-bar {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto auto auto auto auto;
		align-items: center;
		gap: 0;
		border-radius: var(--radius-lg);
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		box-shadow: var(--shadow-2);
		overflow: hidden;
		padding: var(--space-2);
	}

	.planner-ai-trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--button-height);
		height: var(--button-height);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			transform var(--motion-duration-fast) var(--motion-ease-standard),
			opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.planner-ai-trigger svg {
		width: 20px;
		height: 20px;
	}

	.planner-ai-trigger:hover {
		transform: translateY(-1px);
		opacity: var(--state-hover-opacity);
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

	.planner-live-hint {
		margin: var(--space-2) 0 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	.planner-live-hint.ready {
		color: var(--color-primary);
	}

	.planner-live-hint.warning {
		color: var(--color-text-secondary);
	}

	.planner-live-hint.error {
		color: var(--color-error);
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

	.home-map-results {
		margin-top: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-elevated);
		box-shadow: var(--shadow-2);
		padding: var(--space-4);
	}

	.home-map-results-header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.home-map-results-header h3 {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.home-map-results-header p {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.home-map-results-empty {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.home-map-results-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		max-height: 360px;
		overflow-y: auto;
		padding-right: 2px;
	}

	.home-map-results-card {
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr);
		gap: var(--space-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		padding: var(--space-2);
	}

	.home-map-results-image {
		width: 120px;
		height: 100px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.home-map-results-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

	.home-map-results-title {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.home-map-results-meta {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.home-map-results-description {
		margin: 0;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}

	.home-map-results-book {
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
		color: var(--button-primary-text);
		background: var(--button-primary-bg);
	}

	@media (max-width: 900px) {
		.map-planner-spacer {
			height: clamp(120px, 14vh, 180px);
		}

		.map-shell {
			min-height: 600px;
		}

		.map-chicago-overlay {
			-webkit-mask-size: 150% 100%;
			mask-size: 150% 100%;
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

		.planner-ai-trigger,
		.planner-location-input,
		.planner-date-range input,
		.planner-guests select {
			height: 52px;
			font-size: var(--font-size-base);
		}

		.planner-ai-trigger,
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

		.home-map-results-card {
			grid-template-columns: 1fr;
		}

		.home-map-results-image {
			width: 100%;
			height: 150px;
		}
	}

	@media (max-width: 640px) {
		.find-boat-map-section {
			padding: var(--space-4) var(--space-4) var(--space-8);
		}

		.map-planner-spacer {
			height: clamp(90px, 10vh, 140px);
		}

		.map-shell {
			min-height: 520px;
		}

		.map-chicago-overlay {
			-webkit-mask-size: 220% 100%;
			mask-size: 220% 100%;
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

		.planner-product-chip svg {
			width: 20px;
			height: 20px;
		}

		.planner-location-input {
			padding: 0 var(--space-3);
		}
	}
</style>
