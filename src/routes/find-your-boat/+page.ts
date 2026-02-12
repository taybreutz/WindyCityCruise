import type { PageLoad } from './$types';

const DEFAULT_STAY = {
	name: 'River North, Chicago, IL',
	lat: 41.8925,
	lng: -87.6316
};

export const load: PageLoad = ({ url }) => {
	const date = url.searchParams.get('date') ?? '';
	const guests = url.searchParams.get('guests') ?? '2';
	const category = url.searchParams.get('category') ?? 'yachts';
	const stay = url.searchParams.get('stay') ?? DEFAULT_STAY.name;

	const lat = Number(url.searchParams.get('lat'));
	const lng = Number(url.searchParams.get('lng'));

	return {
		date,
		guests,
		category,
		stay,
		stayLat: Number.isFinite(lat) ? lat : DEFAULT_STAY.lat,
		stayLng: Number.isFinite(lng) ? lng : DEFAULT_STAY.lng
	};
};
