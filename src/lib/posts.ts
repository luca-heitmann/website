import type { Post } from './types';

/**
 * Loads all blog posts from src/posts/*.md
 * Sorted by date descending (newest first).
 * Only returns published posts in production.
 */
export async function getPosts(): Promise<Post[]> {
	// Vite glob import — picks up all .md files in src/posts/
	const modules = import.meta.glob('/src/posts/*.md', { eager: true }) as Record<
		string,
		{ metadata: Omit<Post, 'slug'> }
	>;

	const posts: Post[] = Object.entries(modules)
		.map(([path, mod]) => {
			const slug = path.replace('/src/posts/', '').replace('.md', '');
			return { slug, ...mod.metadata } as Post;
		})
		.filter((p) => p.published !== false)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return posts;
}

/** Returns the accent color for a given category */
export function categoryColor(cat: string): string {
	const map: Record<string, string> = {
		'self-hosting': '#7fb086', // sage
		'paper-notes': '#d997b6', // rose
		'study-notes': '#7ca6c4', // sky
		misc: '#e2b47a'           // ochre
	};
	return map[cat] ?? '#9aa39c';
}

/** Human-friendly formatted date: "28. Apr 2026" */
export function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString('de-DE', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

/** Short date for compact lists: "apr 28" */
export function formatDateShort(iso: string): string {
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	}).toLowerCase();
}
