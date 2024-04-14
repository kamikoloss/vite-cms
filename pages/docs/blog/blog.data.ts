import { loadEnv } from 'vitepress';

type Metadata = {
  title: string;
  type: number;
  draft: number;
  created: number;
  updated: number;
};
type Entry = {
  id: string;
  body: string;
  metadata: Metadata;
};

type CloudflareEnv = {
  VITE_CF_API_BASE_URL: string;
  VITE_CF_ACCESS_CLIENT_ID: string;
  VITE_CF_ACCESS_CLIENT_SECRET: string;
}
type ListResult = {
  keys: { name: string, metadata: Metadata }[];
  list_complete: boolean;
};
type GetResult = {
  body: string;
  metadata: Metadata;
};

/**
 * Entry[] (body 以外) を取得する
 *
 * TODO: list_complete が false のときは次を取得する (1000件以上の場合)  
 */
async function getEntryList(env: CloudflareEnv): Promise<Entry[]> {
  const url = `${env.VITE_CF_API_BASE_URL}/api/pages`;
  const headers = {
    'CF-Access-Client-Id': env.VITE_CF_ACCESS_CLIENT_ID,
    'CF-Access-Client-Secret': env.VITE_CF_ACCESS_CLIENT_SECRET,
  };
  const entries = await fetch(url, { headers })
    .then(async response => {
      const result: ListResult = await response.json();
      return result.keys.map(key => {
        return { id: key.name, body: '', metadata: key.metadata };
      });
    });
  return entries;
}

/**
 * Entry を取得する
 */
async function getEntry(env: CloudflareEnv, id: string): Promise<Entry> {
  const url = `${env.VITE_CF_API_BASE_URL}/api/pages/${id}`;
  const headers = {
    'CF-Access-Client-Id': env.VITE_CF_ACCESS_CLIENT_ID,
    'CF-Access-Client-Secret': env.VITE_CF_ACCESS_CLIENT_SECRET,
  };
  const entry = await fetch(url, { headers })
    .then(async response => {
      const result: GetResult = await response.json();
      return { id, body: result.body, metadata: result.metadata };
    });
  return entry;
}

// ビルド時にデータを取得する
// ref. https://vitepress.dev/guide/data-loading
export default {
  async load() {
    const env = loadEnv('', process.cwd()) as CloudflareEnv;
    const entryList = await getEntryList(env);
    return Promise.all(entryList.map(entry => getEntry(env, entry.id)));
  }
}
