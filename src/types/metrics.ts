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
}
