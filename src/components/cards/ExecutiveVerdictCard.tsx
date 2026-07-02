import type { ExecutiveSummaryResult } from '@/types/tco'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface ExecutiveVerdictCardProps {
  summary: ExecutiveSummaryResult | null
  isLoading?: boolean
}

const VERDICT_CONFIG = {
  strong: {
    label: 'Strong business case',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-600 text-white',
    text: 'text-emerald-900',
  },
  positive: {
    label: 'Positive ROI',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-glean-blue text-white',
    text: 'text-blue-900',
  },
  review: {
    label: 'Review assumptions',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-500 text-white',
    text: 'text-amber-900',
  },
}

export function ExecutiveVerdictCard({ summary, isLoading }: ExecutiveVerdictCardProps) {
  if (isLoading || !summary) {
    return <Skeleton className="h-36 w-full rounded-xl" />
  }

  const cfg = VERDICT_CONFIG[summary.recommendation]
  const m = summary.headlineMetrics

  return (
    <div className={`rounded-xl border p-6 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${cfg.badge}`}>
            {cfg.label}
          </span>
          <h2 className={`text-xl font-semibold ${cfg.text}`}>
            Glean vs. {summary.tco.competitor.shortLabel}: {formatCurrency(m.tcoSavingsAnnualUsd)} annual TCO advantage
          </h2>
          <p className={`text-sm mt-2 ${cfg.text} opacity-90`}>
            {summary.companyName} · {summary.periodLabel} · Includes {formatCurrency(m.consolidationSavingsUsd)} tool consolidation + {formatCurrency(m.waldoSavingsAnnualUsd)} Waldo inference savings
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-glean-text-secondary uppercase tracking-wide">Net annual value</p>
          <p className="text-3xl font-bold text-emerald-700">{formatCurrency(m.netValueAnnualUsd)}</p>
          <p className="text-xs text-glean-text-tertiary mt-1">productivity − platform cost</p>
        </div>
      </div>
    </div>
  )
}
