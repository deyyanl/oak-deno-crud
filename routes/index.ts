import { Context, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { AppState, oauth2Client } from '../main.ts';
import { createPost, deletePost, getPost, getPosts, updatePost } from '../services/db.ts';

export const router = new Router<AppState>();

router
	.get('/', (ctx: Context) => {
		ctx.response.body = `Hello, world!`;
	})
	.get('/login', async (ctx: Context) => {
		// Construct the URL for the authorization redirect and get a PKCE codeVerifier
		const { uri, codeVerifier } = await oauth2Client.code.getAuthorizationUri();

		// Store both the state and codeVerifier in the user session
		ctx.state.session.flash('codeVerifier', codeVerifier);

		// Redirect the user to the authorization endpoint
		ctx.response.redirect(uri);
	})
	.get('/oauth2/callback', async (ctx: Context) => {
		// Make sure the codeVerifier is present for the user's session
		const codeVerifier = ctx.state.session.get('codeVerifier');
		if (typeof codeVerifier !== 'string') {
			throw new Error('invalid codeVerifier');
		}

		// Exchange the authorization code for an access token
		const tokens = await oauth2Client.code.getToken(ctx.request.url, {
			codeVerifier,
		});

		// Use the access token to make an authenticated API request
		const userResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const { login } = await userResponse.json();
		const jwt = await create(
			{
				alg: 'HS512',
				typ: 'JWT',
			},
			{
				user: login,
				token: tokens.accessToken,
			},
			'secret'
		);
		ctx.response.redirect(`http://localhost:5173?code=${jwt}`);
	})
	.post('/create', async (ctx: Context) => {
		const { name, content, author } = await ctx.request.body().value;
		const post = await createPost({ name, content, author });
		ctx.response.body = { success: post.ok };
	})
	.get('/read/:name', async (ctx: Context) => {
		// get params from ctx
		const name = ctx.params.name;
		const post = await getPost(name);
		ctx.response.body = { success: !!post, data: post };
	})
	.get('/read', async (ctx: Context) => {
		const posts = await getPosts();
		ctx.response.body = { success: !!posts, data: posts };
	})
	.put('/update/:name', async (ctx: Context) => {
		const name = ctx.params.name;
		const { content, author } = await ctx.request.body().value;
		const post = await updatePost(name, content, author);
		ctx.response.body = { success: post?.ok || false };
	})
	.delete('/delete/:name', async (ctx: any) => {
		const name = ctx.params.name;
		const post = await deletePost(name);
		ctx.response.body = { success: post };
	})
	.get('/logout', async (ctx: Context) => {
		// Destroy the user session
		await ctx.state.session.deleteSession();
		ctx.cookies.delete('user');
		ctx.cookies.delete('session');
		ctx.response.redirect('http://localhost:5173/');
		return;
	});
