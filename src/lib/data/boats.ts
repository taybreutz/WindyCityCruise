export interface BoatLocation {
	name: string;
	lng: number;
	lat: number;
	description: string;
	bookHref: string;
}

export const BOAT_POPUP_IMAGE =
	'https://res.cloudinary.com/dlobqp00u/image/upload/w_2560,q_auto,f_auto/v1770920545/chicago-boat-rental-56ft-sea-ray-sundancer-chicago-skyline.png';

export const boatLocations: BoatLocation[] = [
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
