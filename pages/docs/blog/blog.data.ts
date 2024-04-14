import { defineLoader } from 'vitepress'

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
  baseUrl: string;
  clientId: string;
  clientSecret: string;
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
  const url = `${env.baseUrl}/api/pages`;
  const headers = {
    'CF-Access-Client-Id': env.clientId,
    'CF-Access-Client-Secret': env.clientSecret,
  };
  console.log(url, headers);
  const entries = await fetch(url, { headers })
    .then(async response => {
      const result: ListResult = await response.json();
      return result.keys.map(key => {
        return { id: key.name, body: '', metadata: key.metadata };
      });
    });
  console.log(entries);
  return entries;
}

/**
 * Entry を取得する
 */
async function getEntry(env: CloudflareEnv, id: string): Promise<Entry> {
  const url = `${env.baseUrl}/api/pages/${id}`;
  const headers = {
    'CF-Access-Client-Id': env.clientId,
    'CF-Access-Client-Secret': env.clientSecret,
  };
  const entry = await fetch(url, { headers })
    .then(async response => {
      const result: GetResult = await response.json();
      return { id, body: result.body, metadata: result.metadata };
    });
  return entry;
}

// TODO: 環境変数
const VITE_CF_API_BASE_URL = ""
const VITE_CF_ACCESS_CLIENT_ID = ""
const VITE_CF_ACCESS_CLIENT_SECRET = ""
const cfEnv = {
  baseUrl: VITE_CF_API_BASE_URL,
  clientId: VITE_CF_ACCESS_CLIENT_ID,
  clientSecret: VITE_CF_ACCESS_CLIENT_SECRET,
}

// ビルド時にデータを取得する
// ref. https://vitepress.dev/guide/data-loading
export default {
  async load() {
    const entryList = await getEntryList(cfEnv);
    return Promise.all(entryList.map(entry => getEntry(cfEnv, entry.id)));
  }
}

/*
export interface Data { data: Entry[]; }
declare const data: Data;
export { data };

export default defineLoader({
  async load(): Promise<Data> {
    const entryList = await getEntryList(cfEnv);
    const data = await Promise.all(entryList.map(entry => getEntry(cfEnv, entry.id)));
    return { data };
  }
});
*/
