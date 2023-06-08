import { Post } from '../shared/api.ts';

const kv = await Deno.openKv();

export const createPost = async ({ id, name, content, author }: Post) => {
	return await kv.set(['posts', id], { name, content, author });
};

export const getPost = async (name: string) => {
	return (await kv.get(['posts', name])).value;
};

export const getPosts = async () => {
	const posts = [];
	for await (const entry of kv.list({ prefix: ['posts'] })) {
		posts.push(entry.key);
	}
	return posts;
};

export const deletePost = async (name: string) => {
	return await kv.delete(['posts', name]);
};

export const updatePost = async (
	name: string,
	content?: string,
	author?: string
) => {
	const post: any = await kv.get(['posts', name]);
	if (post) {
		post.name = name || post.name;
		post.content = content || post.content;
		post.author = author || post.author;
		return await kv.set(['posts', name], post);
	}
};
