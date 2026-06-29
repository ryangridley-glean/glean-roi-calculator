export interface DailySnapshot {
  date: string
  searchQueries: number
  chatSessions: number
  agentRuns: number
  activeUsers: number       // DAU
  wau: number               // rolling 7-day unique active users
  mau: number               // rolling 30-day unique active users
  searchActiveUsers: number
  chatActiveUsers: number
  agentActiveUsers: number
}

export interface DepartmentUsage {
  department: string
  searchQueries: number
  chatSessions: number
  agentRuns: number
  activeUsers: number
}

export interface HealthMetrics {
  coverage: number
  activity: number
  stickiness: number
}

export type ModelId = 'gpt-5.5' | 'opus-4.8' | 'waldo'

export interface ModelTokenUsage {
  modelId: ModelId
  inputTokens: number
  outputTokens: number
}

export interface DailyWaldoSnapshot {
  date: string
  waldoEligibleQueries: number
}

export interface WaldoUsageSummary {
  waldoEligibleQueries: number
  withWaldo: ModelTokenUsage[]
  withoutWaldo: ModelTokenUsage[]
  dailySnapshots: DailyWaldoSnapshot[]
}

export interface UsageSummary {
  totalSearchQueries: number
  totalChatSessions: number
  totalAgentRuns: number
  dailySnapshots: DailySnapshot[]
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  totalEmployees: number
  signedUpEmployees: number
  health: HealthMetrics
  waldoUsage: WaldoUsageSummary
}
