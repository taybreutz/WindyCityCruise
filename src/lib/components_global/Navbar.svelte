<script lang="ts">
	let scrolled = $state(false);

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
			<a href="/contact" class="utility-link">Support</a>
			<a href="/contact" class="utility-link">Sales: +1 (312) 555-BOAT</a>
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
			<svg class="logo-mark" viewBox="0 0 120 60" role="presentation" focusable="false">
				<rect x="4" y="8" width="112" height="44" rx="12" class="flag-base" />
				<rect x="4" y="18" width="112" height="7" class="flag-stripe" />
				<rect x="4" y="35" width="112" height="7" class="flag-stripe" />

				<path
					class="anchor-shape"
					d="M60 13a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-2 12h4v14.8c0 2.9 2.4 5.2 5.3 5.2h4.5c-1.2 5.7-6.3 9.5-11.8 9.5S49.4 50.7 48.2 45h4.5c2.9 0 5.3-2.3 5.3-5.2V25Zm-10 9.8v4.2c0 1.8-1.4 3.2-3.2 3.2H38v-4h6V34.8h4Zm24 0v3.4h6v4h-6.8c-1.8 0-3.2-1.4-3.2-3.2v-4.2h4Z"
				/>

				<g class="star-group">
					<path
						d="M25 29.8l1.2 2.5 2.8.2-2.1 1.8.7 2.7-2.6-1.4-2.3 1.4.6-2.8-2-1.7 2.7-.2 1-2.5Z"
					/>
					<path
						d="M43 29.8l1.1 2.5 2.8.2-2.1 1.8.8 2.7-2.6-1.4-2.3 1.4.6-2.8-2-1.7 2.7-.2 1-2.5Z"
					/>
					<path
						d="M77 29.8l1.1 2.5 2.8.2-2.1 1.8.8 2.7-2.6-1.4-2.3 1.4.6-2.8-2-1.7 2.7-.2 1-2.5Z"
					/>
					<path
						d="M95 29.8l1.1 2.5 2.8.2-2.1 1.8.8 2.7-2.6-1.4-2.3 1.4.6-2.8-2-1.7 2.7-.2 1-2.5Z"
					/>
				</g>
			</svg>
			<span class="logo-text">Windy City Cruise</span>
		</a>

		<div class="nav-links">
			<a href="/rentals" class="nav-link">Rentals</a>
			<a href="/boat-club" class="nav-link">Boat Club</a>
			<a href="/luxury" class="nav-link">Luxury</a>
			<a href="/wakesurfing" class="nav-link">Experiences</a>
			<a href="/about" class="nav-link">Company</a>
		</div>

		<div class="buttons-container">
			<a href="/contact" class="action-button action-button-secondary">Contact Us</a>
			<a href="/book" class="action-button action-button-primary">Book now</a>
		</div>
	</div>
</nav>

<style>
	.navbar {
		--hero-accent: var(--color-frosted-blue);
		top: 0;
		left: 0;
		right: 0;
		z-index: 200; /* sticky layer token */
		background: var(--nav-bg);
		border-bottom: 1px solid var(--nav-border);
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
		border-bottom: 1px solid var(--divider-color);
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
		color: var(--color-text-secondary);
		text-decoration: none;
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.utility-link:hover {
		opacity: var(--state-hover-opacity);
		color: var(--color-text-primary);
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
		color: var(--color-text-primary);
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.logo:hover {
		opacity: var(--state-hover-opacity);
	}

	.logo-mark {
		width: 62px;
		height: 31px;
	}

	.flag-base {
		fill: #ffffff;
		stroke: var(--color-border-default);
		stroke-width: 1;
	}

	.flag-stripe {
		fill: var(--color-frosted-blue);
	}

	.anchor-shape {
		fill: var(--color-prussian-blue);
	}

	.star-group {
		fill: #d94747;
	}

	.logo-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: 900;
		line-height: var(--line-height-tight);
		letter-spacing: 0.04em;
		color: var(--color-text-primary);
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
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-default);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition:
			color var(--motion-duration-fast) var(--motion-ease-standard),
			opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.nav-link:hover {
		color: var(--color-text-primary);
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
		color: var(--color-text-primary);
		background: var(--color-surface);
		border-color: var(--color-border-strong);
	}

	.action-button-primary {
		background: var(--hero-accent);
		color: var(--color-text-primary);
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

		.logo-mark {
			width: 44px;
			height: 22px;
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
