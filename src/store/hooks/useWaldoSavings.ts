import { useMemo } from 'react'
import { computeWaldoSavings, type WaldoSavingsResult } from '@/lib/waldoValue'
import type { WaldoUsageSummary } from '@/types/metrics'

export function useWaldoSavings(
  waldoUsage: WaldoUsageSummary | null | undefined,
): WaldoSavingsResult | null {
  return useMemo(() => computeWaldoSavings(waldoUsage), [waldoUsage])
}
