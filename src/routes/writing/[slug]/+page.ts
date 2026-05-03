import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const { slug } = params;

	// Vite glob import — runs at build time and in the browser
	const modules = import.meta.glob('/src/posts/*.md') as Record<
		string,
		() => Promise<{ default: unknown; metadata: Record<string, unknown> }>
	>;

	const key = `/src/posts/${slug}.md`;
	if (!modules[key]) throw error(404, `Post "${slug}" not found`);

	const mod = await modules[key]();
	const { default: component, metadata } = mod;

	// Prev/next navigation
	const allPosts = await getPosts();
	const idx = allPosts.findIndex((p) => p.slug === slug);
	const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null;
	const next = idx > 0 ? allPosts[idx - 1] : null;

	return {
		component,
		metadata: { slug, ...metadata },
		prev,
		next
	};
};
