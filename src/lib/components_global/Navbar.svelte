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
	<div class="navbar-content">
		<a href="/" class="logo">
			<span class="logo-text">CHICAGO BOATING HUB</span>
		</a>

		<div class="nav-links">
			<a href="/rentals" class="nav-link">Rentals</a>
			<a href="/boat-club" class="nav-link">Boat Club</a>
			<a href="/luxury" class="nav-link">Luxury</a>
			<a href="/about" class="nav-link">About</a>
		</div>

		<div class="buttons-container">
			<a href="/rentals" class="book-button">Contact Sales</a>
			<a href="/rentals" class="book-button">Book Now</a>
		</div>
	</div>
</nav>

<style>
	.navbar {
		margin-top: 1rem;
		top: 0;
		left: 0;
		right: 0;
		z-index: 200;
		height: var(--nav-height);
		backdrop-filter: var(--blur-glass);
		-webkit-backdrop-filter: var(--blur-glass);
		border-bottom: 1px solid var(--nav-border);
		transition:
			border-color var(--motion-duration-default) var(--motion-ease-standard),
			box-shadow var(--motion-duration-default) var(--motion-ease-standard);
	}

	.navbar.scrolled {
		border-bottom-color: var(--nav-border);
		box-shadow: var(--shadow-1);
	}

	.navbar-content {
		max-width: var(--content-max-width);
		height: 100%;
		margin: 0 auto;
		padding: var(--space-3) var(--space-5);
		display: flex;
		align-items: center;
		gap: var(--space-6);
	}

	.logo {
		text-decoration: none;
		color: var(--color-text-primary);
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.logo:hover {
		opacity: var(--state-hover-opacity);
	}

	.logo-text {
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: 900;
		line-height: var(--line-height-tight);
		color: #f8c61e;
		text-shadow: 1px 1px 0px #252c37;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: var(--space-6);
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

	.book-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: var(--button-height);
		padding: 0 var(--button-padding-x);
		background-color: var(--button-primary-bg);
		color: var(--button-primary-text);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		line-height: var(--line-height-tight);
		text-decoration: none;
		border-radius: var(--radius-sm);
		transition:
			opacity var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.book-button:hover {
		opacity: var(--state-hover-opacity);
		text-decoration: none;
	}

	.book-button:active {
		opacity: var(--state-pressed-opacity);
		transform: scale(0.98);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.logo-text {
			font-size: var(--font-size-sm);
		}
	}
</style>
