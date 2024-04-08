export interface Env {
	KV: KVNamespace;
  R2: R2Bucket;
}

// (value) 以外はすべて metadata
export type PageReqBody = {
	title: string,
	type: number,
	draft: number,
	created: number, // Unixtime
	updated: number, // Unixtime
	body: string, // (value) 本文
};

export type ErrorResBody = {
  error: string[];
}
