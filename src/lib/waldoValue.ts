import {
  MODEL_RATES,
  FRONTIER_MODEL_SHARES,
  WALDO_PER_QUERY,
  tokenCostUsd,
  type FrontierModelId,
} from '@/constants/modelRates'
import type { DailySnapshot, ModelTokenUsage, WaldoUsageSummary } from '@/types/metrics'

export interface ModelSavingsBreakdown {
  modelId: FrontierModelId
  label: string
  share: number
  divertedInputTokens: number
  divertedOutputTokens: number
  divertedTotalTokens: number
  baselineCostUsd: number
  actualCostUsd: number
}

export interface DailyWaldoSavings {
  date: string
  waldoEligibleQueries: number
  frontierTokensDiverted: number
  netCostSavedUsd: number
}

export interface WaldoSavingsResult {
  waldoEligibleQueries: number
  frontierTokensDiverted: number
  netCostSavedUsd: number
  savingsRatePct: number
  baselineFrontierCostUsd: number
  actualFrontierCostUsd: number
  waldoCostUsd: number
  totalWithWaldoCostUsd: number
  breakdown: ModelSavingsBreakdown[]
  dailySnapshots: DailyWaldoSavings[]
}

function perQueryDiverted() {
  const { withoutWaldo, withWaldo } = WALDO_PER_QUERY
  return {
    input: withoutWaldo.frontierInput - withWaldo.frontierInput,
    output: withoutWaldo.frontierOutput - withWaldo.frontierOutput,
    total: WALDO_PER_QUERY.divertedTotalTokens,
  }
}

function buildFrontierTokenUsage(
  queries: number,
  scenario: 'with' | 'without',
): ModelTokenUsage[] {
  const { withoutWaldo, withWaldo } = WALDO_PER_QUERY

  return (Object.keys(FRONTIER_MODEL_SHARES) as FrontierModelId[]).map(modelId => {
    const share = FRONTIER_MODEL_SHARES[modelId]
    const qShare = queries * share

    if (scenario === 'without') {
      return {
        modelId,
        inputTokens: Math.round(withoutWaldo.frontierInput * qShare),
        outputTokens: Math.round(withoutWaldo.frontierOutput * qShare),
      }
    }

    return {
      modelId,
      inputTokens: Math.round(withWaldo.frontierInput * qShare),
      outputTokens: Math.round(withWaldo.frontierOutput * qShare),
    }
  })
}

export function buildWaldoUsageFromSnapshots(snapshots: DailySnapshot[]): WaldoUsageSummary {
  const dailySnapshots = snapshots.map(s => ({
    date: s.date,
    waldoEligibleQueries: Math.max(0, s.chatSessions + s.agentRuns),
  }))

  const waldoEligibleQueries = dailySnapshots.reduce((sum, d) => sum + d.waldoEligibleQueries, 0)

  const withWaldo: ModelTokenUsage[] = [
    ...buildFrontierTokenUsage(waldoEligibleQueries, 'with'),
    {
      modelId: 'waldo',
      inputTokens: Math.round(WALDO_PER_QUERY.withWaldo.waldoInput * waldoEligibleQueries),
      outputTokens: Math.round(WALDO_PER_QUERY.withWaldo.waldoOutput * waldoEligibleQueries),
    },
  ]

  return {
    waldoEligibleQueries,
    withWaldo,
    withoutWaldo: buildFrontierTokenUsage(waldoEligibleQueries, 'without'),
    dailySnapshots,
  }
}

