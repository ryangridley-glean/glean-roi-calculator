import type { DataProvider } from '@/types/api'
import { MockDataProvider } from './mock'
import { GleanDataProvider } from './glean'

const hasGleanCredentials =
  Boolean(import.meta.env.VITE_GLEAN_API_KEY) &&
  Boolean(import.meta.env.VITE_GLEAN_BASE_URL)

// Default to mock data unless real credentials are configured.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' || !hasGleanCredentials

export const dataProvider: DataProvider = USE_MOCK
  ? new MockDataProvider()
  : new GleanDataProvider({
      apiKey: import.meta.env.VITE_GLEAN_API_KEY ?? '',
      baseUrl: import.meta.env.VITE_GLEAN_BASE_URL ?? '',
    })
