import { BENCHMARKS, computeTimeSavedMinutes, minutesToDollarValue } from '@/constants/benchmarks'
import type { UsageSummary } from '@/types/metrics'

export interface ROIAssumptions {
  hourlyRateUsd: number
  riskAdjustment: number   // 0–1, e.g. 0.10 = 10%
}

export const DEFAULT_ASSUMPTIONS: ROIAssumptions = {
  hourlyRateUsd: BENCHMARKS.avgHourlySalaryUsd,
  riskAdjustment: BENCHMARKS.riskAdjustment,
}

export interface ROIResult {
  // Pre-risk-adjustment (gross)
  grossHoursSaved: number
  grossDollarValue: number

  // Risk-adjusted headline figures
  totalMinutesSaved: number
  totalHoursSaved: number
  totalDollarValue: number

  roiMultiplier: number | null
  fteEquivalent: number

  breakdown: {
    searchMinutes: number
    chatMinutes: number
    agentMinutes: number
    searchHours: number
    chatHours: number
    agentHours: number
    searchDollars: number
    chatDollars: number
    agentDollars: number
    // Risk-adjusted per-activity
    searchHoursAdj: number
    chatHoursAdj: number
    agentHoursAdj: number
    searchDollarsAdj: number
    chatDollarsAdj: number
    agentDollarsAdj: number
  }
}

export function computeROI(
  summary: UsageSummary,
  contractValueUsd: number | null,
  assumptions: ROIAssumptions = DEFAULT_ASSUMPTIONS,
): ROIResult {
  const { hourlyRateUsd, riskAdjustment } = assumptions
  const retainFactor = 1 - riskAdjustment

  const searchMinutes = summary.totalSearchQueries * BENCHMARKS.minutesSavedPerSearch
  const chatMinutes   = summary.totalChatSessions  * BENCHMARKS.minutesSavedPerChat
  const agentMinutes  = summary.totalAgentRuns     * BENCHMARKS.minutesSavedPerAgentRun

  const grossMinutes     = computeTimeSavedMinutes(
    summary.totalSearchQueries,
    summary.totalChatSessions,
    summary.totalAgentRuns,
  )
  const grossHoursSaved  = grossMinutes / 60
  const grossDollarValue = minutesToDollarValue(grossMinutes, hourlyRateUsd)

  // Apply risk adjustment
  const totalMinutesSaved = grossMinutes * retainFactor
  const totalHoursSaved   = totalMinutesSaved / 60
  const totalDollarValue  = minutesToDollarValue(totalMinutesSaved, hourlyRateUsd)
  const fteEquivalent     = parseFloat((totalHoursSaved / BENCHMARKS.annualWorkingHours).toFixed(1))

  const roiMultiplier =
    contractValueUsd && contractValueUsd > 0
      ? parseFloat((totalDollarValue / contractValueUsd).toFixed(1))
      : null

  const sh = searchMinutes / 60
  const ch = chatMinutes / 60
  const ah = agentMinutes / 60

  return {
    grossHoursSaved:  parseFloat(grossHoursSaved.toFixed(1)),
    grossDollarValue: Math.round(grossDollarValue),
    totalMinutesSaved,
    totalHoursSaved:  parseFloat(totalHoursSaved.toFixed(1)),
    totalDollarValue: Math.round(totalDollarValue),
    roiMultiplier,
    fteEquivalent,
    breakdown: {
      searchMinutes, chatMinutes, agentMinutes,
      searchHours: parseFloat(sh.toFixed(1)),
      chatHours:   parseFloat(ch.toFixed(1)),
      agentHours:  parseFloat(ah.toFixed(1)),
      searchDollars: Math.round(minutesToDollarValue(searchMinutes, hourlyRateUsd)),
      chatDollars:   Math.round(minutesToDollarValue(chatMinutes,   hourlyRateUsd)),
      agentDollars:  Math.round(minutesToDollarValue(agentMinutes,  hourlyRateUsd)),
      searchHoursAdj:   parseFloat((sh * retainFactor).toFixed(1)),
      chatHoursAdj:     parseFloat((ch * retainFactor).toFixed(1)),
      agentHoursAdj:    parseFloat((ah * retainFactor).toFixed(1)),
      searchDollarsAdj: Math.round(minutesToDollarValue(searchMinutes * retainFactor, hourlyRateUsd)),
      chatDollarsAdj:   Math.round(minutesToDollarValue(chatMinutes   * retainFactor, hourlyRateUsd)),
      agentDollarsAdj:  Math.round(minutesToDollarValue(agentMinutes  * retainFactor, hourlyRateUsd)),
    },
  }
}
