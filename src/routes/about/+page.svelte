<script lang="ts">
	import Blobs from '$lib/components/Blobs.svelte';
	import Nav from '$lib/components/Nav.svelte';

	const email = ["mail", "(at)", "luca-heitmann", ".", "de"].join("");
</script>

<svelte:head>
	<title>About — Luca Marco Heitmann</title>
	<meta name="description" content="Originally from Hamburg. M.Sc. Data Science student at Leipzig University, Research Assistant at Hochschule Hannover." />
</svelte:head>

<div class="page">
	<Blobs />
	<Nav />

	<main>
		<header class="page-header">
			<p class="eyebrow">◐ about</p>
			<h1 class="display">Luca Marco<br />Heitmann.</h1>
		</header>

		<div class="about-layout">
			<img
				src="/images/about.webp"
				alt="Luca Marco Heitmann"
				class="about-photo"
				width="640"
				height="549"
			/>

		<article class="prose about-body">
			<p>
				I'm originally from Hamburg, with interests in Data Science,
				self-hosting, music and sport.
			</p>
			<p>
				I'm currently studying for an M.Sc. in Data Science at
				<strong>Leipzig University</strong> and working as a Research
				Assistant at <strong>Hochschule Hannover</strong>. My full CV is
				on <a href="https://linkedin.com/in/luca-heitmann" target="_blank" rel="noopener">LinkedIn</a>.
			</p>
			<p>
				What I'm up to besides work, you'll find on my
				<a href="/now">now page</a>.
			</p>

			<h2>Contact</h2>
			<ul>
				<li>
					<strong>Email:</strong>
					<p>mail (at) luca-heitmann.de</p>
				</li>
				<li>
					<strong>GitHub:</strong>
					<a href="https://github.com/luca-heitmann" target="_blank" rel="noopener">github.com/luca-heitmann</a>
				</li>
				<li>
					<strong>LinkedIn:</strong>
					<a href="https://linkedin.com/in/luca-heitmann" target="_blank" rel="noopener">linkedin.com/in/luca-heitmann</a>
				</li>
			</ul>
		</article>
		</div>
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
		font-size: clamp(3rem, 7vw, 5.5rem);
		line-height: 0.95; letter-spacing: -0.02em; color: #e8e6dc;
	}

	.about-layout {
		display: flex;
		gap: 3rem;
		align-items: flex-start;
	}

	.about-photo {
		width: 18rem;
		height: auto;
		border-radius: 1rem;
		flex-shrink: 0;
		object-fit: cover;
	}

	.about-body { max-width: 60ch; }

	@media (max-width: 900px) {
		.about-layout { flex-direction: column; gap: 2rem; }
		.about-photo { width: 100%; max-width: 24rem; }
	}

	@media (max-width: 640px) {
		main { padding: 0 1.375rem 3rem; }
		.about-photo { max-width: 100%; border-radius: 0.75rem; }
	}
</style>
