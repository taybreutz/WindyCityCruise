<script lang="ts">
	let openIndex = $state<number | null>(null);

	function toggle(index: number) {
		openIndex = openIndex === index ? null : index;
	}

	const faqs = [
		{
			question: 'How far in advance should I book?',
			answer:
				'We recommend booking at least 2-3 weeks in advance, especially during peak summer months (June through September). Popular dates like Fourth of July and Labor Day weekends tend to book up quickly.'
		},
		{
			question: 'What is your cancellation policy?',
			answer:
				'Cancellations made 7 or more days before your trip receive a full refund. Cancellations within 3-6 days receive a 50% refund. Unfortunately, we cannot offer refunds for cancellations made less than 48 hours before departure.'
		},
		{
			question: 'What happens if the weather is bad?',
			answer:
				'Safety is our top priority. If we cancel due to dangerous weather conditions, you will receive a full refund or the option to reschedule at no additional cost. Light rain does not typically result in cancellation.'
		},
		{
			question: 'Can I bring my own food and drinks?',
			answer:
				'Yes! We offer a BYOB option for beverages and you are welcome to bring your own snacks. We provide coolers, ice, and cups. Alternatively, check out our catering packages for a hassle-free experience.'
		},
		{
			question: 'Is there a minimum or maximum group size?',
			answer:
				'Minimum group sizes vary by vessel but typically start at 2 guests. Maximum capacity depends on the yacht selected, ranging from 20 to 60 guests. Contact us for larger groups and we can arrange multiple vessels.'
		},
		{
			question: 'Where do the cruises depart from?',
			answer:
				'Our yachts depart from DuSable Harbor and Burnham Harbor on the Chicago lakefront. Exact departure instructions and parking information are provided upon booking confirmation.'
		},
		{
			question: 'Are children allowed on board?',
			answer:
				'Absolutely! Children of all ages are welcome. We provide life jackets in all sizes and our crew ensures a safe environment. Please note that all minors must be accompanied by an adult guardian.'
		},
		{
			question: 'How long are the cruises?',
			answer:
				'Standard cruises run 2, 3, or 4 hours. We also offer custom durations for private charters. Half-day and full-day options are available for special events.'
		}
	];
</script>

<svelte:head>
	<title>FAQ - Windy City Cruise</title>
</svelte:head>

<main class="page">
	<section class="hero">
		<div class="hero-inner">
			<span class="kicker">Have Questions?</span>
			<h1 class="hero-title">Frequently Asked Questions</h1>
			<p class="hero-subtitle">
				Everything you need to know before booking your cruise on Lake Michigan.
			</p>
		</div>
	</section>

	<section class="content-section">
		<div class="content-container">
			<div class="faq-list">
				{#each faqs as faq, i}
					<div class="faq-item" class:faq-item--open={openIndex === i}>
						<button class="faq-question" onclick={() => toggle(i)}>
							<span>{faq.question}</span>
							<span class="faq-icon" class:faq-icon--open={openIndex === i}>+</span>
						</button>
						{#if openIndex === i}
							<div class="faq-answer">
								<p>{faq.answer}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="content-section content-section--alt">
		<div class="content-container content-container--narrow" style="text-align: center;">
			<h2 class="section-title">Still have questions?</h2>
			<p class="body-text">
				Our team is happy to help. Reach out and we'll get back to you within 24 hours.
			</p>
			<a href="/contact" class="contact-link">Contact Us</a>
		</div>
	</section>
</main>

<style>
	.page {
		min-height: 100vh;
		background-color: var(--color-bg-primary);
	}

	.hero {
		padding: var(--space-16, 6rem) var(--space-5) var(--space-10);
		text-align: center;
		background-color: var(--color-bg-primary);
	}

	.hero-inner {
		max-width: var(--content-narrow-width, 680px);
		margin: 0 auto;
	}

	.kicker {
		display: inline-block;
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs, 0.75rem);
		font-weight: var(--font-weight-semibold, 600);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: #014cba;
		margin-bottom: var(--space-3, 0.75rem);
	}

	.hero-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-3xl, 2.5rem);
		font-weight: var(--font-weight-bold, 700);
		line-height: var(--line-height-tight, 1.15);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4, 1rem) 0;
	}

	.hero-subtitle {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg, 1.125rem);
		font-weight: var(--font-weight-regular, 400);
		line-height: var(--line-height-relaxed, 1.6);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.content-section {
		padding: var(--space-10, 3rem) var(--space-5);
		background-color: var(--color-bg-primary);
	}

	.content-section--alt {
		background-color: var(--color-bg-secondary, #fff);
	}

	.content-container {
		max-width: var(--content-narrow-width, 680px);
		margin: 0 auto;
	}

	.content-container--narrow {
		max-width: var(--content-narrow-width, 680px);
	}

	.section-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xl, 1.5rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4, 1rem) 0;
	}

	.body-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-md, 1rem);
		line-height: var(--line-height-relaxed, 1.6);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-5, 1.25rem) 0;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.faq-item {
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}

	.faq-question {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-5, 1.25rem) 0;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		font-family: var(--font-family-system);
		font-size: var(--font-size-md, 1rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		gap: var(--space-4, 1rem);
	}

	.faq-question:hover {
		color: #014cba;
	}

	.faq-icon {
		font-size: 1.25rem;
		font-weight: 300;
		color: #014cba;
		transition: transform 200ms ease;
		flex-shrink: 0;
	}

	.faq-icon--open {
		transform: rotate(45deg);
	}

	.faq-answer {
		padding: 0 0 var(--space-5, 1.25rem) 0;
	}

	.faq-answer p {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		line-height: var(--line-height-relaxed, 1.6);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.contact-link {
		display: inline-block;
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm, 0.875rem);
		font-weight: var(--font-weight-semibold, 600);
		color: #fff;
		background-color: #014cba;
		padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
		border-radius: var(--radius-md, 8px);
		text-decoration: none;
		transition: opacity var(--motion-duration-fast, 150ms) var(--motion-ease-standard, ease);
	}

	.contact-link:hover {
		opacity: 0.85;
	}

	@media (max-width: 768px) {
		.hero {
			padding-top: var(--space-10, 3rem);
		}

		.hero-title {
			font-size: var(--font-size-xl, 1.5rem);
		}
	}
</style>
