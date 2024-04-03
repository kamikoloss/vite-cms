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

		// POST 限定
		if (method !== 'POST') {
			return Response.json({ error: 'invalid method.' })
		}

		// ルートから KV (pages or blog) を判定する
		let kv: KVNamespace = env.pages;
		if (url.includes('/pages')) {
			kv = env.pages;
		} else if (url.includes('/blog')) {
			kv = env.blog;
		} else {
			return Response.json({ error: 'invalid route.' })
		}

		// ルートから処理を判定する
		if (url.includes('/list')) {
			// キーの一覧を取得する
			const data = await kv.list();
			return Response.json({ data });
		} else if (url.includes('/get')) {
			// 取得する
			if (!reqBody.id) return Response.json({ error: 'id is required.' });
			const data = await kv.get(reqBody.id);
			if (!data) return Response.json({ error: 'not found.' });
			return Response.json({ data: JSON.parse(data) });
		} else if (url.includes('/put')) {
			// 作成する
			const id = crypto.randomUUID();
			await kv.put(id, JSON.stringify({ ...reqBody }));
		} else if (url.includes('/update')) {
			// 更新する
			if (!reqBody.id) return Response.json({ error: 'id is required.' });
			await kv.put(reqBody.id, JSON.stringify({ ...reqBody }));
		} else if (url.includes('/delete')) {
			// 削除する
			if (!reqBody.id) return Response.json({ error: 'id is required.' });
			await kv.delete(reqBody.id);
		} else {
			return Response.json({ error: 'invalid route.' })
		}

		return Response.json({ message: 'Success!'});
	},
};
