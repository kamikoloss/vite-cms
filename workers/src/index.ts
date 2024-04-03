export type Env = { pages: KVNamespace; }
export type ReqType = 'list' | 'get' | 'put' | 'update' | 'delete';
export type ErrorResBody = { error: string[]; }

// (key) と (value) 以外はすべて metadata
export type ReqBody = {
	id?: string, // (key) <NAME> or <NAME>-<UUID>
	title: string,
	type: number,
	draft: number,
	created: number, // Unixtime
	updated: number, // Unixtime
	body: string, // (value) 本文
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { url, method } = request;
		const reqType = await getReqType(url);
		const reqBody: ReqBody = await request.json();
		const { id, title, type, draft, created, updated, body } = reqBody;

		// リクエストのメソッドが POST 以外の場合: エラー
		if (method !== 'POST') {
			return Response.json({ error: ['invalid method.'] });
		}
		// リクエストのルートが不正な場合: エラー
		if (!reqType) {
			return Response.json({ error: ['invalid route.'] });
		}
		// リクエストの内容がバリデーションに失敗した場合: エラー
		const errorResBody = await validateRequest(reqType, reqBody);
		if (errorResBody) {
			return Response.json(errorResBody);
		}

		const kv = env.pages;

		// ルートから処理を判定する
		if (url.includes('/list')) {
			// アイテム一覧を取得する
			const data = await kv.list();
			return Response.json({ ...data });
		} else if (url.includes('/get')) {
			// アイテムを取得する
			const data = await kv.getWithMetadata(id!);
			return Response.json({ body: data.value, metadata: data.metadata });
		} else if (url.includes('/put')) {
			// アイテムを作成する
			const key = crypto.randomUUID();
			const metadata = { title, type, draft, created, updated };
			await kv.put(key, body, { metadata });
		} else if (url.includes('/update')) {
			// アイテムを更新する
			const metadata = { title, type, draft, created, updated };
			await kv.put(id!, body, { metadata });
		} else if (url.includes('/delete')) {
			// アイテムを削除する
			await kv.delete(id!);
		}

		return Response.json({ message: 'success!'});

		// リクエストの種別を取得する
		async function getReqType(url: string): Promise<ReqType | null> {
			return url.includes('/list') ? 'list'
				: url.includes('/get') ? 'get'
				: url.includes('/put') ? 'put'
				: url.includes('/update') ? 'update'
				: url.includes('/delete') ? 'delete'
				: null;
		}

		// リクエストをバリデーションする
		async function validateRequest(reqType: ReqType, reqBody: ReqBody): Promise<ErrorResBody | null> {
			const { id, title, type, draft, created, updated, body } = reqBody;
			const messages: string[] = [];

			// (key) id
			if (!id && ['get', 'update', 'delete'].includes(reqType)) {
				messages.push('id is required.');
			}
			// (metadata) title, type, draft, created, updated
			const hasNoMetadata = (!title || !type || !draft || !created || !updated);
			if (hasNoMetadata && ['put', 'update'].includes(reqType)) {
				messages.push('metadata is required.');
			}
			// (value) body
			if (!body && ['put', 'update'].includes(reqType)) {
				messages.push('body is required.');
			}

			if (messages.length > 0) {
				return { error: messages };
			} else {
				return null;
			}
		}
	},
};
