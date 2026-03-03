import { daysBetween } from '@/lib/dateUtils'
import type { DailySnapshot, DepartmentUsage } from '@/types/metrics'

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Support', 'Finance', 'HR', 'Legal', 'Product']
const DEPT_WEIGHTS = [0.28, 0.22, 0.14, 0.12, 0.08, 0.07, 0.05, 0.04]

function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function rollingAvg(arr: number[], idx: number, window: number): number {
  const start = Math.max(0, idx - window + 1)
  const slice = arr.slice(start, idx + 1)
  return slice.reduce((s, v) => s + v, 0) / slice.length
}

export function generateDailySnapshots(
  start: string,
  end: string,
  deptFilter?: string,
): DailySnapshot[] {
  const days = daysBetween(start, end)
  const total = days.length

  const deptMultiplier = deptFilter
    ? (DEPT_WEIGHTS[DEPARTMENTS.indexOf(deptFilter)] ?? 0.12)
    : 1

  // Pre-compute base active users so rolling windows can look backwards
  const baseActive = days.map((date, i) => {
    const dayOfWeek = new Date(date).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const weekdayMult = isWeekend ? 0.12 : 1
    const growthFactor = 1 + (i / Math.max(total, 1)) * 0.35
    const noise = (seededRand(i * 7 + 13) - 0.5) * 0.2
    return Math.max(1, Math.round((260 + seededRand(i + 3) * 40) * growthFactor * weekdayMult * deptMultiplier * (1 + noise)))
  })

  return days.map((date, i) => {
    const dayOfWeek = new Date(date).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const weekdayMult = isWeekend ? 0.12 : 1
    const growthFactor = 1 + (i / Math.max(total, 1)) * 0.35
    const noise = (seededRand(i * 7 + 13) - 0.5) * 0.2

    const scale = (base: number) =>
      Math.max(0, Math.round(base * growthFactor * weekdayMult * deptMultiplier * (1 + noise)))

    const dau = baseActive[i]
    // Unique users accumulate over longer windows — factor accounts for deduplication
    const wau = Math.round(rollingAvg(baseActive, i, 7) * 1.7)
    const mau = Math.round(rollingAvg(baseActive, i, 30) * 2.4)

    return {
      date,
      searchQueries:      scale(420 + seededRand(i) * 80),
      chatSessions:       scale(110 + seededRand(i + 1) * 30),
      agentRuns:          scale(28  + seededRand(i + 2) * 14),
      activeUsers:        dau,
      wau,
      mau,
      searchActiveUsers:  Math.round(dau * 0.88),
      chatActiveUsers:    Math.round(dau * 0.38),
      agentActiveUsers:   Math.round(dau * 0.14),
    }
  })
}

export function generateDepartmentUsage(snapshots: DailySnapshot[]): DepartmentUsage[] {
  return DEPARTMENTS.map((department, idx) => {
    const w = DEPT_WEIGHTS[idx]
    const sum = (key: keyof Omit<DailySnapshot, 'date'>) =>
      Math.round(snapshots.reduce((s, d) => s + d[key], 0) * w)

    return {
      department,
      searchQueries: sum('searchQueries'),
      chatSessions:  sum('chatSessions'),
      agentRuns:     sum('agentRuns'),
      activeUsers:   Math.round(sum('activeUsers') / snapshots.length),
    }
  })
}
