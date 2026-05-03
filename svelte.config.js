import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Prism = require('prismjs');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-python');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-json');
require('prismjs/components/prism-yaml');
require('prismjs/components/prism-docker');
require('prismjs/components/prism-sql');
require('prismjs/components/prism-diff');
require('prismjs/components/prism-css');

function escapeHtml(str) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Escape { } only in text nodes (between HTML tags), leaving tag attributes untouched
function escapeSvelteBraces(html) {
	return html
		.split(/(<[^>]*>)/g)
		.map((chunk, i) => (i % 2 === 0 ? chunk.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;') : chunk))
		.join('');
}

function highlighter(code, rawLang, meta) {
	// Support Hugo-style fences: ```bash{filename="foo.sh",linenos=table}
	// In that case remark gives us the whole thing as `lang` with no `meta`
	let lang = rawLang;
	let extraMeta = '';
	const braceMatch = rawLang?.match(/^([^{]*)\{([^}]*)\}$/);
	if (braceMatch) {
		lang = braceMatch[1] || undefined;
		extraMeta = braceMatch[2];
	}
	const allMeta = [meta, extraMeta].filter(Boolean).join(' ');

	const grammar = lang && Prism.languages[lang];
	const highlighted = escapeSvelteBraces(
		grammar ? Prism.highlight(code, grammar, lang) : escapeHtml(code)
	);

	// Parse: title="App.svelte" | filename="App.svelte" | showLineNumbers | linenos=table
	const title = allMeta.match(/(?:title|filename)=["']([^"']+)["']/)?.[1];
	const showLineNumbers = !!allMeta.match(/\bshowLineNumbers\b|\blinenos\b/);

	const langClass = `language-${lang || 'text'}`;

	// Wrap each line in <span class="line"> when line numbers are requested
	let codeContent = highlighted;
	if (showLineNumbers) {
		const lines = highlighted.split('\n');
		if (lines.at(-1) === '') lines.pop(); // trailing newline
		codeContent = lines.map((l, i) => `<span class="line"><span class="ln">${i + 1}</span>${l}</span>`).join('');
	}

	const preCls = [langClass, showLineNumbers && 'line-numbers'].filter(Boolean).join(' ');

	// Build HTML
	const preHtml = `<pre class="${preCls}"><code class="${langClass}">${codeContent}</code></pre>`;
	const html = title
		? `<figure class="code-block"><figcaption class="code-filename">${escapeHtml(title)}</figcaption>${preHtml}</figure>`
		: preHtml;

	// JSON.stringify gives a quoted JS string literal — safe for any code content
	return `{@html ${JSON.stringify(html)}}`;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			smartypants: true,
			highlight: { highlighter },
			remarkPlugins: [remarkMath],
			rehypePlugins: [[rehypeKatex, { output: 'html' }]]
		})
	],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false
		})
	}
};

export default config;
