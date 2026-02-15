export interface Organization {
	id: string;
	name: string;
	slug: string;
	logo_url: string | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface Item {
	id: string;
	org_id: string;
	name: string;
	size: string;
	model: string;
	manufacturer: string;
	tier: string;
	description: string | null;
	image_url: string | null;
	capacity: number;
	hourly_rate: number;
	minimum_hours: number;
	is_active: boolean;
	is_archived: boolean;
	amenities: string[];
	specifications: Record<string, string>;
	quantity: number;
	unit_names?: string[];
	unit_notes?: string[];
	buffer_minutes: number;
	available_durations: number[];
	created_by: string | null;
	updated_by: string | null;
	created_at: string;
	updated_at: string;
}

export interface Booking {
	id: string;
	org_id: string;
	customer_id: string;
	item_id: string;
	status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
	trip_date: string;
	trip_time: string;
	duration_hours: number;
	guest_count: number;
	base_rate: number;
	captain_fee: number;
	tax_amount: number;
	discount_amount: number;
	total_amount: number;
	confirmation_number: string;
	special_requests: string | null;
	payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
	payment_method: string | null;
	notes: string | null;
	created_by: string | null;
	updated_by: string | null;
	created_at: string;
	updated_at: string;
}

export interface SeasonTemplate {
	id: string;
	org_id: string;
	name: string;
	start_date: string;
	end_date: string;
	operating_start_time: string;
	operating_end_time: string;
	days_of_week: number[];
	available_durations: number[];
	is_active: boolean;
	created_by: string | null;
	updated_by: string | null;
	created_at: string;
	updated_at: string;
}

export interface ItemSeason {
	id: string;
	org_id: string;
	item_id: string;
	season_template_id: string;
	base_hourly_rate: number | null;
	operating_start_time: string | null;
	operating_end_time: string | null;
	days_of_week: number[] | null;
	available_durations: number[] | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface PricingRule {
	id: string;
	org_id: string;
	season_template_id: string;
	name: string;
	start_time: string;
	end_time: string;
	rate_type: 'multiplier' | 'flat_hourly';
	rate_value: number;
	priority: number;
	created_at: string;
	updated_at: string;
}

export interface ItemDateOverride {
	id: string;
	org_id: string;
	item_id: string;
	override_date: string;
	is_available: boolean | null;
	operating_start_time: string | null;
	operating_end_time: string | null;
	buffer_minutes: number | null;
	minimum_hours: number | null;
	price_multiplier: number | null;
	price_flat_rate: number | null;
	available_durations: number[] | null;
	override_group_id: string | null;
	label: string | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export interface ItemDateOverrideSlot {
	id: string;
	item_id: string;
	override_group_id: string;
	override_date: string;
	start_time: string;
	created_at: string;
	updated_at: string;
}
