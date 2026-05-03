export interface Post {
	slug: string;
	title: string;
	date: string;
	category: 'self-hosting' | 'paper-notes' | 'study-notes' | 'misc';
	preview: string;
	readTime: string;
	published: boolean;
}

export type Category = Post['category'] | 'all';
