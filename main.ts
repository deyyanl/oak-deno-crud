import { Application } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import {
	MemoryStore,
	Session,
} from 'https://deno.land/x/oak_sessions@v4.0.5/mod.ts';
import { OAuth2Client } from 'https://deno.land/x/oauth2_client/mod.ts';

import { createPost, getPosts } from './services/db.ts';

import { router } from './routes/index.ts';
import { load } from 'https://deno.land/std@0.177.1/dotenv/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
const env = await load({
	envPath: '/Users/deyyanl/Projects/oak/oak-deno-crud/.env',
});

export const oauth2Client = new OAuth2Client({
	clientId: env['CLIENT_ID'],
	clientSecret: env['CLIENT_SECRET'],
	authorizationEndpointUri: 'https://github.com/login/oauth/authorize',
	tokenUri: 'https://github.com/login/oauth/access_token',
	redirectUri: 'http://localhost:8000/oauth2/callback',
	defaults: {
		scope: 'read:user',
	},
});

export type AppState = {
	session: Session;
};
const app = new Application<AppState>();
const sessionStore = new MemoryStore();
app.keys = ['super-secret-key'];
app.use(oakCors({}));
app.use(
	Session.initMiddleware(sessionStore, {
		cookieSetOptions: {
			httpOnly: true,
			sameSite: 'lax',
			// Enable for when running outside of localhost
			// secure: true,
			signed: true,
		},
		cookieGetOptions: {
			signed: true,
		},
		expireAfterSeconds: 60 * 10,
	})
);

app.use(router.allowedMethods(), router.routes());

await app.listen({ port: 8000 });
// console.log(await createPost({ name: 'asdsad', content: 'asdasd', author: 'asdsd' }));
// console.log(await getPosts());