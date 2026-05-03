<!-- Site-wide navigation bar -->
<script lang="ts">
	import { page } from '$app/stores';

	let menuOpen = false;

	const navItems = [
		{ href: '/writing', label: 'writing' },
		{ href: '/now', label: 'now' },
		{ href: '/about', label: 'about' },
	];

	function isActive(href: string): boolean {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}
</script>

<nav class="nav" aria-label="Main navigation">
	<a href="/" class="wordmark">
		<span class="wordmark-name">luca</span> marco heitmann
	</a>

	<!-- Desktop links -->
	<div class="nav-links">
		{#each navItems as item}
			<a
				href={item.href}
				class="nav-link"
				class:active={isActive(item.href)}
			>
				· {item.label}
			</a>
		{/each}
	</div>

	<!-- Mobile hamburger -->
	<button
		class="hamburger"
		aria-label={menuOpen ? 'Close menu' : 'Open menu'}
		aria-expanded={menuOpen}
		on:click={() => (menuOpen = !menuOpen)}
	>
		<span class="bar"></span>
		<span class="bar mid"></span>
		<span class="bar"></span>
	</button>
</nav>

<!-- Mobile dropdown -->
{#if menuOpen}
	<div class="mobile-menu" role="menu">
		{#each navItems as item}
			<a
				href={item.href}
				class="mobile-link"
				class:active={isActive(item.href)}
				role="menuitem"
				on:click={() => (menuOpen = false)}
			>
				{item.label}
			</a>
		{/each}
	</div>
{/if}

<style>
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 3.75rem;
		font-family: "JetBrains Mono", monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.09em;
		color: #9aa39c;
		position: relative;
		z-index: 10;
	}

	.wordmark { color: #9aa39c; transition: color 0.15s; }
	.wordmark:hover { color: #e8e6dc; }
	.wordmark-name { color: #e8e6dc; }

	.nav-links { display: flex; gap: 1.5rem; }

	.nav-link { color: #9aa39c; transition: color 0.15s; }
	.nav-link:hover { color: #e8e6dc; }
	.nav-link.active { color: #7fb086; }

	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: space-between;
		width: 1.75rem;
		height: 1rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.bar {
		display: block;
		height: 1.5px;
		background: #9aa39c;
		border-radius: 1px;
		width: 100%;
	}

	.bar.mid { width: 70%; }

	.mobile-menu {
		display: none;
		flex-direction: column;
		padding: 0 1.375rem 1rem;
		position: relative;
		z-index: 10;
	}

	.mobile-link {
		padding: 0.75rem 0;
		font-family: "JetBrains Mono", monospace;
		font-size: 0.875rem;
		letter-spacing: 0.05em;
		color: #9aa39c;
		border-bottom: 1px solid rgba(232, 230, 220, 0.06);
		transition: color 0.15s;
	}
	.mobile-link:hover, .mobile-link.active { color: #7fb086; }

	@media (max-width: 640px) {
		.nav { padding: 0.875rem 1.375rem; }
		.nav-links { display: none; }
		.hamburger { display: flex; }
		.mobile-menu { display: flex; }
	}
</style>
