import { Context, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { AppState, oauth2Client } from '../main.ts';
import { authenticate } from '../utils/auth.ts';
import { create } from 'https://deno.land/x/djwt@v2.2/mod.ts';

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
		const { supabase } = ctx.state;
		const data = await supabase
			.from('cms_table')
			.insert([{ name, content, author }]);
		ctx.response.body = { success: data.status === 201, data: data.statusText };
	})
	.get('/read/:id', async (ctx: Context) => {
		// get params from ctx
		const id = ctx.request.url.searchParams.get('id');
		const { supabase } = ctx.state;
		const data = await supabase.from('cms_table').select('*').match({ id });
		ctx.response.body = { success: data.status === 201, data };
	})
	.get('/read', async (ctx: Context) => {
		const { supabase } = ctx.state;
		const data = await supabase.from('cms_table').select('*');
		ctx.response.body = { success: data.status === 201, data: data.data };
	})
	.put('/update/:id', async (ctx: Context) => {
		const id = ctx.params.id;
		const { name } = await ctx.request.body().value;
		console.log(id, name);
		const { supabase } = ctx.state;
		const data = await supabase
			.from('cms_table')
			.update({ name: name })
			.eq('id', id);
		// in this case 204 is indicating a success
		ctx.response.body = { success: data.status === 204, data: data.statusText };
	})
	.delete('/delete/:id', async (ctx: any) => {
		const id = ctx.params.id;
		const { supabase } = ctx.state;
		const data = await supabase.from('cms_table').delete().match({ id });
		ctx.response.body = { success: data.status === 204, data };
	})
	.get('/logout', async (ctx: Context) => {
		// Destroy the user session
		await ctx.state.session.deleteSession();
		ctx.cookies.delete('user');
		ctx.cookies.delete('session');
		ctx.response.redirect('http://localhost:5173/');
		return;
	});
