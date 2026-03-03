import type { DataProvider } from '@/types/api'
import { MockDataProvider } from './mock'
import { GleanDataProvider } from './glean'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const dataProvider: DataProvider = USE_MOCK
  ? new MockDataProvider()
  : new GleanDataProvider({
      apiKey: import.meta.env.VITE_GLEAN_API_KEY ?? '',
      baseUrl: import.meta.env.VITE_GLEAN_BASE_URL ?? '',
    })
