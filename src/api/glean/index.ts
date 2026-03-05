import type { DataProvider, MetricsRequest, MetricsResponse } from '@/types/api'
import type { ContractInfo } from '@/types/contract'
import type { AgentUseCase } from '@/types/agents'
import { GleanClient } from './client'
import { ENDPOINTS } from './endpoints'

interface GleanProviderConfig {
  apiKey: string
  baseUrl: string
}

export class GleanDataProvider implements DataProvider {
  private client: GleanClient

  constructor(config: GleanProviderConfig) {
    this.client = new GleanClient(config.apiKey, config.baseUrl)
  }

  async getMetrics(_req: MetricsRequest): Promise<MetricsResponse> {
    // TODO: implement when Glean Admin API credentials are available
    // Map MetricsRequest → Glean query params, then transform response
    await this.client.get(ENDPOINTS.analytics)
    throw new Error('Glean API integration not yet implemented. Set VITE_USE_MOCK=true.')
  }

  async getDepartments(): Promise<string[]> {
    const raw = await this.client.get<{ departments: { name: string }[] }>(ENDPOINTS.departments)
    return raw.departments.map(d => d.name)
  }

  async getContract(): Promise<ContractInfo> {
    await this.client.get(ENDPOINTS.contract)
    throw new Error('Glean API integration not yet implemented.')
  }

  async getAgentUseCases(): Promise<AgentUseCase[]> {
    throw new Error('Agent use cases not available via Glean API. Set VITE_USE_MOCK=true.')
  }
}
