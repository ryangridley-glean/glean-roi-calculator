import type { AgentUseCase, AgentROI } from '@/types/agents'
import { BENCHMARKS } from '@/constants/benchmarks'

const WORKING_WEEKS_PER_YEAR = 48

export function computeAgentROI(
  useCase: AgentUseCase,
  hourlyRate: number = BENCHMARKS.avgHourlySalaryUsd,
  analysisWeeks: number = WORKING_WEEKS_PER_YEAR,
): AgentROI {
  const timeSavedPerRunMinutes = Math.max(
    useCase.preGleanTotalMinutes - useCase.withGleanTotalMinutes,
    0,
  )
  const safeAnalysisWeeks = Math.max(analysisWeeks, 0)
  const annualRunsTotal = useCase.numberOfUsers * useCase.runsPerUserPerWeek * safeAnalysisWeeks
  const annualTimeSavedHours = (annualRunsTotal * timeSavedPerRunMinutes) / 60
  const annualValueUsd = annualTimeSavedHours * hourlyRate
  const annualCostUsd = annualRunsTotal * useCase.costPerRunUsd
  const netBenefitUsd = annualValueUsd - annualCostUsd
  const valueCostRatio = annualCostUsd > 0 ? annualValueUsd / annualCostUsd : 0
  const timeReductionPercent = useCase.preGleanTotalMinutes > 0
    ? ((useCase.preGleanTotalMinutes - useCase.withGleanTotalMinutes) / useCase.preGleanTotalMinutes) * 100
    : 0

  return {
    useCase,
    annualTimeSavedHours: Math.round(annualTimeSavedHours),
    annualValueUsd: Math.round(annualValueUsd),
    annualCostUsd: Math.round(annualCostUsd),
    netBenefitUsd: Math.round(netBenefitUsd),
    valueCostRatio: parseFloat(valueCostRatio.toFixed(1)),
    timeReductionPercent: Math.round(timeReductionPercent),
    annualRunsTotal,
  }
}

export function computeAllAgentROI(
  useCases: AgentUseCase[],
  hourlyRate?: number,
  analysisWeeks: number = WORKING_WEEKS_PER_YEAR,
): AgentROI[] {
  return useCases
    .map(uc => computeAgentROI(uc, hourlyRate, analysisWeeks))
    .sort((a, b) => b.netBenefitUsd - a.netBenefitUsd)
}
