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
			<span class="logo-text">Chicago Boating Hub</span>
		</a>

		<div class="nav-links">
			<a href="/boats" class="nav-link">Boats</a>
			<a href="/experiences" class="nav-link">Experiences</a>
			<a href="/about" class="nav-link">About</a>
		</div>

		<a href="/book" class="book-button">Book Now</a>
	</div>
</nav>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-index-sticky);
		color: var(--color-text-primary);
		background-color: var(--color-surface-elevated);
		transition:
			background-color var(--motion-duration-normal) var(--motion-easing-default),
			box-shadow var(--motion-duration-normal) var(--motion-easing-default);
	}

	.navbar.scrolled {
		box-shadow: var(--elevation-raised);
	}

	.navbar-content {
		max-width: var(--spacing-layout-content-max-width);
		margin: 0 auto;
		padding: var(--spacing-4) var(--spacing-layout-page-margin);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-6);
	}

	.logo {
		text-decoration: none;
		color: var(--color-text-primary);
		transition: color var(--motion-duration-fast) var(--motion-easing-default);
	}

	.navbar.scrolled .logo {
		color: var(--color-text-primary);
	}

	.logo-text {
		font-size: var(--font-size-headline);
		font-weight: var(--font-weight-headline);
		line-height: var(--line-height-headline);
		letter-spacing: var(--letter-spacing-headline);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: var(--spacing-6);
	}

	.nav-link {
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-body);
		line-height: var(--line-height-body);
		letter-spacing: var(--letter-spacing-body);
		color: var(--color-text-primary);
		text-decoration: none;
		transition: color var(--motion-duration-fast) var(--motion-easing-default);
	}

	.navbar.scrolled .nav-link {
		color: var(--color-text-secondary);
	}

	.nav-link:hover {
		color: var(--color-fill-accent);
		text-decoration: none;
	}

	.book-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-component-button-padding-y) var(--spacing-component-button-padding-x);
		background-color: var(--color-interactive-primary-default);
		color: var(--color-text-inverse);
		font-size: var(--font-size-headline);
		font-weight: var(--font-weight-headline);
		line-height: var(--line-height-headline);
		letter-spacing: var(--letter-spacing-headline);
		text-decoration: none;
		border-radius: var(--radius-component-button);
		transition:
			background-color var(--motion-duration-fast) var(--motion-easing-default),
			transform var(--motion-duration-fast) var(--motion-easing-default);
	}

	.book-button:hover {
		background-color: var(--color-interactive-primary-hover);
		text-decoration: none;
	}

	.book-button:active {
		background-color: var(--color-interactive-primary-active);
		transform: scale(0.98);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.logo-text {
			font-size: var(--font-size-subheadline);
		}
	}
</style>
