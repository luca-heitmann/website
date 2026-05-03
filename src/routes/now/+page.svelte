<script lang="ts">
	import Blobs from '$lib/components/Blobs.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<svelte:head>
	<title>Now — Luca Marco Heitmann</title>
	<meta name="description" content="What Luca is up to right now." />
</svelte:head>

<div class="page">
	<Blobs />
	<Nav />

	<main>
		<header class="page-header">
			<p class="eyebrow">◐ updated May 2026</p>
			<h1 class="display">Now.</h1>
		</header>

		<article class="prose now-body">
			<h2>May 2026</h2>
			<p>
				Studying Data Science at Leipzig University and working as a Research
				Assistant at Hochschule Hannover. On the side I'm training for the
				<a href="https://www.dresden-marathon.com/en/" target="_blank" rel="noopener">Dresden Half-Marathon</a>
				and getting into DJing. Otherwise you'll find me with friends in the
				park, or in the library building this website.
			</p>
			
			<hr />

			<p class="note">
				This is a <a href="https://nownownow.com/about">/now page</a>.
				The concept is from Derek Sivers.
			</p>
		</article>
	</main>
</div>

<style>
	.page { min-height: 100dvh; display: flex; flex-direction: column; position: relative; }

	main {
		flex: 1; padding: 0 3.75rem 4rem;
		position: relative; z-index: 1;
		max-width: 1200px; margin: 0 auto; width: 100%;
	}

	.page-header { padding-top: 2rem; margin-bottom: 2.5rem; }

	.eyebrow {
		font-family: "JetBrains Mono", monospace;
		font-size: 0.6875rem; letter-spacing: 0.125em; text-transform: uppercase;
		color: #7fb086; margin-bottom: 0.75rem;
	}

	.display {
		font-family: "Instrument Serif", Georgia, serif;
		font-style: italic; font-weight: 400;
		font-size: clamp(3.5rem, 8vw, 6rem);
		line-height: 0.95; letter-spacing: -0.02em; color: #e8e6dc;
	}

	.now-body { max-width: 55ch; }

	.note { font-size: 0.875rem; color: #5a6560; }
	.note :global(a) { color: #7fb086; }

	@media (max-width: 640px) { main { padding: 0 1.375rem 3rem; } }
</style>
