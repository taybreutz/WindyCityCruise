<script lang="ts">
	import ProgressIndicator from '$lib/components_checkout/ProgressIndicator.svelte';
	import BookingSummary from '$lib/components_checkout/BookingSummary.svelte';
	import BoatSelector from '$lib/components_checkout/BoatSelector.svelte';
	import BoatDetails from '$lib/components_checkout/BoatDetails.svelte';
	import GuestPaymentForm from '$lib/components_checkout/GuestPaymentForm.svelte';
	import BookingConfirmation from '$lib/components_checkout/BookingConfirmation.svelte';
	import { supabase } from '$lib/supabase';
	import type { Item } from '$lib/types/database';
	import { formatTimeDisplay } from '$lib/availability';

	let { data } = $props();

	type SelectedBoat = {
		id: string;
		name: string;
		type: string;
		image: string;
		capacity: number;
		rate: number;
		tier: string;
		item: Item;
	};

	// Internal flow:
	// currentStep 1 + substep select = Step 1 (Select Experience)
	// currentStep 1 + substep review = Step 2 (Boat Details)
	// currentStep 2 and 3 map to Step 3 (Guest & Payment / Confirmation)
	let substep = $state<'select' | 'review'>('select');
	let currentStep = $state(1);
	let selectionMethod = $state<'date' | 'boat' | null>(null);

	let selectedBoat = $state<SelectedBoat | null>(null);

	let tripDate = $state('');
	let tripTime = $state('');
	let tripDuration = $state(4);
	let tripGuests = $state(8);

	// Computed booking data for components
	const bookingData = $derived(
		selectedBoat
			? {
					boatName: selectedBoat.name,
					boatType: selectedBoat.type,
					boatImage: selectedBoat.image,
					capacity: selectedBoat.capacity,
					date: formatDate(tripDate),
					time: tripTime,
					duration: tripDuration,
					guests: tripGuests,
					baseRate: selectedBoat.rate,
					captainFee: 150,
					taxRate: 0.1
				}
			: null
	);

	const totalForConfirmation = $derived(
		bookingData
			? (bookingData.baseRate * bookingData.duration + bookingData.captainFee) *
					(1 + bookingData.taxRate)
			: 0
	);

	const progressStep = $derived(currentStep === 1 ? (substep === 'review' ? 2 : 1) : 3);
	const canContinueToGuest = $derived(Boolean(selectedBoat && tripDate && tripTime));

	const confirmationNumber = $derived(
		'CHB-' + Math.random().toString(36).substring(2, 8).toUpperCase()
	);

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function handleSelectByDate(boat: SelectedBoat, date: string, time: string, duration: number) {
		selectedBoat = boat;
		tripDate = date;
		tripTime = time;
		tripDuration = duration;
		selectionMethod = 'date';
		substep = 'review';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleSelectByBoat(boat: SelectedBoat) {
		selectedBoat = boat;
		tripDate = '';
		tripTime = '';
		selectionMethod = 'boat';
		substep = 'review';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function goBackToSelect() {
		substep = 'select';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function goToStep2() {
		currentStep = 2;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function goToStep1() {
		currentStep = 1;
		substep = 'review';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function completeBooking() {
		currentStep = 3;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleAvailabilityDateChange(date: string) {
		tripDate = date;
	}

	function handleAvailabilityTimeSelect(time: string) {
		tripTime = time;
	}

	function handleAvailabilityDurationChange(duration: number) {
		tripDuration = duration;
	}
</script>

<svelte:head>
	<title>Checkout - Chicago Boating Hub</title>
</svelte:head>

<div class="checkout-page">
	<ProgressIndicator currentStep={progressStep} />

	<div class="checkout-container" class:full-width={currentStep === 1 && substep === 'select'}>
		<main class="checkout-main">
			{#if currentStep === 1}
				{#if substep === 'select'}
					<BoatSelector
						items={data.items}
						{supabase}
						orgId={data.orgId}
						selectedBoatId={selectedBoat?.id || ''}
						selectedDate={selectionMethod === 'date' ? tripDate : ''}
						onSelectByBoat={handleSelectByBoat}
						onSelectByDate={handleSelectByDate}
					/>
				{:else if substep === 'review' && bookingData && selectedBoat}
					<div class="back-nav">
						<button class="back-link" onclick={goBackToSelect}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="19" y1="12" x2="5" y2="12" />
								<polyline points="12 19 5 12 12 5" />
							</svg>
							Change Boat or Date
						</button>
					</div>
					<BoatDetails
						booking={bookingData}
						selectedDate={tripDate}
						selectedTime={tripTime}
						selectedDuration={tripDuration}
						onDateChange={handleAvailabilityDateChange}
						onTimeSelect={handleAvailabilityTimeSelect}
						onDurationChange={handleAvailabilityDurationChange}
						{supabase}
						orgId={data.orgId}
						item={selectedBoat.item}
					/>
				{/if}
			{:else if currentStep === 2}
				<GuestPaymentForm onSubmit={completeBooking} onBack={goToStep1} />
			{:else if currentStep === 3 && bookingData}
				<BookingConfirmation
					booking={{
						...bookingData,
						total: totalForConfirmation
					}}
					{confirmationNumber}
				/>
			{/if}
		</main>

		{#if currentStep !== 3 && !(currentStep === 1 && substep === 'select')}
			{#if bookingData}
				<aside class="checkout-sidebar">
					<BookingSummary
						booking={bookingData}
						showContactForm={currentStep === 1 && substep === 'review'}
						onContinue={currentStep === 1 && substep === 'review' ? goToStep2 : undefined}
						canContinue={currentStep === 1 && substep === 'review' ? canContinueToGuest : true}
					/>
				</aside>
			{/if}
		{/if}
	</div>
</div>

<style>
	.checkout-page {
		min-height: 100vh;
		background-color: var(--color-bg-primary);
	}

	.checkout-container {
		display: grid;
		grid-template-columns: 1fr 380px;
		gap: var(--space-6);
		max-width: 1100px;
		margin: 0 auto;
		padding: var(--space-6) var(--space-5);
	}

	.checkout-container.full-width {
		grid-template-columns: 1fr;
		max-width: 1100px;
	}

	.checkout-main {
		min-width: 0;
	}

	.checkout-sidebar {
		min-width: 0;
	}

	.back-nav {
		margin-bottom: var(--space-4);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.back-link:hover {
		color: var(--color-accent-primary);
	}

	.back-link svg {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 900px) {
		.checkout-container {
			grid-template-columns: 1fr;
			gap: var(--space-5);
		}

		.checkout-sidebar {
			order: -1;
		}
	}
</style>
