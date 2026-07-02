import { useMemo, useState, useCallback } from 'react'
import { DEFAULT_ASSUMPTIONS, type ROIAssumptions } from '@/lib/roi'
import { computeExecutiveSummary, computeTCOComparison, computeConsolidationSavings } from '@/lib/tcoAnalysis'
import type { WaldoSavingsResult } from '@/lib/waldoValue'
import type { ContractInfo } from '@/types/contract'
import type { UsageSummary } from '@/types/metrics'
import { DEFAULT_SCENARIO, type ScenarioInputs } from '@/types/tco'

const STORAGE_KEY = 'glean_scenario_model'

function loadScenario(defaultSeats: number): ScenarioInputs {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...DEFAULT_SCENARIO, licensedSeats: defaultSeats, ...JSON.parse(saved) }
  } catch { /* ignore */ }
  return { ...DEFAULT_SCENARIO, licensedSeats: defaultSeats }
}

function loadAssumptions(): ROIAssumptions {
  try {
    const saved = localStorage.getItem('glean_roi_assumptions')
    return saved ? { ...DEFAULT_ASSUMPTIONS, ...JSON.parse(saved) } : DEFAULT_ASSUMPTIONS
  } catch {
    return DEFAULT_ASSUMPTIONS
  }
}

export function useScenarioModel(defaultSeats = 1000) {
  const [scenario, setScenarioState] = useState<ScenarioInputs>(() => loadScenario(defaultSeats))

  const setScenario = useCallback((patch: Partial<ScenarioInputs>) => {
    setScenarioState(prev => {
      const next = { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { scenario, setScenario }
}

export function useTCOAnalysis(params: {
  summary: UsageSummary | null | undefined
  contract: ContractInfo | null | undefined
  contractValueUsd: number | null
  waldoSavings: WaldoSavingsResult | null
  periodStart: string
  periodEnd: string
  scenario: ScenarioInputs
}) {
  const assumptions = useMemo(() => loadAssumptions(), [])

  return useMemo(() => {
    if (!params.summary || !params.contract) return null

    const base = {
      summary: params.summary,
      contract: params.contract,
      contractValueUsd: params.contractValueUsd,
      waldoSavings: params.waldoSavings,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      scenario: params.scenario,
      assumptions: { ...assumptions, hourlyRateUsd: params.scenario.hourlyRateUsd },
    }

    return {
      tco: computeTCOComparison(base),
      executive: computeExecutiveSummary(base),
      consolidation: computeConsolidationSavings(undefined, params.scenario.shadowToolBudgetUsd),
      assumptions,
    }
  }, [
    params.summary,
    params.contract,
    params.contractValueUsd,
    params.waldoSavings,
    params.periodStart,
    params.periodEnd,
    params.scenario,
    assumptions,
  ])
}
