import data from '../blog.data';

// ビルド時に動的ルートを決定する
// ref. https://vitepress.dev/guide/routing#dynamic-routes
export default {
  async paths() {
    const entries = await data.load();
    return entries.map(entry => {
      return {
        params: { id: entry.id, ...entry.metadata },
        content: entry.body,
      };
    });
  }
}
