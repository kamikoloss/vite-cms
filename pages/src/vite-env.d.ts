/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CF_API_BASE_URL: string;
  readonly VITE_CF_ACCESS_CLIENT_ID: string;
  readonly VITE_CF_ACCESS_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
