<script lang="ts">
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	// step 1 should be select date or boat
	// Step 2 is all of the information and attractive display
	// step 3 is payment and confirmation!

	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//

	import { page } from '$app/stores';
	import ProgressIndicator from '$lib/components_checkout/ProgressIndicator.svelte';
	import BookingSummary from '$lib/components_checkout/BookingSummary.svelte';
	import BoatSelector from '$lib/components_checkout/BoatSelector.svelte';
	import BoatDetails from '$lib/components_checkout/BoatDetails.svelte';
	import GuestPaymentForm from '$lib/components_checkout/GuestPaymentForm.svelte';
	import BookingConfirmation from '$lib/components_checkout/BookingConfirmation.svelte';

	// Step management: 1a = select boat, 1b = review details, 2 = guest/payment, 3 = confirmation
	// TEMP: Starting on 'review' with pre-selected data for team review
	let substep = $state<'select' | 'review'>('review');
	let currentStep = $state(1);

	// Booking state - TEMP: pre-populated for team review
	let selectedBoat = $state<{
		id: string;
		name: string;
		type: string;
		image: string;
		capacity: number;
		rate: number;
		tier: string;
	} | null>({
		id: '46-sea-ray',
		name: "46' Sea Ray Express",
		type: 'Premium Yacht',
		image:
			'https://chicagoboatinghub.com/cdn/shop/files/1_e454cb2e-4054-48a2-b88c-a05bfd3b530a.jpg?v=1709601158&width=3840',
		capacity: 15,
		rate: 325,
		tier: 'Premium'
	});

	let tripDate = $state('2026-02-15');
	// Default values for time, duration, guests
	let tripTime = $state('2:00 PM');
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

	const confirmationNumber = $derived(
		'CHB-' + Math.random().toString(36).substring(2, 8).toUpperCase()
	);

	// Check for URL params to pre-select boat
	const urlParams = $derived($page.url.searchParams);
	$effect(() => {
		const boatParam = urlParams.get('boat');
		if (boatParam && !selectedBoat) {
			// Pre-select from URL if provided
		}
	});

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

	function handleBoatSelected(boat: typeof selectedBoat, date: string) {
		selectedBoat = boat;
		tripDate = date;
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
</script>

<svelte:head>
	<title>Checkout - Chicago Boating Hub</title>
</svelte:head>

<div class="checkout-page">
	<ProgressIndicator {currentStep} />

	<div class="checkout-container" class:full-width={currentStep === 1 && substep === 'select'}>
		<main class="checkout-main">
			{#if currentStep === 1}
				{#if substep === 'select'}
					<BoatSelector
						selectedBoatId={selectedBoat?.id || ''}
						selectedDate={tripDate}
						onContinue={handleBoatSelected}
					/>
				{:else if substep === 'review' && bookingData}
					<div class="back-nav">
						<button class="back-link" onclick={goBackToSelect}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="19" y1="12" x2="5" y2="12" />
								<polyline points="12 19 5 12 12 5" />
							</svg>
							Change Boat or Date
						</button>
					</div>
					<BoatDetails booking={bookingData} onContinue={goToStep2} />
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
					<BookingSummary booking={bookingData} />
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
		max-width: 900px;
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
