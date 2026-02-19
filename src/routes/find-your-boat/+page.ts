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

const GUEST_LIMITS = [13, 20, 49, 150] as const;

function normalizeGuestLimit(rawGuests: string | null): number {
	const parsedGuests = Number(rawGuests);
	if (!Number.isFinite(parsedGuests) || parsedGuests <= 0) {
		return 13;
	}

	for (const limit of GUEST_LIMITS) {
		if (parsedGuests <= limit) {
			return limit;
		}
	}

	return 150;
}

function guestLimitLabel(limit: number): string {
	if (limit === 150) {
		return 'Up to 150';
	}

	return `${limit} or less`;
}

export const load: PageLoad = ({ url }) => {
	const date = url.searchParams.get('date') ?? url.searchParams.get('checkIn') ?? '';
	const guestLimit = normalizeGuestLimit(url.searchParams.get('guests'));
	const category = url.searchParams.get('category') ?? 'yachts';
	const requestedStay =
		url.searchParams.get('stay') ?? url.searchParams.get('near') ?? DEFAULT_STAY.name;

	const lat = Number(url.searchParams.get('lat'));
	const lng = Number(url.searchParams.get('lng'));
	const hasValidChicagoCoords =
		Number.isFinite(lat) && Number.isFinite(lng) && isWithinChicagoBounds(lat, lng);
	const hasSearch = Boolean(url.searchParams.get('stay') || url.searchParams.get('near'));

	return {
		date,
		guests: String(guestLimit),
		guestLabel: guestLimitLabel(guestLimit),
		category,
		hasSearch,
		stay: hasValidChicagoCoords || hasSearch ? requestedStay : DEFAULT_STAY.name,
		stayLat: hasValidChicagoCoords ? lat : DEFAULT_STAY.lat,
		stayLng: hasValidChicagoCoords ? lng : DEFAULT_STAY.lng
	};
};
