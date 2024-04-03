export interface Env {
	pages: KVNamespace;
	blog: KVNamespace;
}

export interface ReqBody {
	id?: string,
	title: string,
	body: string,
}

// GET|POST|PUT|DELETE /pages
// GET|POST|PUT|DELETE /blog
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { url, method } = request;
		const reqBody: ReqBody = await request.json();

		// ルートから KV (pages or blog) を判定する
		let kv: KVNamespace = env.pages;
		if (url.includes('/pages')) {
			kv = env.pages;
		} else if (url.includes('/blog')) {
			kv = env.blog;
		} else {
			return Response.json({ error: 'invalid route.' })
		}

		// メソッドに紐づく処理を行う
		if (method === 'GET') {
			if (!reqBody.id) return Response.json({ error: 'id is required.' });
			const data = kv.get(reqBody.id);
			return Response.json({ data, reqBody });
		} else if (method === 'POST') {
			const id = crypto.randomUUID();
			kv.put(id, JSON.stringify({ ...reqBody }));
		} else if (method === 'PUT') {
			if (!reqBody.id) return Response.json({ error: 'id is required.' });
			kv.put(reqBody.id, JSON.stringify({ ...reqBody }));
		} else if (method === 'DELETE') {
			if (!reqBody.id) return Response.json({ error: 'id is required.' });
			kv.delete(reqBody.id);
		} else {
			return Response.json({ error: 'invalid method.' })
		}

		return Response.json({ message: 'Success!'});
	},
};
