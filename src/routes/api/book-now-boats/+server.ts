import { env } from '$env/dynamic/public';
import { buildMapBoatLocationsFromBookNow, seedBoatLocations } from '$lib/data/boats';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

interface BookNowBoatRow {
	id: string;
	name: string;
	description: string | null;
	capacity: number;
	image_url: string | null;
}

export const GET: RequestHandler = async () => {
	const supabaseUrl = env.PUBLIC_SUPABASE_URL ?? '';
	const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY ?? '';
	const orgSlug = env.PUBLIC_ORG_SLUG ?? '';

	if (!supabaseUrl || !supabaseAnonKey || !orgSlug) {
		return json({ boats: seedBoatLocations });
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	try {
		const { data: org, error: orgError } = await supabase
			.from('organizations')
			.select('id')
			.eq('slug', orgSlug)
			.single();

		if (orgError || !org?.id) {
			return json({ boats: seedBoatLocations });
		}

		const { data: items, error: itemsError } = await supabase
			.from('items')
			.select('id, name, description, capacity, image_url')
			.eq('org_id', org.id)
			.eq('is_active', true)
			.eq('is_archived', false)
			.order('name');

		if (itemsError || !items) {
			return json({ boats: seedBoatLocations });
		}

		return json({
			boats: buildMapBoatLocationsFromBookNow(items as BookNowBoatRow[])
		});
	} catch (error) {
		console.error('Unable to load Book Now boats for map markers.', error);
		return json({ boats: seedBoatLocations });
	}
};
