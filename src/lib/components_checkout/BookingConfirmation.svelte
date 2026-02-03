<script lang="ts">
	interface BookingData {
		boatName: string;
		boatType: string;
		boatImage: string;
		date: string;
		time: string;
		duration: number;
		guests: number;
		total: number;
	}

	interface Props {
		booking: BookingData;
		confirmationNumber: string;
	}

	let { booking, confirmationNumber }: Props = $props();

	function printConfirmation() {
		window.print();
	}

	function addToCalendar() {
		const startDate = new Date(booking.date + 'T' + booking.time.split(' ')[0]);
		const endDate = new Date(startDate.getTime() + booking.duration * 60 * 60 * 1000);

		const event = {
			title: `Boat Trip: ${booking.boatName}`,
			start: startDate.toISOString().replace(/-|:|\.\d{3}/g, ''),
			end: endDate.toISOString().replace(/-|:|\.\d{3}/g, ''),
			description: `Your boat trip on ${booking.boatName}. Confirmation: ${confirmationNumber}`,
			location: 'Chicago, IL - Playpen Marina'
		};

		const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
		window.open(googleUrl, '_blank');
	}
</script>

<div class="confirmation">
	<div class="success-header">
		<div class="success-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
				<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
				<polyline points="22 4 12 14.01 9 11.01" />
			</svg>
		</div>
		<h1 class="success-title">Booking Confirmed!</h1>
		<p class="success-subtitle">
			Your boat trip is all set. Get ready for an amazing day on the water!
		</p>
	</div>

	<div class="confirmation-card">
		<div class="confirmation-number">
			<span class="label">Confirmation Number</span>
			<span class="number">{confirmationNumber}</span>
		</div>

		<div class="booking-summary">
			<div class="boat-preview">
				<img src={booking.boatImage} alt={booking.boatName} class="boat-image" />
				<div class="boat-info">
					<h3 class="boat-name">{booking.boatName}</h3>
					<p class="boat-type">{booking.boatType}</p>
				</div>
			</div>

			<div class="trip-details">
				<div class="detail-item">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
						<line x1="16" y1="2" x2="16" y2="6" />
						<line x1="8" y1="2" x2="8" y2="6" />
						<line x1="3" y1="10" x2="21" y2="10" />
					</svg>
					<div class="detail-content">
						<span class="detail-label">Date</span>
						<span class="detail-value">{booking.date}</span>
					</div>
				</div>
				<div class="detail-item">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
					<div class="detail-content">
						<span class="detail-label">Time</span>
						<span class="detail-value">{booking.time}</span>
					</div>
				</div>
				<div class="detail-item">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M23 21v-2a4 4 0 00-3-3.87" />
						<path d="M16 3.13a4 4 0 010 7.75" />
					</svg>
					<div class="detail-content">
						<span class="detail-label">Guests</span>
						<span class="detail-value">{booking.guests} passengers</span>
					</div>
				</div>
				<div class="detail-item">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="12" y1="1" x2="12" y2="23" />
						<path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
					</svg>
					<div class="detail-content">
						<span class="detail-label">Total Paid</span>
						<span class="detail-value total">${booking.total.toFixed(2)}</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="checkin-info">
		<h3 class="checkin-title">Check-in Instructions</h3>
		<ul class="checkin-list">
			<li>Arrive at Playpen Marina 15 minutes before departure</li>
			<li>Bring a valid Photo ID for the primary guest</li>
			<li>Wear comfortable clothes and bring sunscreen</li>
			<li>Your captain will meet you at the dock</li>
		</ul>
	</div>

	<div class="action-buttons">
		<button class="action-button secondary" onclick={addToCalendar}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
				<line x1="16" y1="2" x2="16" y2="6" />
				<line x1="8" y1="2" x2="8" y2="6" />
				<line x1="3" y1="10" x2="21" y2="10" />
			</svg>
			Add to Calendar
		</button>
		<button class="action-button secondary" onclick={printConfirmation}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="6 9 6 2 18 2 18 9" />
				<path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
				<rect x="6" y="14" width="12" height="8" />
			</svg>
			Print Confirmation
		</button>
	</div>

	<a href="/" class="home-link"> Return to Homepage </a>
</div>

<style>
	.confirmation {
		text-align: center;
	}

	.success-header {
		margin-bottom: var(--space-6);
	}

	.success-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		margin: 0 auto var(--space-4) auto;
		background-color: rgba(0, 119, 182, 0.1);
		border-radius: 50%;
	}

	.success-icon svg {
		width: 32px;
		height: 32px;
		color: var(--color-accent-primary);
	}

	.success-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.success-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.confirmation-card {
		background-color: var(--color-bg-elevated);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		margin-bottom: var(--space-5);
		text-align: left;
	}

	.confirmation-number {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		padding-bottom: var(--space-4);
		margin-bottom: var(--space-4);
		border-bottom: 1px solid var(--color-border-subtle);
		text-align: center;
	}

	.confirmation-number .label {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.confirmation-number .number {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-accent-primary);
		letter-spacing: 0.1em;
	}

	.boat-preview {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.boat-image {
		width: 80px;
		height: 60px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.boat-info {
		flex: 1;
	}

	.boat-name {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.boat-type {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.trip-details {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.detail-item svg {
		width: 18px;
		height: 18px;
		color: var(--color-text-tertiary);
		flex-shrink: 0;
	}

	.detail-content {
		display: flex;
		flex-direction: column;
	}

	.detail-label {
		font-family: var(--font-family-system);
		font-size: 10px;
		font-weight: var(--font-weight-medium);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
	}

	.detail-value {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.detail-value.total {
		font-weight: var(--font-weight-semibold);
		color: var(--color-accent-primary);
	}

	.checkin-info {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-4);
		margin-bottom: var(--space-5);
		text-align: left;
	}

	.checkin-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.checkin-list {
		margin: 0;
		padding-left: var(--space-5);
	}

	.checkin-list li {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin-bottom: var(--space-1);
	}

	.checkin-list li:last-child {
		margin-bottom: 0;
	}

	.action-buttons {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-5);
	}

	.action-button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		height: var(--button-height);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.action-button.secondary {
		background-color: var(--button-secondary-bg);
		color: var(--button-secondary-text);
		border: none;
	}

	.action-button.secondary:hover {
		opacity: var(--state-hover-opacity);
	}

	.action-button svg {
		width: 18px;
		height: 18px;
	}

	.home-link {
		display: inline-block;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent-primary);
		text-decoration: none;
	}

	.home-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 600px) {
		.trip-details {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			flex-direction: column;
		}
	}

	@media print {
		.action-buttons,
		.home-link {
			display: none;
		}
	}
</style>
