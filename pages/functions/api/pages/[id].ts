import { Env, ReqBody } from '../../interfaces';

// GET /api/pages/[id]
// アイテムを取得する
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const id = <string>context.params.id;
  const item = await context.env.pages.getWithMetadata(id);
  return Response.json({ body: item.value, metadata: item.metadata });  
}

// PUT /api/pages/[id]
// アイテムを更新する
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const reqBody: ReqBody = await context.request.json();
  const { title, type, draft, created, updated, body } = reqBody;

  const id = <string>context.params.id;
  const metadata = { title, type, draft, created, updated };
  await context.env.pages.put(id, body, { metadata });
  return Response.json({ message: 'success!'});
}

// DELETE /api/pages/[id]
// アイテムを削除する
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const id = <string>context.params.id;
  await context.env.pages.delete(id);
  return Response.json({ message: 'success!'});
}
