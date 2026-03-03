import type { DataProvider, MetricsRequest, MetricsResponse } from '@/types/api'
import type { ContractInfo } from '@/types/contract'
import type { AgentUseCase } from '@/types/agents'
import type { UsageSummary } from '@/types/metrics'
import { generateDailySnapshots, generateDepartmentUsage } from './generators'
import { AGENT_USE_CASES } from './agentUseCases'

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Support', 'Finance', 'HR', 'Legal', 'Product']

const CONTRACT: ContractInfo = {
  companyName: 'Acme Corporation',
  contractStartDate: '2024-06-01',
  contractEndDate: '2026-06-01',
  contractValueUsd: 240000,
  licensedSeats: 1000,
}

export class MockDataProvider implements DataProvider {
  async getMetrics(req: MetricsRequest): Promise<MetricsResponse> {
    await new Promise(r => setTimeout(r, 280))

    const snapshots = generateDailySnapshots(
      req.dateRange.start,
      req.dateRange.end,
      req.departmentFilter,
    )

    const totalSearchQueries = snapshots.reduce((s, d) => s + d.searchQueries, 0)
    const totalChatSessions  = snapshots.reduce((s, d) => s + d.chatSessions, 0)
    const totalAgentRuns     = snapshots.reduce((s, d) => s + d.agentRuns, 0)

    const recentDays = snapshots.slice(-30)
    const mauSet = new Set(recentDays.flatMap((_, i) => Array.from({ length: Math.round(recentDays[i].activeUsers) }, (_, j) => j)))
    const wauCount = snapshots.slice(-7).reduce((s, d) => s + d.activeUsers, 0) / 7

    const summary: UsageSummary = {
      totalSearchQueries,
      totalChatSessions,
      totalAgentRuns,
      dailySnapshots: snapshots,
      weeklyActiveUsers: Math.round(wauCount),
      monthlyActiveUsers: Math.min(Math.round(mauSet.size * 0.85), CONTRACT.licensedSeats),
      totalEmployees: 921,
      signedUpEmployees: 821,
      health: {
        coverage: 89,
        activity: 9,
        stickiness: 53,
      },
    }

    const byDepartment = generateDepartmentUsage(snapshots)

    return { summary, byDepartment, contract: CONTRACT }
  }

  async getDepartments(): Promise<string[]> {
    return DEPARTMENTS
  }

  async getContract(): Promise<ContractInfo> {
    return CONTRACT
  }

  async getAgentUseCases(): Promise<AgentUseCase[]> {
    await new Promise(r => setTimeout(r, 200))
    return AGENT_USE_CASES
  }
}
