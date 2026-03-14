<script lang="ts">
	import QuoteModal from './QuoteModal.svelte';

	let scrolled = $state(false);
	let quoteOpen = $state(false);

	$effect(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 0;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav class="navbar" class:scrolled>
	<div class="utility-row">
		<div class="utility-content">
			<a href="/contact" class="utility-link search-link" aria-label="Search">
				<svg viewBox="0 0 24 24" role="presentation" focusable="false">
					<path d="M15.8 15.8l5.4 5.4m-2.9-10a7.1 7.1 0 1 1-14.2 0 7.1 7.1 0 0 1 14.2 0Z" />
				</svg>
			</a>
			<a href="/contact" class="utility-link">Contact Us</a>
			<a href="tel:+13129710971" class="utility-link">Sales: +1 (312) 971-0971</a>
			<a href="/contact" class="utility-link globe-link" aria-label="Language">
				<svg viewBox="0 0 24 24" role="presentation" focusable="false">
					<path
						d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2 2 3 5.6 3 9s-1 7-3 9m0-18c-2 2-3 5.6-3 9s1 7 3 9m-8-9h16m-14-5.5h12m-12 11h12"
					/>
				</svg>
			</a>
		</div>
	</div>
	<div class="navbar-content">
		<a href="/" class="logo" aria-label="Windy City Cruise home">
			<span class="logo-text">Windy City Cruise</span>
		</a>

		<div class="nav-links">
			<a href="/yachts" class="nav-link">Yachts</a>
			<a href="/experiences" class="nav-link">Experiences</a>
			<a href="/catering" class="nav-link">Catering</a>
			<a href="/about-us" class="nav-link">About</a>
			<a href="/faq" class="nav-link">FAQ</a>
		</div>

		<div class="buttons-container">
			<button type="button" class="action-button action-button-secondary" onclick={() => quoteOpen = true}>Request a Quote</button>
			<a href="/book" class="action-button action-button-primary">Book now</a>
		</div>
	</div>
</nav>

<QuoteModal bind:open={quoteOpen} />

<style>
	.navbar {
		--hero-accent: var(--color-frosted-blue);
		top: 0;
		left: 0;
		right: 0;
		z-index: 200; /* sticky layer token */
		background: var(--color-frosted-blue);
		border-bottom: 1px solid rgba(249, 242, 240, 0.1);
		backdrop-filter: var(--blur-glass);
		-webkit-backdrop-filter: var(--blur-glass);
		transition:
			border-color var(--motion-duration-default) var(--motion-ease-standard),
			box-shadow var(--motion-duration-default) var(--motion-ease-standard);
	}

	.navbar.scrolled {
		border-bottom-color: var(--color-border-default);
		box-shadow: var(--shadow-1);
	}

	.utility-row {
		border-bottom: 1px solid rgba(249, 242, 240, 0.1);
	}

	.utility-content {
		width: 100%;
		padding: var(--space-2) clamp(var(--space-4), 2.2vw, var(--space-8));
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: clamp(var(--space-2), 1.35vw, var(--space-5));
	}

	.utility-link {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-regular);
		line-height: 1;
		color: rgba(249, 242, 240, 0.72);
		text-decoration: none;
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.utility-link:hover {
		opacity: var(--state-hover-opacity);
		color: #f9f2f0;
	}

	.search-link,
	.globe-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.search-link svg,
	.globe-link svg {
		width: clamp(16px, 1.1vw, 19px);
		height: clamp(16px, 1.1vw, 19px);
		fill: none;
		stroke: currentColor;
		stroke-width: 1.9;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.navbar-content {
		width: 100%;
		padding: var(--space-3) clamp(var(--space-4), 2.2vw, var(--space-8));
		display: flex;
		align-items: center;
		gap: var(--space-5);
	}

	.logo {
		text-decoration: none;
		color: #f9f2f0;
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.logo:hover {
		opacity: var(--state-hover-opacity);
	}

	.logo-text {
		font-family: 'The Nautigal', cursive;
		font-size: clamp(34px, 2.8vw, 42px);
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.01em;
		color: #f9f2f0;
		white-space: nowrap;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: clamp(var(--space-3), 1.8vw, var(--space-6));
		margin-left: clamp(var(--space-4), 2.5vw, var(--space-8));
	}

	.nav-link {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		line-height: var(--line-height-default);
		color: rgba(249, 242, 240, 0.88);
		text-decoration: none;
		transition:
			color var(--motion-duration-fast) var(--motion-ease-standard),
			opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.nav-link:hover {
		color: #f9f2f0;
		text-decoration: none;
	}

	.nav-link:active {
		opacity: var(--state-pressed-opacity);
	}

	.buttons-container {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.action-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-target-min);
		padding: 0 var(--space-4);
		border-radius: var(--radius-md);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		line-height: var(--line-height-tight);
		border: 1px solid transparent;
		text-decoration: none;
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard),
			border-color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.action-button-secondary {
		color: #f9f2f0;
		background: rgba(249, 242, 240, 0.12);
		border-color: rgba(249, 242, 240, 0.28);
	}

	.action-button-primary {
		background: #f9f2f0;
		color: var(--color-frosted-blue);
	}

	.action-button:hover {
		opacity: var(--state-hover-opacity);
		text-decoration: none;
	}

	.action-button:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	.action-button:focus-visible,
	.utility-link:focus-visible,
	.nav-link:focus-visible {
		outline: var(--focus-ring-width) solid var(--focus-ring-color);
		outline-offset: var(--focus-ring-offset);
		border-radius: var(--radius-sm);
	}

	@media (max-width: 1280px) {
		.logo-text {
			letter-spacing: 0.03em;
		}
	}

	@media (max-width: 960px) {
		.utility-content {
			padding: var(--space-2) var(--space-4);
			gap: var(--space-3);
		}

		.utility-link {
			font-size: var(--font-size-xs);
		}

		.navbar-content {
			padding: var(--space-3) var(--space-4);
			flex-wrap: wrap;
			gap: var(--space-3);
		}

		.nav-links {
			display: none;
		}

		.logo-text {
			font-size: 16px;
		}

		.buttons-container {
			margin-left: auto;
		}

		.action-button {
			min-height: 38px;
			padding: 0 var(--space-4);
			font-size: var(--font-size-xs);
			border-radius: var(--radius-sm);
		}
	}

	@media (max-width: 640px) {
		.utility-content {
			justify-content: flex-start;
			overflow-x: auto;
			white-space: nowrap;
		}

		.utility-content::-webkit-scrollbar {
			display: none;
		}
	}
</style>
