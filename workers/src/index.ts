export interface Env {
	pages: KVNamespace;
}

// (key) と (value) 以外はすべて metadata
export interface ReqBody {
	id?: string, // <PREFIX>-<UUID?> (key)
	title: string,
	type: number,
	draft: number,
	created: number, // Unixtime
	updated: number, // Unixtime
	body: string, // 本文 (value)
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { url, method } = request;
		const reqBody: ReqBody = await request.json();
		const { id, title, type, draft, created, updated, body } = reqBody;
		const kv: KVNamespace = env.pages;

		// POST 以外の場合: エラー
		if (method !== 'POST') {
			return Response.json({ error: 'invalid method.' })
		}

		// ルートから処理を判定する
		if (url.includes('/list')) {
			// アイテム一覧を取得する
			const data = await kv.list();
			return Response.json({ data });
		} else if (url.includes('/get')) {
			// アイテムを取得する
			if (!id) return Response.json({ error: 'id is required.' });
			const data = await kv.getWithMetadata(id);
			return Response.json({
				body: JSON.parse(data.value ?? ''),
				metadata: data.metadata,
			});
		} else if (url.includes('/put')) {
			// アイテムを作成する
			const key = crypto.randomUUID();
			const metadata = { title, type, draft, created, updated };
			await kv.put(key, JSON.stringify(body), { metadata });
		} else if (url.includes('/update')) {
			// アイテムを更新する
			if (!id) return Response.json({ error: 'id is required.' });
			const metadata = { title, type, draft, created, updated };
			await kv.put(id, JSON.stringify({ ...reqBody }), { metadata });
		} else if (url.includes('/delete')) {
			// アイテムを削除する
			if (!id) return Response.json({ error: 'id is required.' });
			await kv.delete(id);
		} else {
			// それ以外のルート: エラー
			return Response.json({ error: 'invalid route.' });
		}

		return Response.json({ message: 'success!'});
	},
};
