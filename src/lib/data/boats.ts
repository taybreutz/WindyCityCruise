export interface BoatLocation {
	id: string;
	name: string;
	lng: number;
	lat: number;
	description: string;
	bookHref: string;
	imageUrl?: string;
	capacity?: number;
}

export const BOAT_POPUP_IMAGE =
	'https://res.cloudinary.com/dlobqp00u/image/upload/w_2560,q_auto,f_auto/v1770920545/chicago-boat-rental-56ft-sea-ray-sundancer-chicago-skyline.png';

export interface BookNowBoatSource {
	id: string;
	name: string;
	description: string | null;
	capacity: number;
	image_url: string | null;
}

interface HarborPoint {
	name: string;
	lng: number;
	lat: number;
}

const THIRTEEN_PRIMARY: HarborPoint = {
	name: '31st Street Harbor',
	lat: 41.834794,
	lng: -87.603969
};

const FORTY_NINE_PRIMARY: HarborPoint = {
	name: 'Burnham Harbor',
	lat: 41.861163,
	lng: -87.612051
};

const THIRTEEN_DUPLICATE: HarborPoint = {
	name: 'Navy Pier Marina',
	lat: 41.892381,
	lng: -87.605457
};

const FORTY_NINE_DUPLICATE: HarborPoint = {
	name: 'Chicago River West',
	lat: 41.899292,
	lng: -87.64563
};

function buildDescription(item: BookNowBoatSource, harbor: HarborPoint) {
	const itemDescription = item.description?.trim();
	if (itemDescription) {
		return `${harbor.name} Pickup - ${itemDescription}`;
	}

	return `${harbor.name} Pickup - Up to ${item.capacity} passengers`;
}

function toBoatLocation(
	item: BookNowBoatSource,
	harbor: HarborPoint,
	options?: { idSuffix?: string; nameSuffix?: string }
): BoatLocation {
	const suffix = options?.idSuffix ? `-${options.idSuffix}` : '';

	return {
		id: `${item.id}${suffix}`,
		name: options?.nameSuffix ? `${item.name} ${options.nameSuffix}` : item.name,
		lng: harbor.lng,
		lat: harbor.lat,
		description: buildDescription(item, harbor),
		bookHref: '/book',
		imageUrl: item.image_url ?? BOAT_POPUP_IMAGE,
		capacity: item.capacity
	};
}

function makeSeedSource(capacity: number, index: number): BookNowBoatSource {
	return {
		id: `seed-${capacity}-${index}`,
		name: `${capacity} Passenger Charter ${index}`,
		description: null,
		capacity,
		image_url: null
	};
}

function addSeededDuplicates(
	target: BoatLocation[],
	source: BookNowBoatSource[],
	count: number,
	capacity: number,
	harbor: HarborPoint
) {
	for (let index = 0; index < count; index += 1) {
		const sourceBoat = source[index % source.length] ?? makeSeedSource(capacity, index + 1);
		target.push(
			toBoatLocation(sourceBoat, harbor, {
				idSuffix: `${harbor.name.toLowerCase().replaceAll(' ', '-')}-${index + 1}`,
				nameSuffix: `(${harbor.name})`
			})
		);
	}
}

export function buildMapBoatLocationsFromBookNow(source: BookNowBoatSource[]): BoatLocation[] {
	const boats = [...source].sort((a, b) => a.name.localeCompare(b.name));
	const capacity13 = boats.filter((boat) => boat.capacity === 13);
	const capacity49 = boats.filter((boat) => boat.capacity === 49);
	const remaining = boats.filter((boat) => boat.capacity !== 13 && boat.capacity !== 49);

	const mapped: BoatLocation[] = [
		...capacity13.map((boat) => toBoatLocation(boat, THIRTEEN_PRIMARY)),
		...capacity49.map((boat) => toBoatLocation(boat, FORTY_NINE_PRIMARY))
	];

	addSeededDuplicates(mapped, capacity13, 2, 13, THIRTEEN_DUPLICATE);
	addSeededDuplicates(mapped, capacity49, 1, 49, FORTY_NINE_DUPLICATE);

	for (const boat of remaining) {
		if (boat.capacity < 20) {
			mapped.push(toBoatLocation(boat, THIRTEEN_PRIMARY));
			continue;
		}

		if (boat.capacity >= 40) {
			mapped.push(toBoatLocation(boat, FORTY_NINE_PRIMARY));
			continue;
		}

		mapped.push(toBoatLocation(boat, THIRTEEN_DUPLICATE));
	}

	return mapped.length > 0 ? mapped : seedBoatLocations;
}

export const seedBoatLocations: BoatLocation[] = [
	{
		id: 'seed-13-main',
		name: '13 Passenger Charter',
		lng: THIRTEEN_PRIMARY.lng,
		lat: THIRTEEN_PRIMARY.lat,
		description: '31st Street Harbor Pickup - Up to 13 passengers',
		bookHref: '/book',
		capacity: 13
	},
	{
		id: 'seed-49-main',
		name: '49 Passenger Charter',
		lng: FORTY_NINE_PRIMARY.lng,
		lat: FORTY_NINE_PRIMARY.lat,
		description: 'Burnham Harbor Pickup - Up to 49 passengers',
		bookHref: '/book',
		capacity: 49
	},
	{
		id: 'seed-13-navy-1',
		name: '13 Passenger Charter (Navy Pier)',
		lng: THIRTEEN_DUPLICATE.lng,
		lat: THIRTEEN_DUPLICATE.lat,
		description: 'Navy Pier Marina Pickup - Up to 13 passengers',
		bookHref: '/book',
		capacity: 13
	},
	{
		id: 'seed-13-navy-2',
		name: '13 Passenger Charter 2 (Navy Pier)',
		lng: THIRTEEN_DUPLICATE.lng,
		lat: THIRTEEN_DUPLICATE.lat,
		description: 'Navy Pier Marina Pickup - Up to 13 passengers',
		bookHref: '/book',
		capacity: 13
	},
	{
		id: 'seed-49-river-west',
		name: '49 Passenger Charter (River West)',
		lng: FORTY_NINE_DUPLICATE.lng,
		lat: FORTY_NINE_DUPLICATE.lat,
		description: 'Chicago River West Pickup - Up to 49 passengers',
		bookHref: '/book',
		capacity: 49
	}
];
