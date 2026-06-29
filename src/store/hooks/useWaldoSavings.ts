import { useMemo } from 'react'
import { buildWaldoUsageFromSnapshots, computeWaldoSavings, type WaldoSavingsResult } from '@/lib/waldoValue'
import type { UsageSummary } from '@/types/metrics'

export function useWaldoSavings(
  summary: UsageSummary | null | undefined,
): WaldoSavingsResult | null {
  return useMemo(() => {
    if (!summary) return null
    const waldoUsage = summary.waldoUsage ?? buildWaldoUsageFromSnapshots(summary.dailySnapshots)
    return computeWaldoSavings(waldoUsage)
  }, [summary])
}
