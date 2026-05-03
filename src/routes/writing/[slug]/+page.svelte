<script lang="ts">
	import Blobs from '$lib/components/Blobs.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Dot from '$lib/components/Dot.svelte';
	import { categoryColor, formatDate } from '$lib/posts';
	import type { PageData } from './$types';

	export let data: PageData;

	$: meta = data.metadata as {
		slug: string;
		title: string;
		date: string;
		category: string;
		preview: string;
		readTime: string;
		toc?: { anchor: string; label: string }[];
	};

	$: color = categoryColor(meta.category);
	$: Component = data.component as any;
</script>

<svelte:head>
	<title>{meta.title} — Luca Marco Heitmann</title>
	<meta name="description" content={meta.preview} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.preview} />
</svelte:head>

<div class="page">
	<Blobs />
	<Nav />

	<main>
		<!-- Breadcrumb -->
		<nav class="breadcrumb" aria-label="Breadcrumb">
			<a href="/writing" class="crumb-back">← writing</a>
			<span class="crumb-sep" aria-hidden="true">/</span>
			<span class="crumb-cat">{meta.category}</span>
		</nav>

		<!-- Article header -->
		<header class="article-header">
			<div class="article-meta">
				<Dot {color} size={9} />
				<span class="meta-cat" style="color: {color}">{meta.category}</span>
				<span class="meta-sep" aria-hidden="true">·</span>
				<time datetime={meta.date}>{formatDate(meta.date)}</time>
				<span class="meta-sep" aria-hidden="true">·</span>
				<span>{meta.readTime} read</span>
			</div>
			<h1 class="article-title">{meta.title}</h1>
		</header>

		<!-- Two-column: TOC + body -->
		<div class="article-layout">
			{#if meta.toc && meta.toc.length > 0}
				<aside class="toc" aria-label="Table of contents">
					<p class="toc-label">on this page</p>
					<nav>
						{#each meta.toc as entry}
							<a href="#{entry.anchor}" class="toc-link">{entry.label}</a>
						{/each}
					</nav>
				</aside>
			{:else}
				<div class="toc-spacer" aria-hidden="true"></div>
			{/if}

			<article class="prose article-body">
				<svelte:component this={Component} />
			</article>
		</div>

		<!-- Footer: author + prev/next -->
		<footer class="article-footer">
			<div class="author-card">
				<img src="/images/avatar.webp" alt="Luca Marco Heitmann" class="author-avatar" />
				<div class="author-info">
					<span class="author-name">Luca Marco Heitmann</span>
					<span class="author-sub">Data Science · Music · Sport</span>
				</div>
			</div>

			<nav class="post-nav" aria-label="Post navigation">
				{#if data.prev}
					<a href="/writing/{data.prev.slug}" class="post-nav-link">
						<span class="nav-dir">← older</span>
						<span class="nav-title">{data.prev.title}</span>
					</a>
				{/if}
				{#if data.next}
					<a href="/writing/{data.next.slug}" class="post-nav-link">
						<span class="nav-dir">newer →</span>
						<span class="nav-title">{data.next.title}</span>
					</a>
				{/if}
			</nav>
		</footer>
	</main>
</div>

<style>
	.page { min-height: 100dvh; display: flex; flex-direction: column; position: relative; }

	main {
		flex: 1; padding: 0 3.75rem 4rem;
		position: relative; z-index: 1;
		max-width: 1200px; margin: 0 auto; width: 100%;
	}

	.breadcrumb {
		display: flex; align-items: center; gap: 0.625rem;
		font-family: "JetBrains Mono", monospace; font-size: 0.6875rem;
		letter-spacing: 0.06em; color: #5a6560; padding-top: 0.5rem;
	}
	.crumb-back { color: #7fb086; transition: opacity 0.15s; }
	.crumb-back:hover { opacity: 0.75; }
	.crumb-sep { margin: 0 0.25rem; }

	.article-header { padding-top: 2.25rem; max-width: 55rem; }

	.article-meta {
		display: flex; align-items: center; gap: 0.875rem;
		font-family: "JetBrains Mono", monospace; font-size: 0.6875rem;
		letter-spacing: 0.075em; color: #5a6560;
		margin-bottom: 1.125rem; flex-wrap: wrap;
	}
	.meta-cat { text-transform: uppercase; letter-spacing: 0.1em; }

	.article-title {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic; font-weight: 400;
		font-size: clamp(2.25rem, 5vw, 4rem);
		line-height: 1.05; letter-spacing: -0.02em; color: #e8e6dc;
	}

	.article-layout {
		display: grid; grid-template-columns: 10rem 1fr;
		gap: 2.75rem; margin-top: 2.5rem;
	}

	.toc { position: sticky; top: 2rem; align-self: start; }

	.toc-label {
		font-family: "JetBrains Mono", monospace; font-size: 0.625rem;
		letter-spacing: 0.1em; color: #7fb086; text-transform: uppercase;
		margin-bottom: 0.75rem;
	}

	.toc-link {
		display: block; font-size: 0.8125rem; line-height: 1.9;
		color: #9aa39c; transition: color 0.15s;
	}
	.toc-link::before { content: '· '; }
	.toc-link:hover { color: #e8e6dc; }

	.article-body { max-width: 72ch; min-width: 0; }

	.article-footer {
		margin-top: 4rem;
		background: rgba(127, 176, 134, 0.04);
		border-top: 1px solid rgba(127, 176, 134, 0.18);
		border-radius: 0 0 1rem 1rem;
		padding: 1.25rem 2rem;
		display: grid; grid-template-columns: 1fr 1fr;
		gap: 1.5rem; align-items: center;
	}

	.author-card { display: flex; align-items: center; gap: 0.875rem; }

	.author-avatar {
		width: 2.75rem; height: 2.75rem; border-radius: 50%;
		object-fit: cover; flex-shrink: 0;
	}

	.author-info { display: flex; flex-direction: column; gap: 0.125rem; }

	.author-name {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic; font-size: 1.125rem; color: #e8e6dc;
	}

	.author-sub {
		font-family: "JetBrains Mono", monospace; font-size: 0.6875rem;
		color: #5a6560; letter-spacing: 0.06em;
	}

	.post-nav { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }

	.post-nav-link {
		display: flex; flex-direction: column; align-items: flex-end;
		gap: 0.125rem; transition: opacity 0.15s;
	}
	.post-nav-link:hover { opacity: 0.75; }

	.nav-dir {
		font-family: "JetBrains Mono", monospace; font-size: 0.625rem;
		letter-spacing: 0.1em; text-transform: uppercase; color: #5a6560;
	}

	.nav-title {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic; font-size: 1.125rem; color: #e8e6dc; text-align: right;
	}

	@media (max-width: 900px) {
		.article-layout { grid-template-columns: 1fr; }
		.toc, .toc-spacer { display: none; }
		.article-footer { grid-template-columns: 1fr; }
		.post-nav { align-items: flex-start; }
		.post-nav-link { align-items: flex-start; }
		.nav-title { text-align: left; }
	}

	@media (max-width: 640px) {
		main { padding: 0 1.375rem 3rem; }
		.article-footer { padding: 1rem; }
	}
</style>
