import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';
import { findActiveSeason } from '$lib/availability';
import type { Item, ItemSeason, SeasonTemplate } from '$lib/types/database';

export const load: PageServerLoad = async () => {
	const supabase = createClient(env.PUBLIC_SUPABASE_URL ?? '', env.PUBLIC_SUPABASE_ANON_KEY ?? '');

	// Resolve org by slug
	const { data: org } = await supabase
		.from('organizations')
		.select('id')
		.eq('slug', env.PUBLIC_ORG_SLUG ?? '')
		.single();

	if (!org) {
		return { items: [], orgId: '', itemRates: {}, itemDurations: {} };
	}

	// Fetch active items + season data for rate resolution
	const [{ data: items }, { data: itemSeasons }, { data: seasonTemplates }] = await Promise.all([
		supabase
			.from('items')
			.select('*')
			.eq('org_id', org.id)
			.eq('is_active', true)
			.eq('is_archived', false)
			.order('name'),
		supabase.from('item_seasons').select('*').eq('org_id', org.id),
		supabase
			.from('season_templates')
			.select('*')
			.eq('org_id', org.id)
			.eq('is_active', true)
	]);

	// Resolve display rates and available durations per item:
	// 1. Try active season for today
	// 2. Fall back to any item_season that has a value
	// 3. Fall back to item defaults
	const today = new Date().toISOString().split('T')[0];
	const allTemplates = (seasonTemplates ?? []) as SeasonTemplate[];
	const itemRates: Record<string, number> = {};
	const itemDurations: Record<string, number[]> = {};
	for (const item of (items ?? []) as Item[]) {
		const boatSeasons = ((itemSeasons ?? []) as ItemSeason[]).filter(
			(is) => is.item_id === item.id
		);
		const season = findActiveSeason(boatSeasons, allTemplates, today);

		// Rate resolution
		if (season?.itemSeason.base_hourly_rate) {
			itemRates[item.id] = season.itemSeason.base_hourly_rate;
		} else {
			const anyRate = boatSeasons.find(
				(is) => is.base_hourly_rate != null && is.base_hourly_rate > 0
			);
			itemRates[item.id] = anyRate?.base_hourly_rate ?? item.hourly_rate;
		}

		// Duration resolution: season itemSeason > template > any itemSeason > item
		const nonEmpty = (arr: number[] | null | undefined) =>
			arr && arr.length > 0 ? arr : null;
		if (season) {
			itemDurations[item.id] =
				nonEmpty(season.itemSeason.available_durations) ??
				nonEmpty(season.template.available_durations) ??
				nonEmpty(item.available_durations) ??
				[];
		} else {
			// No active season — try any itemSeason, then any template, then item
			const anyWithDurations = boatSeasons.find(
				(is) => is.available_durations && is.available_durations.length > 0
			);
			if (anyWithDurations) {
				itemDurations[item.id] = anyWithDurations.available_durations!;
			} else {
				const anyTemplate = allTemplates.find(
					(t) => t.available_durations && t.available_durations.length > 0
				);
				itemDurations[item.id] =
					nonEmpty(anyTemplate?.available_durations) ??
					nonEmpty(item.available_durations) ??
					[];
			}
		}
	}

	return {
		items: items ?? [],
		orgId: org.id,
		itemRates,
		itemDurations
	};
};
