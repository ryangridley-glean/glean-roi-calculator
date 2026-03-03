import type { UsageSummary, DepartmentUsage } from './metrics'
import type { ContractInfo } from './contract'
import type { AgentUseCase } from './agents'

export type TimePreset = '7d' | '30d' | '90d' | 'contract' | 'custom'

export interface DateRange {
  start: string
  end: string
}

export interface MetricsRequest {
  dateRange: DateRange
  departmentFilter?: string
}

export interface MetricsResponse {
  summary: UsageSummary
  byDepartment: DepartmentUsage[]
  contract: ContractInfo
}

export interface DataProvider {
  getMetrics(req: MetricsRequest): Promise<MetricsResponse>
  getDepartments(): Promise<string[]>
  getContract(): Promise<ContractInfo>
  getAgentUseCases(): Promise<AgentUseCase[]>
}
