<script lang="ts">
	import Blobs from '$lib/components/Blobs.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Dot from '$lib/components/Dot.svelte';
	import { categoryColor, formatDate } from '$lib/posts';
	import type { PageData } from './$types';
	import type { Category } from '$lib/types';

	export let data: PageData;

	let activeFilter: Category = 'all';
	let searchQuery = '';

	const categories: { id: Category; label: string }[] = [
		{ id: 'all', label: 'all' },
		{ id: 'self-hosting', label: 'self-hosting' },
		{ id: 'paper-notes', label: 'paper-notes' },
		{ id: 'study-notes', label: 'study-notes' },
		{ id: 'misc', label: 'misc' }
	];

	$: filteredPosts = data.posts.filter((p) => {
		const matchCat = activeFilter === 'all' || p.category === activeFilter;
		const q = searchQuery.toLowerCase();
		const matchSearch =
			!q ||
			p.title.toLowerCase().includes(q) ||
			p.preview.toLowerCase().includes(q) ||
			p.category.toLowerCase().includes(q);
		return matchCat && matchSearch;
	});

	function countForCat(cat: Category): number {
		if (cat === 'all') return data.posts.length;
		return data.posts.filter((p) => p.category === cat).length;
	}
</script>

<svelte:head>
	<title>Writing — Luca Marco Heitmann</title>
	<meta name="description" content="Notes, half-thoughts and longer reads by Luca Marco Heitmann. Self-hosting, AI papers, data science, and more." />
</svelte:head>

