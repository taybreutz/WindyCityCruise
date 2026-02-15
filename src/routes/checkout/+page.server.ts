import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const supabase = createClient(env.PUBLIC_SUPABASE_URL ?? '', env.PUBLIC_SUPABASE_ANON_KEY ?? '');

	// Resolve org by slug
	const { data: org } = await supabase
		.from('organizations')
		.select('id')
		.eq('slug', env.PUBLIC_ORG_SLUG ?? '')
		.single();

	if (!org) {
		return { items: [], orgId: '' };
	}

	// Fetch active, non-archived items for this org
	const { data: items } = await supabase
		.from('items')
		.select('*')
		.eq('org_id', org.id)
		.eq('is_active', true)
		.eq('is_archived', false)
		.order('name');

	return {
		items: items ?? [],
		orgId: org.id
	};
};
