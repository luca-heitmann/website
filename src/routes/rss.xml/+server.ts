import { getPosts } from '$lib/posts';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE_URL = 'https://luca-heitmann.de';
const SITE_TITLE = 'Luca Marco Heitmann';
const SITE_DESC = 'Notes, half-thoughts and longer reads on self-hosting, data science, and AI.';

export const GET: RequestHandler = async () => {
	const posts = await getPosts();

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/writing/${post.slug}`;
			return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.preview}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
