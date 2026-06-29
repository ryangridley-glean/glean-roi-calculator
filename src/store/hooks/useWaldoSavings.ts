import { useMemo } from 'react'
import { generateWaldoUsage } from '@/api/mock/generators'
import { computeWaldoSavings, type WaldoSavingsResult } from '@/lib/waldoValue'
import type { UsageSummary } from '@/types/metrics'

export function useWaldoSavings(
  summary: UsageSummary | null | undefined,
): WaldoSavingsResult | null {
  return useMemo(() => {
    if (!summary) return null
    const waldoUsage = summary.waldoUsage ?? generateWaldoUsage(summary.dailySnapshots)
    return computeWaldoSavings(waldoUsage)
  }, [summary])
}
