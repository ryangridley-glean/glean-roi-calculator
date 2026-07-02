import { useState } from 'react'
import { useFilters } from '@/store/FilterContext'
import { useMetrics } from '@/store/hooks/useMetrics'
import { useWaldoSavings } from '@/store/hooks/useWaldoSavings'
import { useScenarioModel, useTCOAnalysis } from '@/store/hooks/useTCOAnalysis'
import { COMPETITORS } from '@/constants/competitors'
import { BusinessPageHeader } from '@/components/layout/BusinessPageHeader'
import { TCOComparisonChart } from '@/components/charts/TCOComparisonChart'
import { ThreeYearTCOChart } from '@/components/charts/ThreeYearTCOChart'
import { TCOLineItemsTable } from '@/components/cards/TCOLineItemsTable'
import { formatCurrency } from '@/lib/formatters'
import type { CompetitorId } from '@/types/tco'

export function ScenarioModelerPage() {
  const { filters } = useFilters()
  const { data, isLoading } = useMetrics(filters)
  const waldoSavings = useWaldoSavings(data?.summary)

  const [contractValue] = useState<number | null>(() => {
    const saved = localStorage.getItem('glean_contract_value')
    return saved ? parseFloat(saved) : null
  })

  const defaultSeats = data?.contract.licensedSeats ?? 1000
  const { scenario, setScenario } = useScenarioModel(defaultSeats)
  const analysis = useTCOAnalysis({
    summary: data?.summary,
    contract: data?.contract,
    contractValueUsd: contractValue ?? data?.contract.contractValueUsd ?? null,
    waldoSavings,
    periodStart: filters.dateRange.start,
    periodEnd: filters.dateRange.end,
    scenario,
  })

  const tco = analysis?.tco ?? null

  return (
    <div className="px-8 py-6 max-w-5xl space-y-6">
      <BusinessPageHeader
        title="Scenario Modeler"
        subtitle="Model Glean vs. competitor total cost under different adoption, pricing, and staffing assumptions. Adjust inputs to build a finance-ready business case."
      />

      {/* Competitor picker */}
      <div>
        <p className="text-sm font-semibold text-glean-text-primary mb-3">Compare against</p>
        <div className="grid grid-cols-2 gap-3">
          {(Object.values(COMPETITORS)).map(comp => (
            <button
              key={comp.id}
              onClick={() => setScenario({ competitorId: comp.id as CompetitorId })}
              className={`
                text-left card transition-all hover:shadow-card-hover
                ${scenario.competitorId === comp.id ? 'ring-2 ring-glean-blue border-glean-blue' : ''}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: comp.color }} />
                <p className="font-semibold text-glean-text-primary text-sm">{comp.label}</p>
              </div>
              <p className="text-xs text-glean-text-tertiary">{comp.coveragePct}% stack coverage · {comp.gaps.length} known gaps</p>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario sliders */}
      <div className="card">
        <h3 className="text-sm font-semibold text-glean-text-primary mb-4">Assumptions</h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Licensed seats', key: 'licensedSeats' as const, min: 100, max: 5000, step: 50, format: (v: number) => v.toLocaleString() },
            { label: 'Adoption rate', key: 'adoptionPct' as const, min: 10, max: 100, step: 5, format: (v: number) => `${v}%` },
            { label: 'Burdened hourly rate', key: 'hourlyRateUsd' as const, min: 35, max: 120, step: 1, format: (v: number) => `$${v}/hr` },
            { label: 'Shadow AI tool spend', key: 'shadowToolBudgetUsd' as const, min: 0, max: 500_000, step: 5000, format: (v: number) => formatCurrency(v) },
            { label: 'DIY engineering FTE', key: 'diyFteCount' as const, min: 0, max: 5, step: 0.5, format: (v: number) => `${v} FTE` },
          ].map(input => (
            <div key={input.key}>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="text-glean-text-secondary">{input.label}</label>
                <span className="font-semibold text-glean-text-primary">{input.format(scenario[input.key] as number)}</span>
              </div>
              <input
                type="range"
                min={input.min}
                max={input.max}
                step={input.step}
                value={scenario[input.key] as number}
                onChange={e => setScenario({ [input.key]: parseFloat(e.target.value) })}
                className="w-full accent-glean-blue"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Live results */}
      {tco && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card border-t-4 border-t-emerald-500 text-center">
            <p className="text-xs text-glean-text-secondary mb-1">Annual TCO savings</p>
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(tco.savingsVsCompetitorUsd)}</p>
            <p className="text-xs text-glean-text-tertiary mt-1">{tco.savingsPct}% vs. {tco.competitor.shortLabel}</p>
          </div>
          <div className="card border-t-4 border-t-glean-blue text-center">
            <p className="text-xs text-glean-text-secondary mb-1">Glean net annual value</p>
            <p className="text-3xl font-bold text-glean-blue">{formatCurrency(tco.glean.netValueAnnualUsd)}</p>
            <p className="text-xs text-glean-text-tertiary mt-1">productivity − hard costs</p>
          </div>
          <div className="card border-t-4 border-t-violet-500 text-center">
            <p className="text-xs text-glean-text-secondary mb-1">Breakeven</p>
            <p className="text-3xl font-bold text-violet-600">
              {tco.breakevenMonths ? `${tco.breakevenMonths} mo` : 'N/A'}
            </p>
            <p className="text-xs text-glean-text-tertiary mt-1">hard-cost breakeven vs. competitor</p>
          </div>
        </div>
      )}

      <TCOComparisonChart tco={tco} isLoading={isLoading} />

      <div className="grid grid-cols-2 gap-4">
        <ThreeYearTCOChart tco={tco} isLoading={isLoading} />
        <div className="card">
          <h3 className="text-sm font-semibold text-glean-text-primary mb-3">Competitor gaps</h3>
          <p className="text-xs text-glean-text-tertiary mb-3">
            Known limitations of {tco?.competitor.label ?? 'selected competitor'}
          </p>
          <ul className="space-y-2">
            {(tco?.competitor.gaps ?? []).map(gap => (
              <li key={gap} className="text-sm text-glean-text-secondary flex gap-2">
                <span className="text-amber-500">⚠</span> {gap}
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-glean-border">
            <p className="text-xs font-semibold text-glean-text-secondary mb-2">Competitor strengths</p>
            <ul className="space-y-1">
              {(tco?.competitor.strengths ?? []).map(s => (
                <li key={s} className="text-xs text-glean-text-tertiary">+ {s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <TCOLineItemsTable
        lineItems={tco?.lineItems ?? []}
        gleanTotal={tco?.glean.totalCostAnnualUsd ?? 0}
        competitorTotal={tco?.competitorCosts.totalCostAnnualUsd ?? 0}
        competitorLabel={tco?.competitor.shortLabel ?? 'Competitor'}
        isLoading={isLoading}
      />

      <p className="text-[10px] text-glean-text-tertiary">
        Inference costs derived from actual Assistant & Agents usage in the selected period, annualized.
        Competitor inference assumes frontier-only routing at {tco?.competitor.inferenceCostMultiplier ?? '—'}× Glean Model Hub spend.
        Productivity value uses Forrester TEI benchmarks with risk adjustment.
      </p>
    </div>
  )
}
