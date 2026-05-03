<script lang="ts">
	import Blobs from '$lib/components/Blobs.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Dot from '$lib/components/Dot.svelte';
	import { categoryColor, formatDate } from '$lib/posts';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Luca Marco Heitmann</title>
	<meta name="description" content="Data Science student in Leipzig, Research Assistant at Hochschule Hannover, and a perpetual tinkerer with self-hosted things. Some half-thoughts and longer write-ups live below." />
</svelte:head>

<div class="page">
	<Blobs />
	<Nav />

	<main>
		<!-- Hero -->
		<section class="hero">
			<p class="eyebrow">◐ Data Science, Hobbies and More</p>
			<h1 class="display">
				Hi, I'm<br />
				<span class="accent-sage">Luca</span><span class="accent-ochre">.</span>
			</h1>
			<p class="intro">
				Data Science student in Leipzig, Research Assistant at Hochschule Hannover,
				perpetual tinkerer with self-hosted things. Some half-thoughts and longer
				write-ups live below.
			</p>
		</section>

		<!-- About card -->
		<section class="about-card" aria-label="Currently">
			<span class="card-label">◐ currently</span>
			<div class="about-grid">
				<p class="about-serif">
					Studying Data Science in Leipzig and working as a Research Assistant
					on sustainable mobility in Hannover.
				</p>
				<p class="about-body">
					Previously Software Architect &amp; DevOps at <strong>Körber Pharma</strong>,
					building MES software for the pharma industry. Off-hours: open-source,
					self-hosting, listening to music, drinking coffee, and training for a half-marathon.
				</p>
			</div>
			<footer class="about-links">
				<p class="link-item">
					<svg class="link-icon rose" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path d="M2.003 5.884 10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z"/>
						<path d="m18 8.118-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z"/>
					</svg>
					mail (at) luca-heitmann.de
				</p>
				<a href="https://github.com/luca-heitmann" target="_blank" rel="noopener" class="link-item">
					<svg class="link-icon sky" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
					</svg>
					github.com/luca-heitmann
				</a>
				<a href="https://www.linkedin.com/in/luca-heitmann" target="_blank" rel="noopener" class="link-item">
					<svg class="link-icon ochre" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
					</svg>
					linkedin/in/luca-heitmann
				</a>
				<a href="/now" class="link-item link-now">
					<svg class="link-icon sage" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5z" clip-rule="evenodd"/>
					</svg>
					find out more at my now page
				</a>
			</footer>
		</section>

		<!-- Recent writing -->
		<section class="writing-section">
			<div class="section-header">
				<h2 class="section-title">recent writing</h2>
				<div class="section-rule" aria-hidden="true"></div>
				<a href="/writing" class="all-posts-link">all posts →</a>
			</div>

			<ol class="post-list" aria-label="Recent posts">
				{#each data.posts as post, i}
					{@const color = categoryColor(post.category)}
					<li class="post-item">
						<div class="post-timeline">
							<Dot {color} size={12} />
							{#if i < data.posts.length - 1}
								<div class="timeline-line" aria-hidden="true"></div>
							{/if}
						</div>
						<article class="post-content">
							<div class="post-meta">
								<Dot {color} size={7} />
								<span class="post-cat" style="color: {color}">{post.category}</span>
								<span class="spacer" aria-hidden="true"></span>
								<time datetime={post.date} class="post-date">{formatDate(post.date)}</time>
								<span class="post-read">· {post.readTime}</span>
							</div>
							<h3 class="post-title">
								<a href="/writing/{post.slug}">{post.title}</a>
							</h3>
							<p class="post-preview">{post.preview}</p>
						</article>
					</li>
				{/each}
			</ol>
		</section>
	</main>

	<footer class="site-footer">
		<span>2026 · Leipzig</span>
		<span class="footer-tagline">◐ Posts are self-written - typos included 😉</span>
	</footer>
</div>

<style>
	.page {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	main {
		flex: 1;
		padding: 0 3.75rem;
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	/* Hero */
	.hero { padding-top: 2.5rem; }

	.eyebrow {
		font-family: "JetBrains Mono", monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.125em;
		text-transform: uppercase;
		color: #7fb086;
		margin-bottom: 1rem;
	}

	.display {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic;
		font-weight: 400;
		font-size: clamp(4rem, 10vw, 7.75rem);
		line-height: 0.92;
		letter-spacing: -0.02em;
		color: #e8e6dc;
		margin-bottom: 1.375rem;
	}

	.accent-sage { color: #7fb086; }
	.accent-ochre { color: #e2b47a; }

	.intro {
		font-size: 1.0625rem;
		color: #9aa39c;
		max-width: 35rem;
		line-height: 1.55;
	}

	/* About card */
	.about-card {
		margin-top: 3rem;
		padding: 1.75rem 2rem;
		border-radius: 1.5rem;
		background: rgba(127, 176, 134, 0.07);
		border: 1px solid rgba(127, 176, 134, 0.18);
		position: relative;
	}

	.card-label {
		position: absolute;
		top: -0.625rem;
		left: 1.75rem;
		padding: 0.125rem 0.625rem;
		background: #0e1518;
		color: #7fb086;
		font-family: "JetBrains Mono", monospace;
		font-size: 0.625rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.about-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		padding-top: 0.25rem;
	}

	.about-serif {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic;
		font-size: 1.375rem;
		line-height: 1.45;
		color: #e8e6dc;
	}

	.about-body {
		font-size: 0.9375rem;
		line-height: 1.65;
		color: #9aa39c;
	}
	.about-body :global(strong) { color: #e8e6dc; font-weight: 600; }

	.about-links {
		margin-top: 1.375rem;
		padding-top: 1.125rem;
		border-top: 1px dashed rgba(232, 230, 220, 0.12);
		display: flex;
		gap: 1.75rem;
		flex-wrap: wrap;
		font-family: "JetBrains Mono", monospace;
		font-size: 0.75rem;
		color: #9aa39c;
	}

	.link-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.15s;
	}
	.link-item:hover { color: #e8e6dc; }

	/* SVG icons */
	.link-icon {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}
	.link-icon.rose  { color: #d997b6; }
	.link-icon.sky   { color: #7ca6c4; }
	.link-icon.ochre { color: #e2b47a; }
	.link-icon.sage  { color: #7fb086; }

	/* "now" link sits slightly apart */
	.link-now {
		margin-left: auto;
		color: #7fb086;
		font-style: italic;
	}
	.link-now:hover { color: #e8e6dc; }

	/* Writing section */
	.writing-section { padding: 3.75rem 0 0; }

	.section-header {
		display: flex;
		align-items: center;
		gap: 1.125rem;
		margin-bottom: 1.75rem;
	}

	.section-title {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic;
		font-size: 3rem;
		font-weight: 400;
		color: #e8e6dc;
		white-space: nowrap;
		line-height: 1;
	}

	.section-rule {
		flex: 1;
		height: 1px;
		background: rgba(232, 230, 220, 0.1);
	}

	.all-posts-link {
		font-family: "JetBrains Mono", monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #7fb086;
		white-space: nowrap;
		transition: opacity 0.15s;
	}
	.all-posts-link:hover { opacity: 0.75; }

	/* Post list */
	.post-list { list-style: none; }

	.post-item {
		display: flex;
		gap: 1.5rem;
	}

	.post-timeline {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		width: 1.75rem;
		padding-top: 0.1875rem;
	}

	.timeline-line {
		flex: 1;
		width: 1px;
		background: rgba(232, 230, 220, 0.1);
		margin-top: 0.5rem;
	}

	.post-content {
		flex: 1;
		padding-bottom: 1.375rem;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		font-family: "JetBrains Mono", monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.05em;
		margin-bottom: 0.375rem;
		flex-wrap: wrap;
	}

	.post-cat {
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.spacer { flex: 1; }
	.post-date, .post-read { color: #5a6560; }

	.post-title {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic;
		font-weight: 400;
		font-size: 1.625rem;
		line-height: 1.25;
		color: #e8e6dc;
		margin-bottom: 0.375rem;
	}

	.post-title a { transition: color 0.15s; }
	.post-title a:hover { color: #7fb086; }

	.post-preview {
		font-size: 0.875rem;
		color: #9aa39c;
		line-height: 1.55;
		max-width: 45rem;
	}

	/* Footer */
	.site-footer {
		padding: 1.625rem 3.75rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: "JetBrains Mono", monospace;
		font-size: 0.6875rem;
		color: #5a6560;
		letter-spacing: 0.06em;
		position: relative;
		z-index: 1;
	}

	.footer-tagline { color: #7fb086; }

	@media (max-width: 900px) {
		.about-grid { grid-template-columns: 1fr; gap: 1rem; }
	}

	@media (max-width: 640px) {
		main { padding: 0 1.375rem; }
		.display { font-size: clamp(3.5rem, 14vw, 5rem); }
		.about-links { flex-direction: column; gap: 0.625rem; }
		.section-title { font-size: 1.75rem; }
		.section-rule { display: none; }
		.post-timeline { display: none; }
		.post-item { display: block; }
		.post-content { padding-bottom: 1rem; border-top: 1px solid rgba(232,230,220,0.08); padding-top: 1rem; }
		.spacer { display: none; }
		.post-meta { gap: 0.5rem; }
		.site-footer { padding: 1rem 1.375rem; flex-direction: column; align-items: flex-start; gap: 0.25rem; }
	}
</style>
