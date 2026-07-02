import { CONSOLIDATION_ITEMS, getCompetitor } from '@/constants/competitors'
import { diffDays } from '@/lib/dateUtils'
import { computeROI, type ROIAssumptions } from '@/lib/roi'
import type { WaldoSavingsResult } from '@/lib/waldoValue'
import type { ContractInfo } from '@/types/contract'
import type { UsageSummary } from '@/types/metrics'
import type {
  CompetitorId,
  ConsolidationItem,
  ExecutiveSummaryResult,
  ScenarioInputs,
  TCOComparisonResult,
} from '@/types/tco'

function annualize(periodValue: number, periodDays: number): number {
  if (periodDays <= 0) return periodValue
  return Math.round(periodValue * (365 / periodDays))
}

function activeSeats(licensedSeats: number, adoptionPct: number): number {
  return Math.round(licensedSeats * (adoptionPct / 100))
}

export function computeConsolidationSavings(
  items: ConsolidationItem[] = CONSOLIDATION_ITEMS,
  shadowBudgetUsd?: number,
): { items: ConsolidationItem[]; totalAnnualUsd: number } {
  const adjusted = shadowBudgetUsd != null
    ? items.map(item =>
        item.id === 'chatgpt-seats'
          ? { ...item, annualSpendUsd: Math.round(shadowBudgetUsd * 0.35) }
          : item,
      )
    : items

  const totalAnnualUsd = adjusted.reduce(
    (sum, item) => sum + Math.round(item.annualSpendUsd * (item.reductionPct / 100)),
    0,
  )

  return { items: adjusted, totalAnnualUsd }
}

export function computeTCOComparison(params: {
  summary: UsageSummary
  contract: ContractInfo
  contractValueUsd: number | null
  waldoSavings: WaldoSavingsResult | null
  periodStart: string
  periodEnd: string
  scenario: ScenarioInputs
  assumptions: ROIAssumptions
}): TCOComparisonResult {
  const {
    summary,
    contract,
    contractValueUsd,
    waldoSavings,
    periodStart,
    periodEnd,
    scenario,
    assumptions,
  } = params

  const competitor = getCompetitor(scenario.competitorId)
  const periodDays = Math.max(1, diffDays(periodStart, periodEnd) + 1)
  const seats = scenario.licensedSeats || contract.licensedSeats
  const active = activeSeats(seats, scenario.adoptionPct)

  const roi = computeROI(summary, contractValueUsd, {
    ...assumptions,
    hourlyRateUsd: scenario.hourlyRateUsd,
  })

  const gleanPlatformAnnual = contractValueUsd ?? contract.contractValueUsd ?? 0
  const gleanInferencePeriod = waldoSavings?.totalWithWaldoCostUsd ?? 0
  const competitorInferencePeriod = (waldoSavings?.baselineFrontierCostUsd ?? gleanInferencePeriod)
    * competitor.inferenceCostMultiplier

  const gleanInferenceAnnual = annualize(gleanInferencePeriod, periodDays)
  const competitorInferenceAnnual = annualize(competitorInferencePeriod, periodDays)
  const gleanAdminAnnual = Math.round(gleanPlatformAnnual * 0.05)
  const productivityValueAnnual = annualize(roi.totalDollarValue, periodDays)

  const gleanTotalCost =
    gleanPlatformAnnual + gleanInferenceAnnual + gleanAdminAnnual
  const gleanNetValue = productivityValueAnnual - gleanTotalCost

  const competitorPlatformAnnual = Math.round(
    active * competitor.perSeatMonthlyUsd * 12,
  )
  const competitorPeopleAnnual = Math.round(
    (scenario.diyFteCount || competitor.diyFteRequired) * competitor.diyFteLoadedCostUsd,
  )
  const competitorSupplemental = competitor.supplementalSearchAnnualUsd
  const competitorInfra = competitor.infraAnnualUsd
  const competitorTotalCost =
    competitorPlatformAnnual +
    competitorInferenceAnnual +
    competitorSupplemental +
    competitorInfra +
    competitorPeopleAnnual

  const savingsVsCompetitor = competitorTotalCost - gleanTotalCost
  const savingsPct = competitorTotalCost > 0
    ? Math.round((savingsVsCompetitor / competitorTotalCost) * 100)
    : 0

  const monthlySavings = savingsVsCompetitor / 12
  const breakevenMonths = monthlySavings > 0 && gleanPlatformAnnual > 0
    ? Math.round(gleanPlatformAnnual / monthlySavings)
    : null

  const lineItems = [
    {
      id: 'platform',
      label: 'Platform licenses',
      description: 'Annual software subscription',
      gleanUsd: gleanPlatformAnnual,
      competitorUsd: competitorPlatformAnnual,
      category: 'platform' as const,
    },
    {
      id: 'inference',
      label: 'LLM inference',
      description: 'Assistant & Agents token spend (usage-based)',
      gleanUsd: gleanInferenceAnnual,
      competitorUsd: competitorInferenceAnnual,
      category: 'inference' as const,
    },
    {
      id: 'search',
      label: 'Supplemental search / index',
      description: 'Additional tools for non-native data sources',
      gleanUsd: 0,
      competitorUsd: competitorSupplemental,
      category: 'infrastructure' as const,
    },
    {
      id: 'infra',
      label: 'AI infrastructure',
      description: 'Vector DB, embedding pipelines, hosting',
      gleanUsd: 0,
      competitorUsd: competitorInfra,
      category: 'infrastructure' as const,
    },
    {
      id: 'people',
      label: 'Engineering & admin',
      description: 'FTE to build, integrate, and maintain',
      gleanUsd: gleanAdminAnnual,
      competitorUsd: competitorPeopleAnnual,
      category: 'people' as const,
    },
  ]

  const threeYear = [1, 2, 3].map(year => ({
    year: `Year ${year}`,
    glean: gleanTotalCost * year,
    competitor: competitorTotalCost * year,
  }))

  return {
    competitor,
    periodDays,
    licensedSeats: seats,
    activeSeats: active,
    glean: {
      platformAnnualUsd: gleanPlatformAnnual,
      inferenceAnnualUsd: gleanInferenceAnnual,
      adminAnnualUsd: gleanAdminAnnual,
      totalCostAnnualUsd: gleanTotalCost,
      productivityValueAnnualUsd: productivityValueAnnual,
      netValueAnnualUsd: gleanNetValue,
    },
    competitorCosts: {
      platformAnnualUsd: competitorPlatformAnnual,
      inferenceAnnualUsd: competitorInferenceAnnual,
      supplementalAnnualUsd: competitorSupplemental,
      infraAnnualUsd: competitorInfra,
      peopleAnnualUsd: competitorPeopleAnnual,
      totalCostAnnualUsd: competitorTotalCost,
    },
    savingsVsCompetitorUsd: savingsVsCompetitor,
    savingsPct,
    breakevenMonths,
    lineItems,
    threeYear,
  }
}

