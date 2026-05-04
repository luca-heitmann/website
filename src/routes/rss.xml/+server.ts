import { getPosts } from '$lib/posts';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE_URL = 'https://luca-heitmann.de';
const SITE_TITLE = 'Luca Marco Heitmann';
const SITE_DESC = 'Notes, half-thoughts and longer reads on self-hosting, data science, and AI.';

type MdsvexModule = {
	metadata: Record<string, unknown>;
	default: { render: () => { html: string } };
};

/**
 * Strip Prism/line-number markup from rendered post HTML so code blocks display
 * cleanly in RSS readers (which have no access to the site's CSS).
 *
 * The custom highlighter in svelte.config.js wraps each line as:
 *   <span class="line"><span class="ln">N</span>…prism tokens…</span>
 * and wraps the whole block in <pre class="… line-numbers">.
 *
 * Here we:
 *  1. Detect line-numbered <code> blocks and reconstruct them as plain newline-
 *     separated text (one line per <span class="line">).
 *  2. Strip all remaining <span> tags (Prism token colours – useless without CSS).
 *  3. Remove the now-redundant "line-numbers" class from <pre>.
 */
function cleanCodeForRss(html: string): string {
	return html
		.replace(/(<code[^>]*>)([\s\S]*?)(<\/code>)/g, (_, open, content, close) => {
			let text = content;

			if (text.includes('<span class="line">')) {
				// Rebuild as plain lines: split on opening .line span, strip the
				// line-number span and the trailing .line closing tag, rejoin with \n.
				text = text
					.split('<span class="line">')
					.filter(Boolean)
					.map((chunk) =>
						chunk
							.replace(/^<span class="ln">\d+<\/span>/, '') // line number
							.replace(/<\/span>\s*$/, '') // .line closing tag
					)
					.join('\n');
			}

			// Strip all remaining <span> tags (Prism syntax tokens)
			text = text.replace(/<\/?span[^>]*>/g, '');

			return open + text + close;
		})
		.replace(/(<pre\b[^>]*?)\s*\bline-numbers\b/g, '$1');
}

export const GET: RequestHandler = async () => {
	const posts = await getPosts();

	// Load all post modules so we can render each one to HTML
	const modules = import.meta.glob('/src/posts/*.md', { eager: true }) as Record<
		string,
		MdsvexModule
	>;

	const htmlBySlug = Object.fromEntries(
		Object.entries(modules).map(([path, mod]) => {
			const slug = path.replace('/src/posts/', '').replace('.md', '');
			const { html } = mod.default.render();
			return [slug, cleanCodeForRss(html)];
		})
	);

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/writing/${post.slug}`;
			const fullHtml = htmlBySlug[post.slug] ?? '';
			return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.preview}]]></description>
      <content:encoded><![CDATA[${fullHtml}]]></content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