function costForQueries(
  queries: number,
  scenario: 'with' | 'without',
): { frontier: number; waldo: number } {
  if (queries <= 0) return { frontier: 0, waldo: 0 }

  const { withoutWaldo, withWaldo } = WALDO_PER_QUERY
  let frontierCost = 0

  for (const modelId of Object.keys(FRONTIER_MODEL_SHARES) as FrontierModelId[]) {
    const share = FRONTIER_MODEL_SHARES[modelId]
    const rate = MODEL_RATES[modelId]
    const qShare = queries * share

    if (scenario === 'without') {
      frontierCost += tokenCostUsd(
        withoutWaldo.frontierInput * qShare,
        withoutWaldo.frontierOutput * qShare,
        rate,
      )
    } else {
      frontierCost += tokenCostUsd(
        withWaldo.frontierInput * qShare,
        withWaldo.frontierOutput * qShare,
        rate,
      )
    }
  }

  const waldoCost = scenario === 'with'
    ? tokenCostUsd(
        withWaldo.waldoInput * queries,
        withWaldo.waldoOutput * queries,
        MODEL_RATES.waldo,
      )
    : 0

  return { frontier: frontierCost, waldo: waldoCost }
}

export function computeWaldoSavings(
  waldoUsage: WaldoUsageSummary | null | undefined,
): WaldoSavingsResult | null {
  if (!waldoUsage || waldoUsage.waldoEligibleQueries <= 0) return null

  const queries = waldoUsage.waldoEligibleQueries
  const diverted = perQueryDiverted()

  const without = costForQueries(queries, 'without')
  const withWaldo = costForQueries(queries, 'with')

  const baselineFrontierCostUsd = without.frontier
  const actualFrontierCostUsd = withWaldo.frontier
  const waldoCostUsd = withWaldo.waldo
  const totalWithWaldoCostUsd = actualFrontierCostUsd + waldoCostUsd
  const netCostSavedUsd = baselineFrontierCostUsd - totalWithWaldoCostUsd
  const savingsRatePct = baselineFrontierCostUsd > 0
    ? parseFloat(((netCostSavedUsd / baselineFrontierCostUsd) * 100).toFixed(1))
    : 0

  const breakdown: ModelSavingsBreakdown[] = (
    Object.keys(FRONTIER_MODEL_SHARES) as FrontierModelId[]
  ).map(modelId => {
    const share = FRONTIER_MODEL_SHARES[modelId]
    const rate = MODEL_RATES[modelId]
    const qShare = queries * share
    const { withoutWaldo, withWaldo } = WALDO_PER_QUERY

    const divertedInput = diverted.input * qShare
    const divertedOutput = diverted.output * qShare

    return {
      modelId,
      label: rate.label,
      share,
      divertedInputTokens: Math.round(divertedInput),
      divertedOutputTokens: Math.round(divertedOutput),
      divertedTotalTokens: Math.round(diverted.input * qShare + diverted.output * qShare),
      baselineCostUsd: Math.round(tokenCostUsd(
        withoutWaldo.frontierInput * qShare,
        withoutWaldo.frontierOutput * qShare,
        rate,
      ) * 100) / 100,
      actualCostUsd: Math.round(tokenCostUsd(
        withWaldo.frontierInput * qShare,
        withWaldo.frontierOutput * qShare,
        rate,
      ) * 100) / 100,
    }
  })

  const dailySnapshots: DailyWaldoSavings[] = waldoUsage.dailySnapshots.map(day => {
    const dayWithout = costForQueries(day.waldoEligibleQueries, 'without')
    const dayWith = costForQueries(day.waldoEligibleQueries, 'with')
    const daySaved = dayWithout.frontier - dayWith.frontier - dayWith.waldo

    return {
      date: day.date,
      waldoEligibleQueries: day.waldoEligibleQueries,
      frontierTokensDiverted: Math.round(day.waldoEligibleQueries * diverted.total),
      netCostSavedUsd: Math.round(daySaved * 100) / 100,
    }
  })

  return {
    waldoEligibleQueries: queries,
    frontierTokensDiverted: Math.round(queries * diverted.total),
    netCostSavedUsd: Math.round(netCostSavedUsd * 100) / 100,
    savingsRatePct,
    baselineFrontierCostUsd: Math.round(baselineFrontierCostUsd * 100) / 100,
    actualFrontierCostUsd: Math.round(actualFrontierCostUsd * 100) / 100,
    waldoCostUsd: Math.round(waldoCostUsd * 100) / 100,
    totalWithWaldoCostUsd: Math.round(totalWithWaldoCostUsd * 100) / 100,
    breakdown,
    dailySnapshots,
  }
}