export function computeExecutiveSummary(params: {
  summary: UsageSummary
  contract: ContractInfo
  contractValueUsd: number | null
  waldoSavings: WaldoSavingsResult | null
  periodStart: string
  periodEnd: string
  scenario: ScenarioInputs
  assumptions: ROIAssumptions
}): ExecutiveSummaryResult {
  const tco = computeTCOComparison(params)
  const { totalAnnualUsd: consolidationTotalUsd } = computeConsolidationSavings(
    CONSOLIDATION_ITEMS,
    params.scenario.shadowToolBudgetUsd,
  )
  const periodDays = Math.max(1, diffDays(params.periodStart, params.periodEnd) + 1)
  const roi = computeROI(params.summary, params.contractValueUsd, params.assumptions)
  const waldoAnnual = annualize(params.waldoSavings?.netCostSavedUsd ?? 0, periodDays)

  const totalAdvantage =
    tco.savingsVsCompetitorUsd + consolidationTotalUsd + waldoAnnual

  let recommendation: ExecutiveSummaryResult['recommendation'] = 'review'
  if (totalAdvantage > 200_000 && (roi.roiMultiplier ?? 0) >= 2) recommendation = 'strong'
  else if (totalAdvantage > 0) recommendation = 'positive'

  const keyFindings = [
    `Glean delivers ${tco.competitor.label} coverage for ${100 - tco.competitor.coveragePct}% more of your stack without supplemental search tools.`,
    `Model Hub + Waldo reduces inference spend by ${params.waldoSavings?.savingsRatePct ?? 0}% vs. frontier-only routing in the selected period.`,
    `Estimated ${consolidationTotalUsd.toLocaleString()} annual savings from consolidating overlapping search and AI tools.`,
    `${roi.fteEquivalent} FTE equivalent reclaimed through search, Assistant, and Agents in this period (Forrester benchmarks).`,
    tco.breakevenMonths
      ? `Platform cost breakeven vs. ${tco.competitor.shortLabel} in ~${tco.breakevenMonths} months on hard costs alone.`
      : 'Productivity value exceeds platform cost — positive ROI on soft benefits alone.',
  ]

  return {
    companyName: params.contract.companyName,
    periodLabel: `${params.periodStart} → ${params.periodEnd}`,
    recommendation,
    headlineMetrics: {
      netValueAnnualUsd: tco.glean.netValueAnnualUsd,
      tcoSavingsAnnualUsd: tco.savingsVsCompetitorUsd,
      roiMultiplier: roi.roiMultiplier,
      waldoSavingsAnnualUsd: waldoAnnual,
      fteEquivalent: roi.fteEquivalent,
      consolidationSavingsUsd: consolidationTotalUsd,
    },
    tco,
    consolidationTotalUsd,
    keyFindings,
  }
}

export function listCompetitorIds(): CompetitorId[] {
  return ['microsoft-copilot', 'chatgpt-enterprise', 'google-gemini', 'build-your-own']
}
