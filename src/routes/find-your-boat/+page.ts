import type { PageLoad } from './$types';

const DEFAULT_STAY = {
	name: 'River North, Chicago, IL',
	lat: 41.8925,
	lng: -87.6316
};

const CHICAGO_BBOX = {
	minLng: -87.95,
	minLat: 41.6,
	maxLng: -87.5,
	maxLat: 42.05
};

function isWithinChicagoBounds(lat: number, lng: number) {
	return (
		lat >= CHICAGO_BBOX.minLat &&
		lat <= CHICAGO_BBOX.maxLat &&
		lng >= CHICAGO_BBOX.minLng &&
		lng <= CHICAGO_BBOX.maxLng
	);
}

export const load: PageLoad = ({ url }) => {
	const date = url.searchParams.get('date') ?? '';
	const guests = url.searchParams.get('guests') ?? '2';
	const category = url.searchParams.get('category') ?? 'yachts';
	const requestedStay = url.searchParams.get('stay') ?? DEFAULT_STAY.name;

	const lat = Number(url.searchParams.get('lat'));
	const lng = Number(url.searchParams.get('lng'));
	const hasValidChicagoCoords =
		Number.isFinite(lat) && Number.isFinite(lng) && isWithinChicagoBounds(lat, lng);

	return {
		date,
		guests,
		category,
		stay: hasValidChicagoCoords ? requestedStay : DEFAULT_STAY.name,
		stayLat: hasValidChicagoCoords ? lat : DEFAULT_STAY.lat,
		stayLng: hasValidChicagoCoords ? lng : DEFAULT_STAY.lng
	};
};
