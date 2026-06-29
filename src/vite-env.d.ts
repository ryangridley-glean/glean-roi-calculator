/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK?: string
  readonly VITE_GLEAN_BASE_URL?: string
  readonly VITE_GLEAN_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
