// Forrester Research benchmarks for Glean ROI calculations
export const BENCHMARKS = {
  // Minutes saved per event (Forrester)
  minutesSavedPerSearch: 8.1,
  minutesSavedPerChat: 16.8,
  minutesSavedPerAgentRun: 20,       // No Forrester data; internal estimate

  // Financial assumptions (Forrester fully-burdened rate)
  avgHourlySalaryUsd: 52,

  // Risk adjustment (Glean standard, per Forrester methodology)
  riskAdjustment: 0.10,

  // FTE denominator (annual working hours)
  annualWorkingHours: 2080,
} as const

export function computeTimeSavedMinutes(
  searches: number,
  chats: number,
  agentRuns: number,
): number {
  return (
    searches * BENCHMARKS.minutesSavedPerSearch +
    chats * BENCHMARKS.minutesSavedPerChat +
    agentRuns * BENCHMARKS.minutesSavedPerAgentRun
  )
}

export function minutesToDollarValue(minutes: number, hourlyRate = BENCHMARKS.avgHourlySalaryUsd): number {
  return (minutes / 60) * hourlyRate
}
