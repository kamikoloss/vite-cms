import { Env, PageReqBody } from '../../interfaces';

// GET /api/pages
// アイテムのリストを取得する
export const onRequestGet: PagesFunction<Env> = async (context) => {
	const items = await context.env.KV.list();
 	return Response.json(items);
}

// POST /api/pages
// アイテムを作成する
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const reqBody: PageReqBody = await context.request.json();
  const { title, type, draft, created, updated, body } = reqBody;

  const key = crypto.randomUUID();
  const metadata = { title, type, draft, created, updated };

  await context.env.KV.put(key, body, { metadata });
  return Response.json({ id: key });
}
