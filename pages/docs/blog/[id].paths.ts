import { data } from "./blog.data";

// 動的ルートページの事前ビルドを行う
// ref. https://vitepress.dev/guide/routing#dynamic-routes
// ref. https://vitepress.dev/guide/cms
export default {
  async paths() {
    return data.data.map(entry => {
      return {
        params: { id: entry.id, ...entry.metadata },
        content: entry.body,
      };
    })
  }
}
