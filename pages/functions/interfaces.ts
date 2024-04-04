export interface Env {
	pages: KVNamespace;
}

// (value) 以外はすべて metadata
export type ReqBody = {
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
