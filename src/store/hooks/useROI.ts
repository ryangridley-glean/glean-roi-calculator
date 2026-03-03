import { useMemo } from 'react'
import { computeROI, type ROIResult, type ROIAssumptions, DEFAULT_ASSUMPTIONS } from '@/lib/roi'
import type { UsageSummary } from '@/types/metrics'

export function useROI(
  summary: UsageSummary | null,
  contractValueUsd: number | null,
  assumptions: ROIAssumptions = DEFAULT_ASSUMPTIONS,
): ROIResult | null {
  return useMemo(() => {
    if (!summary) return null
    return computeROI(summary, contractValueUsd, assumptions)
  }, [summary, contractValueUsd, assumptions.hourlyRateUsd, assumptions.riskAdjustment])
}
