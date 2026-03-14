<script lang="ts">
	const currentYear = new Date().getFullYear();

	const navigation = {
		boating: [
			{ label: 'Boat Rentals', href: '/rentals' },
			{ label: 'Boat Club', href: '/boat-club' },
			{ label: 'Luxury Yachts', href: '/luxury' },
			{ label: 'Wakesurfing', href: '/wakesurfing' }
		],
		company: [
			{ label: 'About Us', href: '/about' },
			{ label: 'Contact', href: '/contact' }
		],
		shop: [
			{ label: 'All Products', href: 'https://chicagoboatinghub.com/collections/all' },
			{ label: 'Sweatshirts', href: 'https://chicagoboatinghub.com/collections/sweatshirts' },
			{ label: 'T-Shirts', href: 'https://chicagoboatinghub.com/collections/t-shirts' },
			{ label: 'Hats', href: 'https://chicagoboatinghub.com/collections/hats' }
		]
	};

	const socials = [
		{
			label: 'Instagram',
			href: 'https://www.instagram.com/chicagoboatcrew/',
			icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
		},
		{
			label: 'TikTok',
			href: 'https://www.tiktok.com/@chicagoboatcrewofficial',
			icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'
		},
		{
			label: 'YouTube',
			href: 'https://www.youtube.com/channel/UCjBW4C0qUUxCIhwktRVeFFQ',
			icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
		}
	];
</script>

<footer class="footer" itemscope itemtype="https://schema.org/LocalBusiness">
	<div class="footer-container">
		<div class="footer-grid">
			<!-- Brand Column -->
			<div class="footer-brand">
				<a href="/" class="footer-logo" itemprop="name">
					Windy City Cruise
				</a>
				<p class="footer-tagline" itemprop="description">
					Chicago's premier boat rental company offering yacht rentals, memberships, and
					unforgettable experiences on Lake Michigan.
				</p>
				<div class="footer-socials">
					{#each socials as social (social.label)}
						<a
							href={social.href}
							class="social-link"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}
						>
							<svg viewBox="0 0 24 24" class="social-icon" aria-hidden="true">
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<!-- Navigation Columns -->
			<nav class="footer-nav" aria-label="Boating services">
				<h3 class="footer-nav-title">Boating</h3>
				<ul class="footer-nav-list">
					{#each navigation.boating as link (link.href)}
						<li>
							<a href={link.href} class="footer-link">{link.label}</a>
						</li>
					{/each}
				</ul>
			</nav>

			<nav class="footer-nav" aria-label="Company information">
				<h3 class="footer-nav-title">Company</h3>
				<ul class="footer-nav-list">
					{#each navigation.company as link (link.href)}
						<li>
							<a href={link.href} class="footer-link">{link.label}</a>
						</li>
					{/each}
				</ul>
			</nav>

			<nav class="footer-nav" aria-label="Shop merchandise">
				<h3 class="footer-nav-title">Shop</h3>
				<ul class="footer-nav-list">
					{#each navigation.shop as link (link.href)}
						<li>
							<a
								href={link.href}
								class="footer-link"
								target="_blank"
								rel="noopener noreferrer"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>

		<!-- Bottom Bar -->
		<div class="footer-bottom">
			<p class="footer-copyright">
				&copy; {currentYear} Windy City Cruise. All rights reserved.
			</p>
			<address class="footer-location" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
				<span itemprop="addressLocality">Chicago</span>, <span itemprop="addressRegion">IL</span>
			</address>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--color-prussian-blue);
		color: var(--color-text-inverse);
		padding: var(--space-10) var(--space-5) var(--space-6);
	}

	.footer-container {
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: var(--space-8);
	}

	/* Brand */
	.footer-brand {
		max-width: 320px;
	}

	.footer-logo {
		display: inline-block;
		font-family: var(--font-family-system);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-inverse);
		text-decoration: none;
		margin-bottom: var(--space-3);
		transition: opacity var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.footer-logo:hover {
		opacity: var(--state-hover-opacity);
	}

	.footer-tagline {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-relaxed);
		color: rgba(255, 255, 255, 0.72);
		margin: 0 0 var(--space-5) 0;
	}

	.footer-socials {
		display: flex;
		gap: var(--space-3);
	}

	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background-color: rgba(255, 255, 255, 0.08);
		border-radius: var(--radius-sm);
		transition:
			background-color var(--motion-duration-fast) var(--motion-ease-standard),
			transform var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.social-link:hover {
		background-color: rgba(255, 255, 255, 0.16);
	}

	.social-link:active {
		transform: scale(0.95);
	}

	.social-icon {
		width: 20px;
		height: 20px;
		fill: var(--color-text-inverse);
	}

	/* Navigation */
	.footer-nav-title {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		color: rgba(255, 255, 255, 0.48);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin: 0 0 var(--space-4) 0;
	}

	.footer-nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.footer-link {
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-regular);
		color: rgba(255, 255, 255, 0.72);
		text-decoration: none;
		transition: color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.footer-link:hover {
		color: var(--color-text-inverse);
	}

	/* Bottom */
	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--space-6);
		margin-top: var(--space-8);
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.footer-copyright {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		color: rgba(255, 255, 255, 0.48);
		margin: 0;
	}

	.footer-location {
		font-family: var(--font-family-system);
		font-size: var(--font-size-xs);
		font-style: normal;
		color: rgba(255, 255, 255, 0.48);
	}

	@media (max-width: 900px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-6);
		}

		.footer-brand {
			grid-column: 1 / -1;
			max-width: none;
		}
	}

	@media (max-width: 600px) {
		.footer-grid {
			grid-template-columns: 1fr;
		}

		.footer-bottom {
			flex-direction: column;
			gap: var(--space-2);
			text-align: center;
		}
	}
</style>