<div class="page">
	<Blobs />
	<Nav />

	<main>
		<header class="page-header">
			<p class="eyebrow">◐ writing — {data.posts.length} entries</p>
			<h1 class="display">
				Notes, half-thoughts<br />
				&amp; <span class="accent-sage">longer reads</span><span class="accent-ochre">.</span>
			</h1>
			<p class="subtitle">
				Some posts are drafts, others are settled.
				Filter by topic or just scroll.
			</p>
		</header>

		<!-- Filters + Search -->
		<div class="controls">
			<div class="filters" role="group" aria-label="Filter by category">
				{#each categories as cat}
					{@const color = cat.id === 'all' ? '#e8e6dc' : categoryColor(cat.id)}
					{@const count = countForCat(cat.id)}
					<button
						class="filter-chip"
						class:active={activeFilter === cat.id}
						on:click={() => (activeFilter = cat.id)}
						aria-pressed={activeFilter === cat.id}
					>
						<Dot {color} size={7} />
						{cat.label}
						<span class="chip-count">· {count}</span>
					</button>
				{/each}
			</div>

			<div class="search-wrap">
				<span class="search-icon" aria-hidden="true">⌕</span>
				<input
					type="search"
					class="search-input"
					placeholder="search the archive…"
					bind:value={searchQuery}
					aria-label="Search posts"
				/>
			</div>
		</div>

		<!-- Post list -->
		{#if filteredPosts.length > 0}
			<ol class="post-list" aria-label="Blog posts">
				{#each filteredPosts as post}
					{@const color = categoryColor(post.category)}
					<li class="post-row">
						<span class="post-num">№ {String(filteredPosts.indexOf(post) + 1).padStart(3, '0')}</span>
						<span class="post-cat" style="color: {color}">
							<Dot {color} size={6} />
							{post.category}
						</span>
						<div class="post-main">
							<h2 class="post-title">
								<a href="/writing/{post.slug}">{post.title}</a>
							</h2>
							<p class="post-preview">{post.preview}</p>
						</div>
						<time datetime={post.date} class="post-date">{formatDate(post.date)}</time>
						<span class="post-read">{post.readTime}</span>
					</li>
				{/each}
			</ol>
			<div class="list-end" aria-hidden="true"></div>
		{:else}
			<p class="no-results">Nothing found for "<em>{searchQuery}</em>".</p>
		{/if}

		<div class="archive-footer">
			<span class="archive-note">↳ all posts, newest first</span>
			<a href="/rss.xml" class="rss-link">rss · atom →</a>
		</div>
	</main>

	<footer class="site-footer">
		<span>2026 · Leipzig</span>
	</footer>
</div>

<style>
	.page { min-height: 100dvh; display: flex; flex-direction: column; position: relative; }

	main {
		flex: 1; padding: 0 3.75rem; position: relative; z-index: 1;
		max-width: 1200px; margin: 0 auto; width: 100%;
	}

	.page-header { padding-top: 2rem; }

	.eyebrow {
		font-family: "JetBrains Mono", monospace;
		font-size: 0.6875rem; letter-spacing: 0.125em; text-transform: uppercase;
		color: #7fb086; margin-bottom: 0.75rem;
	}

	.display {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic; font-weight: 400;
		font-size: clamp(3rem, 7vw, 6rem);
		line-height: 0.95; letter-spacing: -0.02em; color: #e8e6dc; margin-bottom: 1.125rem;
	}

	.accent-sage { color: #7fb086; }
	.accent-ochre { color: #e2b47a; }

	.subtitle { font-size: 1rem; color: #9aa39c; max-width: 35rem; line-height: 1.55; }

	/* Controls */
	.controls { margin-top: 2.25rem; display: flex; gap: 0.875rem; align-items: center; flex-wrap: wrap; }

	.filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }

	.filter-chip {
		display: flex; align-items: center; gap: 0.5rem;
		padding: 0.4375rem 0.875rem; border-radius: 999px;
		background: transparent; border: 1px solid rgba(232, 230, 220, 0.1);
		font-family: "JetBrains Mono", monospace; font-size: 0.71875rem;
		color: #9aa39c; cursor: pointer; transition: background 0.15s, border-color 0.15s, color 0.15s;
		letter-spacing: 0.03em;
	}
	.filter-chip:hover { background: rgba(232, 230, 220, 0.05); color: #e8e6dc; }
	.filter-chip.active { background: rgba(232, 230, 220, 0.08); border-color: rgba(232, 230, 220, 0.25); color: #e8e6dc; }
	.chip-count { color: #5a6560; }

	.search-wrap {
		margin-left: auto; display: flex; align-items: center; gap: 0.5rem;
		padding: 0.4375rem 0.875rem; border-radius: 999px;
		border: 1px solid rgba(232, 230, 220, 0.1);
		font-family: "JetBrains Mono", monospace; font-size: 0.71875rem;
		color: #5a6560; background: transparent; transition: border-color 0.15s;
	}
	.search-wrap:focus-within { border-color: rgba(127, 176, 134, 0.4); }

	.search-input {
		background: none; border: none; outline: none;
		color: #9aa39c; font-family: inherit; font-size: inherit; width: 14rem;
	}
	.search-input::placeholder { color: #5a6560; }

	/* Post list */
	.post-list { list-style: none; margin-top: 2.25rem; }

	.post-row {
		display: grid;
		grid-template-columns: 3.75rem 9rem 1fr 7.5rem 4.5rem;
		gap: 1.25rem; align-items: baseline;
		padding: 1.25rem 0;
		border-top: 1px solid rgba(232, 230, 220, 0.08);
		border-radius: 0;
		transition: background 0.12s, padding 0.12s, border-radius 0.12s;
	}
	.post-row:hover {
		background: rgba(232, 230, 220, 0.02);
		padding-left: 1rem; padding-right: 1rem; margin: 0 -1rem;
		border-radius: 8px;
	}

	.post-num { font-family: "JetBrains Mono", monospace; font-size: 0.6875rem; color: #5a6560; }

	.post-cat {
		display: flex; align-items: center; gap: 0.375rem;
		font-family: "JetBrains Mono", monospace; font-size: 0.6875rem;
		letter-spacing: 0.06em; text-transform: uppercase;
	}

	.post-title {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic; font-weight: 400; font-size: 1.5rem;
		line-height: 1.25; color: #e8e6dc; margin-bottom: 0.25rem;
	}
	.post-title a { transition: color 0.15s; }
	.post-title a:hover { color: #7fb086; }

	.post-preview { font-size: 0.84375rem; color: #9aa39c; line-height: 1.5; }

	.post-date, .post-read {
		font-family: "JetBrains Mono", monospace; font-size: 0.6875rem;
		color: #5a6560; text-align: right;
	}

	.list-end { border-top: 1px solid rgba(232, 230, 220, 0.08); }

	.no-results {
		padding: 3rem 0; font-family: "Instrument Serif", Georgia, serif;
		font-style: italic; font-size: 1.25rem; color: #9aa39c; text-align: center;
	}

	.archive-footer {
		margin-top: 2.25rem; display: flex; justify-content: space-between; align-items: center;
		font-family: "JetBrains Mono", monospace; font-size: 0.6875rem;
		color: #5a6560; letter-spacing: 0.06em;
	}

	.rss-link { color: #7fb086; transition: opacity 0.15s; letter-spacing: 0.1em; text-transform: uppercase; }
	.rss-link:hover { opacity: 0.75; }

	.site-footer {
		padding: 1.625rem 3.75rem;
		display: flex; justify-content: space-between;
		font-family: "JetBrains Mono", monospace; font-size: 0.6875rem;
		color: #5a6560; letter-spacing: 0.06em;
		position: relative; z-index: 1;
	}

	@media (max-width: 900px) {
		.post-row { grid-template-columns: 3.25rem 1fr; grid-template-rows: auto auto; }
		.post-num { grid-row: 1; }
		.post-cat { grid-row: 1; }
		.post-main { grid-column: 1 / -1; grid-row: 2; }
		.post-date, .post-read { display: none; }
	}

	@media (max-width: 640px) {
		main { padding: 0 1.375rem; }
		.controls { flex-direction: column; align-items: flex-start; }
		.search-wrap { margin-left: 0; width: 100%; }
		.search-input { width: 100%; }
		.filters { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 0.25rem; width: 100%; }
		.filter-chip { flex-shrink: 0; }
		.post-row { display: block; padding: 1rem 0; }
		.site-footer { padding: 1rem 1.375rem; }
	}
</style>
