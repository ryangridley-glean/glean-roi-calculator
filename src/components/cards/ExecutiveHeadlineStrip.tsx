import type { ExecutiveSummaryResult } from '@/types/tco'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface ExecutiveHeadlineStripProps {
  summary: ExecutiveSummaryResult | null
  isLoading?: boolean
}

export function ExecutiveHeadlineStrip({ summary, isLoading }: ExecutiveHeadlineStripProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    )
  }

  const m = summary.headlineMetrics
  const metrics = [
    { label: 'TCO savings vs. competitor', value: formatCurrency(m.tcoSavingsAnnualUsd), sub: `vs. ${summary.tco.competitor.shortLabel}`, color: 'text-emerald-600' },
    { label: 'Productivity value (net)', value: formatCurrency(m.netValueAnnualUsd), sub: 'annual, risk-adjusted', color: 'text-glean-blue' },
    { label: 'ROI multiplier', value: m.roiMultiplier ? `${m.roiMultiplier}×` : '—', sub: 'return on contract', color: 'text-violet-600' },
    { label: 'FTE equivalent', value: String(m.fteEquivalent), sub: 'hours reclaimed', color: 'text-amber-600' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map(metric => (
        <div key={metric.label} className="card border-l-4 border-l-glean-blue">
          <p className="text-xs font-medium text-glean-text-secondary mb-2">{metric.label}</p>
          <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
          <p className="text-xs text-glean-text-tertiary mt-1">{metric.sub}</p>
        </div>
      ))}
    </div>
  )
}
