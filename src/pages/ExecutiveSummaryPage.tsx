import { useState } from 'react'
import { useFilters } from '@/store/FilterContext'
import { useMetrics } from '@/store/hooks/useMetrics'
import { useROI } from '@/store/hooks/useROI'
import { useWaldoSavings } from '@/store/hooks/useWaldoSavings'
import { useScenarioModel, useTCOAnalysis } from '@/store/hooks/useTCOAnalysis'
import { BusinessPageHeader } from '@/components/layout/BusinessPageHeader'
import { ExecutiveVerdictCard } from '@/components/cards/ExecutiveVerdictCard'
import { ExecutiveHeadlineStrip } from '@/components/cards/ExecutiveHeadlineStrip'
import { TCOComparisonChart } from '@/components/charts/TCOComparisonChart'
import { ThreeYearTCOChart } from '@/components/charts/ThreeYearTCOChart'
import { ConsolidationSavingsChart } from '@/components/charts/ConsolidationSavingsChart'
import { ROISummaryCard } from '@/components/cards/ROISummaryCard'
import { WaldoSavingsCard } from '@/components/cards/WaldoSavingsCard'
import { DEFAULT_ASSUMPTIONS } from '@/lib/roi'
import { formatCurrency } from '@/lib/formatters'

function loadAssumptions() {
  try {
    const saved = localStorage.getItem('glean_roi_assumptions')
    return saved ? { ...DEFAULT_ASSUMPTIONS, ...JSON.parse(saved) } : DEFAULT_ASSUMPTIONS
  } catch {
    return DEFAULT_ASSUMPTIONS
  }
}

export function ExecutiveSummaryPage() {
  const { filters } = useFilters()
  const { data, isLoading } = useMetrics(filters)
  const waldoSavings = useWaldoSavings(data?.summary)
  const assumptions = loadAssumptions()

  const [contractValue] = useState<number | null>(() => {
    const saved = localStorage.getItem('glean_contract_value')
    return saved ? parseFloat(saved) : null
  })

  const effectiveContract = contractValue ?? data?.contract.contractValueUsd ?? null
  const roi = useROI(data?.summary ?? null, effectiveContract, assumptions)

  const defaultSeats = data?.contract.licensedSeats ?? 1000
  const { scenario } = useScenarioModel(defaultSeats)
  const analysis = useTCOAnalysis({
    summary: data?.summary,
    contract: data?.contract,
    contractValueUsd: effectiveContract,
    waldoSavings,
    periodStart: filters.dateRange.start,
    periodEnd: filters.dateRange.end,
    scenario,
  })

  const executive = analysis?.executive ?? null

  return (
    <div className="px-8 py-6 max-w-5xl space-y-6">
      <BusinessPageHeader
        title="Executive Summary"
        subtitle="Leadership-ready view of Glean ROI, total cost of ownership, and competitive advantage for renewal and expansion decisions."
      />

      <ExecutiveVerdictCard summary={executive} isLoading={isLoading} />
      <ExecutiveHeadlineStrip summary={executive} isLoading={isLoading} />

      <div className="grid grid-cols-2 gap-4">
        <TCOComparisonChart tco={analysis?.tco ?? null} isLoading={isLoading} />
        <ThreeYearTCOChart tco={analysis?.tco ?? null} isLoading={isLoading} />
      </div>

      {executive && (
        <div className="card bg-glean-surface">
          <h3 className="text-sm font-semibold text-glean-text-primary mb-3">Key findings for leadership</h3>
          <ul className="space-y-2">
            {executive.keyFindings.map((finding, i) => (
              <li key={i} className="flex gap-2 text-sm text-glean-text-secondary">
                <span className="text-glean-blue font-bold shrink-0">•</span>
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-glean-text-primary mb-3">Hard cost summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-glean-text-secondary">Glean annual TCO</span>
              <span className="font-semibold">{formatCurrency(analysis?.tco.glean.totalCostAnnualUsd ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-glean-text-secondary">{analysis?.tco.competitor.shortLabel} annual TCO</span>
              <span className="font-semibold">{formatCurrency(analysis?.tco.competitorCosts.totalCostAnnualUsd ?? 0)}</span>
            </div>
            <div className="flex justify-between border-t border-glean-border pt-3">
              <span className="text-glean-text-secondary">Tool consolidation savings</span>
              <span className="font-semibold text-emerald-600">{formatCurrency(executive?.consolidationTotalUsd ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-glean-text-secondary">Waldo inference savings</span>
              <span className="font-semibold text-emerald-600">{formatCurrency(executive?.headlineMetrics.waldoSavingsAnnualUsd ?? 0)}</span>
            </div>
            {analysis?.tco.breakevenMonths && (
              <div className="flex justify-between border-t border-glean-border pt-3">
                <span className="text-glean-text-secondary">Breakeven vs. competitor</span>
                <span className="font-semibold text-glean-blue">~{analysis.tco.breakevenMonths} months</span>
              </div>
            )}
          </div>
        </div>
        <ConsolidationSavingsChart
          items={analysis?.consolidation.items ?? []}
          totalAnnualUsd={analysis?.consolidation.totalAnnualUsd ?? 0}
          isLoading={isLoading}
        />
      </div>

      <ROISummaryCard
        roi={roi}
        hourlyRate={assumptions.hourlyRateUsd}
        riskAdjPct={Math.round(assumptions.riskAdjustment * 100)}
        isLoading={isLoading}
      />

      <WaldoSavingsCard savings={waldoSavings} isLoading={isLoading} />
    </div>
  )
}
