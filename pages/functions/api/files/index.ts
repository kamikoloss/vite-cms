import { Env } from '../../interfaces';

// GET 
// ファイルのリストを取得する
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const items = await context.env.R2.list();
  return Response.json(items);
}

// POST /api/files
// ファイルをアップロードする
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const key = crypto.randomUUID();
  await context.env.R2.put(key, context.request.body);
  return Response.json({ id: key });
}
