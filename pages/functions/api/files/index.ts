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
  const uuid = crypto.randomUUID();
  const contentType = context.request.headers.get('content-type');
  const ext = contentType.split('/').pop().split('+').shift();
  const key = `${uuid}.${ext}`;
  await context.env.R2.put(key, context.request.body);
  return Response.json({ key });
}
