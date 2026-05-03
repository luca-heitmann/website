import { getPosts } from '$lib/posts';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const posts = await getPosts();
	return { posts };
};
