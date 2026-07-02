import { useState } from 'react'
import { useFilters } from '@/store/FilterContext'
import { useMetrics } from '@/store/hooks/useMetrics'
import { useWaldoSavings } from '@/store/hooks/useWaldoSavings'
import { useScenarioModel, useTCOAnalysis } from '@/store/hooks/useTCOAnalysis'
import { BusinessPageHeader } from '@/components/layout/BusinessPageHeader'
import { TCOComparisonChart } from '@/components/charts/TCOComparisonChart'
import { TCOLineItemsTable } from '@/components/cards/TCOLineItemsTable'
import { ConsolidationSavingsChart } from '@/components/charts/ConsolidationSavingsChart'
import { StackCoverageChart } from '@/components/charts/StackCoverageChart'
import { formatCurrency } from '@/lib/formatters'

type Tab = 'tco' | 'consolidation' | 'coverage'

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: 'tco', label: 'TCO breakdown', description: 'Line-item cost comparison vs. selected competitor' },
  { id: 'consolidation', label: 'Tool consolidation', description: 'Overlapping tools and shadow IT Glean replaces' },
  { id: 'coverage', label: 'Stack coverage', description: 'Enterprise data source reach — Glean vs. suite-only AI' },
]

export function CompetitiveAnalysisPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tco')
  const tab = TABS.find(t => t.id === activeTab)!

  const { filters } = useFilters()
  const { data, isLoading } = useMetrics(filters)
  const waldoSavings = useWaldoSavings(data?.summary)

  const [contractValue] = useState<number | null>(() => {
    const saved = localStorage.getItem('glean_contract_value')
    return saved ? parseFloat(saved) : null
  })

  const defaultSeats = data?.contract.licensedSeats ?? 1000
  const { scenario } = useScenarioModel(defaultSeats)
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
        title="Competitive Analysis"
        subtitle="Detailed cost, consolidation, and coverage comparison for procurement and architecture reviews."
      />

      <div className="flex border-b border-glean-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`
              px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
              ${activeTab === t.id
                ? 'border-glean-blue text-glean-blue'
                : 'border-transparent text-glean-text-secondary hover:text-glean-text-primary'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-glean-text-secondary">{tab.description}</p>

      {activeTab === 'tco' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-xs text-glean-text-secondary">Glean annual TCO</p>
              <p className="text-2xl font-bold text-glean-blue mt-1">{formatCurrency(tco?.glean.totalCostAnnualUsd ?? 0)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-glean-text-secondary">{tco?.competitor.shortLabel} annual TCO</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(tco?.competitorCosts.totalCostAnnualUsd ?? 0)}</p>
            </div>
            <div className="card text-center border-t-4 border-t-emerald-500">
              <p className="text-xs text-glean-text-secondary">Your advantage</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(tco?.savingsVsCompetitorUsd ?? 0)}</p>
            </div>
          </div>
          <TCOComparisonChart tco={tco} isLoading={isLoading} />
          <TCOLineItemsTable
            lineItems={tco?.lineItems ?? []}
            gleanTotal={tco?.glean.totalCostAnnualUsd ?? 0}
            competitorTotal={tco?.competitorCosts.totalCostAnnualUsd ?? 0}
            competitorLabel={tco?.competitor.shortLabel ?? 'Competitor'}
            isLoading={isLoading}
          />
        </div>
      )}

      {activeTab === 'consolidation' && (
        <div className="space-y-4">
          <div className="card border-t-4 border-t-emerald-500">
            <p className="text-xs text-glean-text-secondary">Total consolidation savings</p>
            <p className="text-4xl font-bold text-emerald-600 mt-1">
              {formatCurrency(analysis?.consolidation.totalAnnualUsd ?? 0)}
              <span className="text-base font-normal text-glean-text-tertiary ml-2">/ year</span>
            </p>
            <p className="text-sm text-glean-text-secondary mt-2">
              Glean replaces point solutions for search, AI chat, and DIY RAG — reducing duplicate license and services spend.
            </p>
          </div>
          <ConsolidationSavingsChart
            items={analysis?.consolidation.items ?? []}
            totalAnnualUsd={analysis?.consolidation.totalAnnualUsd ?? 0}
            isLoading={isLoading}
          />
          <div className="card">
            <h3 className="text-sm font-semibold text-glean-text-primary mb-3">Consolidation detail</h3>
            <div className="space-y-2">
              {(analysis?.consolidation.items ?? []).map(item => (
                <div key={item.id} className="flex items-center justify-between bg-glean-surface rounded-lg px-3 py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-glean-text-primary">{item.tool}</p>
                    <p className="text-xs text-glean-text-tertiary">{item.category} → {item.replacedBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">
                      {formatCurrency(Math.round(item.annualSpendUsd * (item.reductionPct / 100)))}
                    </p>
                    <p className="text-[10px] text-glean-text-tertiary">{item.reductionPct}% reduced</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coverage' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center">
              <p className="text-xs text-glean-text-secondary">Glean avg. coverage</p>
              <p className="text-4xl font-bold text-glean-blue mt-1">91%</p>
              <p className="text-xs text-glean-text-tertiary mt-1">permission-aware across sources</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-glean-text-secondary">{tco?.competitor.shortLabel} avg. coverage</p>
              <p className="text-4xl font-bold mt-1" style={{ color: tco?.competitor.color }}>{tco?.competitor.coveragePct}%</p>
              <p className="text-xs text-glean-text-tertiary mt-1">suite-native sources only</p>
            </div>
          </div>
          <StackCoverageChart
            competitorLabel={tco?.competitor.shortLabel ?? 'Competitor'}
            competitorColor={tco?.competitor.color ?? '#6B7280'}
            isLoading={isLoading}
          />
          <div className="card bg-amber-50 border-amber-200">
            <p className="text-sm font-semibold text-amber-900 mb-2">Why coverage matters for TCO</p>
            <p className="text-sm text-amber-800">
              Suite-only AI tools ({tco?.competitor.label}) leave gaps across CRM, support, and dev systems —
              forcing supplemental search licenses, custom integrations, and shadow AI spend.
              Glean&apos;s unified index reduces those hidden costs in the TCO model above.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
