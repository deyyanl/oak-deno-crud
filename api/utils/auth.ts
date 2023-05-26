import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";

export const authenticate = async (ctx: Context, next: Function) => {
	if (!ctx.state.session.get('user')) {
		ctx.response.redirect('/login');
		return;
	}
	await next();
};
