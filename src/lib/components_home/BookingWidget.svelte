<script lang="ts">
	interface SearchPayload {
		date: string;
		guests: string;
		category: string;
	}

	interface Props {
		class?: string;
		onSearch?: (payload: SearchPayload) => void;
	}

	let { class: className = '', onSearch }: Props = $props();

	let activeTab = $state('yachts');
	let date = $state('');
	let guests = $state('2');
	let formError = $state('');

	function handleSearch() {
		if (!date) {
			formError = 'Select a date to continue.';
			return;
		}

		formError = '';
		onSearch?.({
			date,
			guests,
			category: activeTab
		});
	}
</script>

<div class="booking-widget {className}">
	<div class="tabs">
		<button
			class="tab"
			class:active={activeTab === 'yachts'}
			onclick={() => (activeTab = 'yachts')}
		>
			<svg
				class="tab-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path d="M3 17h18M5 17l2-9h10l2 9M7 8V6a1 1 0 011-1h8a1 1 0 011 1v2" />
			</svg>
			Bareboat Yachts
		</button>
		<button class="tab" class:active={activeTab === 'yacht'} onclick={() => (activeTab = 'yacht')}>
			<svg
				class="tab-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path d="M3 17h18M4 17l1-5h14l1 5M6 12V8l6-4 6 4v4" />
			</svg>
			Large Group Yachts
		</button>
		<button
			class="tab"
			class:active={activeTab === 'wakesurf'}
			onclick={() => (activeTab = 'wakesurf')}
		>
			<svg
				class="tab-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path
					d="M2 20c2-2 4-3 7-3s5 1 7 3M5 16c1.5-1.5 3-2 5-2s3.5.5 5 2M8 12c1-1 2-1.5 4-1.5s3 .5 4 1.5"
				/>
			</svg>
			Sailboat
		</button>
		<button class="tab" class:active={activeTab === 'club'} onclick={() => (activeTab = 'club')}>
			<svg
				class="tab-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path
					d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
				/>
			</svg>
			Boat Club
		</button>
	</div>

	<div class="form-content">
		<!-- <div class="input-group location">
			<svg
				class="input-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="M21 21l-4.35-4.35" />
			</svg>
			<div class="input-wrapper">
				<label class="input-label" for="location">Location</label>
				<input
					id="location"
					type="text"
					placeholder="Chicago, IL"
					class="input-field"
					value="Chicago, IL"
					readonly
				/>
			</div>
		</div> -->

		<div class="input-group date">
			<svg
				class="input-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<rect x="3" y="4" width="18" height="18" rx="2" />
				<path d="M16 2v4M8 2v4M3 10h18" />
			</svg>
			<div class="input-wrapper">
				<label class="input-label" for="date">Date</label>
				<input id="date" type="date" class="input-field" bind:value={date} />
			</div>
		</div>

		<div class="input-group guests">
			<svg
				class="input-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
				<circle cx="9" cy="7" r="4" />
			</svg>
			<div class="input-wrapper">
				<label class="input-label" for="guests">Guests</label>
				<select id="guests" class="input-field" bind:value={guests}>
					<option value="2">2 Guests</option>
					<option value="4">4 Guests</option>
					<option value="6">6 Guests</option>
					<option value="8">8 Guests</option>
					<option value="10">10+ Guests</option>
				</select>
			</div>
		</div>

		<button class="search-btn" type="button" onclick={handleSearch}> Find Your Boat </button>
	</div>
	{#if formError}
		<p class="form-error">{formError}</p>
	{/if}
</div>

<style>
	.booking-widget {
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.12),
			0 2px 8px rgba(0, 0, 0, 0.08);
		padding: var(--space-4);
		width: 100%;
		max-width: 720px;
	}

	.tabs {
		display: flex;
		gap: var(--space-1);
		margin-bottom: var(--space-4);
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: transparent;
		border: 2px solid transparent;
		border-radius: var(--radius-md);
		font-family: var(--font-family-system);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		cursor: pointer;
		white-space: nowrap;
		transition: all var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.tab:hover {
		color: var(--color-text-primary);
		background: var(--color-surface-elevated);
	}

	.tab.active {
		color: var(--color-primary);
		border-color: var(--color-primary);
		background: rgba(37, 99, 235, 0.05);
	}

	.tab-icon {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	.form-content {
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr auto;
		gap: var(--space-3);
		align-items: stretch;
	}

	.input-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: border-color var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.input-group:focus-within {
		border-color: var(--color-primary);
	}

	.input-icon {
		width: 20px;
		height: 20px;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.input-label {
		font-size: 11px;
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.input-field {
		font-family: var(--font-family-system);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		background: transparent;
		border: none;
		padding: 0;
		width: 100%;
		outline: none;
	}

	.input-field::placeholder {
		color: var(--color-text-tertiary);
	}

	select.input-field {
		cursor: pointer;
		appearance: none;
	}

	.search-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4) var(--space-5);
		background: var(--button-primary-bg);
		color: var(--button-primary-text);
		font-family: var(--font-family-system);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		white-space: nowrap;
		transition: all var(--motion-duration-fast) var(--motion-ease-standard);
	}

	.search-btn:hover {
		opacity: var(--state-hover-opacity);
	}

	.search-btn:active {
		transform: scale(0.98);
	}

	.form-error {
		margin: var(--space-2) 0 0;
		font-family: var(--font-family-system);
		font-size: 12px;
		font-weight: var(--font-weight-medium);
		color: #b42318;
	}

	@media (max-width: 768px) {
		.booking-widget {
			padding: var(--space-3);
		}

		.tabs {
			gap: 0;
		}

		.tab {
			padding: var(--space-2);
			font-size: 12px;
		}

		.tab-icon {
			width: 18px;
			height: 18px;
		}

		.form-content {
			grid-template-columns: 1fr;
			gap: var(--space-2);
		}

		.search-btn {
			margin-top: var(--space-2);
		}
	}
</style>
