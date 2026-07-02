export type CompetitorId =
  | 'microsoft-copilot'
  | 'chatgpt-enterprise'
  | 'google-gemini'
  | 'build-your-own'

export interface CompetitorProfile {
  id: CompetitorId
  label: string
  shortLabel: string
  color: string
  /** AI add-on license (e.g. Copilot $30/user/mo) — billed on active seats */
  perSeatMonthlyUsd: number
  /** Base productivity suite (e.g. M365 E3) — billed on licensed seats; 0 if N/A */
  productivitySuiteMonthlyUsd: number
  supplementalSearchAnnualUsd: number
  diyFteRequired: number
  diyFteLoadedCostUsd: number
  infraAnnualUsd: number
  inferenceCostMultiplier: number
  /** How the inference multiplier was chosen (Waldo usage baseline). */
  inferenceMultiplierNote: string
  coveragePct: number
  gaps: string[]
  strengths: string[]
  /** Public/list pricing citation shown as UI footnote. */
  sourceNote: string
  /** Label for productivity suite line item when productivitySuiteMonthlyUsd > 0. */
  productivitySuiteLabel?: string
}

export interface TCOLineItem {
  id: string
  label: string
  description: string
  gleanUsd: number
  competitorUsd: number
  category: 'platform' | 'inference' | 'infrastructure' | 'people' | 'consolidation'
  gleanSourceNote?: string
  competitorSourceNote?: string
}

export interface TCOComparisonResult {
  competitor: CompetitorProfile
  periodDays: number
  licensedSeats: number
  activeSeats: number
  glean: {
    platformAnnualUsd: number
    /** Contract-derived effective platform rate (annual contract ÷ licensed seats ÷ 12). */
    effectivePerSeatMonthlyUsd: number | null
    platformSourceNote: string
    inferenceAnnualUsd: number
    adminAnnualUsd: number
    totalCostAnnualUsd: number
    productivityValueAnnualUsd: number
    netValueAnnualUsd: number
  }
  competitorCosts: {
    platformAnnualUsd: number
    productivitySuiteAnnualUsd: number
    inferenceAnnualUsd: number
    supplementalAnnualUsd: number
    infraAnnualUsd: number
    peopleAnnualUsd: number
    totalCostAnnualUsd: number
  }
  savingsVsCompetitorUsd: number
  savingsPct: number
  breakevenMonths: number | null
  lineItems: TCOLineItem[]
  threeYear: { year: string; glean: number; competitor: number }[]
}

export interface ConsolidationItem {
  id: string
  tool: string
  category: string
  annualSpendUsd: number
  replacedBy: string
  reductionPct: number
}

export interface StackCoverageRow {
  source: string
  gleanPct: number
  competitorPct: number
}

export interface ScenarioInputs {
  competitorId: CompetitorId
  licensedSeats: number
  adoptionPct: number
  hourlyRateUsd: number
  shadowToolBudgetUsd: number
  diyFteCount: number
}

export const DEFAULT_SCENARIO: ScenarioInputs = {
  competitorId: 'microsoft-copilot',
  licensedSeats: 1000,
  adoptionPct: 75,
  hourlyRateUsd: 52,
  shadowToolBudgetUsd: 185_000,
  diyFteCount: 0.5,
}

export interface ExecutiveSummaryResult {
  companyName: string
  periodLabel: string
  recommendation: 'strong' | 'positive' | 'review'
  headlineMetrics: {
    netValueAnnualUsd: number
    tcoSavingsAnnualUsd: number
    roiMultiplier: number | null
    waldoSavingsAnnualUsd: number
    fteEquivalent: number
    consolidationSavingsUsd: number
  }
  tco: TCOComparisonResult
  consolidationTotalUsd: number
  keyFindings: string[]
}
