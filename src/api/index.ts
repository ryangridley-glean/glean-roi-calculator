import type { DataProvider } from '@/types/api'
import { MockDataProvider } from './mock'
import { GleanDataProvider } from './glean'

function envFlag(value: string | undefined): boolean {
  return value?.trim() === 'true'
}

const hasGleanCredentials =
  Boolean(import.meta.env.VITE_GLEAN_API_KEY?.trim()) &&
  Boolean(import.meta.env.VITE_GLEAN_BASE_URL?.trim())

// GleanDataProvider still throws until API mapping is implemented.
const gleanApiReady = envFlag(import.meta.env.VITE_GLEAN_API_READY)

const USE_MOCK = !(
  import.meta.env.VITE_USE_MOCK === 'false' &&
  hasGleanCredentials &&
  gleanApiReady
)

export const dataProvider: DataProvider = USE_MOCK
  ? new MockDataProvider()
  : new GleanDataProvider({
      apiKey: import.meta.env.VITE_GLEAN_API_KEY ?? '',
      baseUrl: import.meta.env.VITE_GLEAN_BASE_URL ?? '',
    })
