import type { ROIResult } from '@/lib/roi'
import { formatCurrency, formatHours } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface ROISummaryCardProps {
  roi: ROIResult | null
  hourlyRate: number
  riskAdjPct: number
  isLoading?: boolean
}

export function ROISummaryCard({ roi, hourlyRate, riskAdjPct, isLoading }: ROISummaryCardProps) {
  if (isLoading || !roi) {
    return (
      <div className="card border-t-4 border-t-glean-blue space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-4 gap-6">
          {[0,1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      </div>
    )
  }

  const metrics = [
    {
      label: 'Hours Saved (risk-adj.)',
      value: formatHours(roi.totalHoursSaved),
      sub: `Gross: ${formatHours(roi.grossHoursSaved)}`,
      color: 'text-glean-blue',
    },
    {
      label: 'Value Generated (risk-adj.)',
      value: formatCurrency(roi.totalDollarValue),
      sub: `@ $${hourlyRate}/hr · ${riskAdjPct}% risk adj.`,
      color: 'text-emerald-600',
    },
    {
      label: 'FTE Equivalent',
      value: `${roi.fteEquivalent}`,
      sub: 'full-time employees reclaimed',
      color: 'text-amber-600',
    },
    {
      label: 'ROI Multiplier',
      value: roi.roiMultiplier ? `${roi.roiMultiplier}×` : '—',
      sub: roi.roiMultiplier ? 'return on contract value' : 'Enter contract value below',
      color: roi.roiMultiplier ? 'text-violet-600' : 'text-glean-text-tertiary',
    },
  ]

  return (
    <div className="card border-t-4 border-t-glean-blue">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-glean-text-primary">ROI Summary</h3>
        <span className="text-xs text-glean-text-tertiary">
          Forrester Research benchmarks · {riskAdjPct}% risk adjustment applied
        </span>
      </div>

      <div className="grid grid-cols-4 gap-6 divide-x divide-glean-border">
        {metrics.map((m, i) => (
          <div key={i} className={i > 0 ? 'pl-6' : ''}>
            <p className="text-xs font-medium text-glean-text-secondary mb-2">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color} mb-1`}>{m.value}</p>
            <p className="text-xs text-glean-text-tertiary">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Per-activity risk-adjusted breakdown */}
      <div className="mt-5 pt-4 border-t border-glean-border grid grid-cols-3 gap-4 text-xs">
        {[
          { icon: '🔍', label: 'Search', hrs: roi.breakdown.searchHoursAdj, dollars: roi.breakdown.searchDollarsAdj },
          { icon: '💬', label: 'Chat / Assistant', hrs: roi.breakdown.chatHoursAdj, dollars: roi.breakdown.chatDollarsAdj },
          { icon: '🤖', label: 'Agents', hrs: roi.breakdown.agentHoursAdj, dollars: roi.breakdown.agentDollarsAdj },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-glean-text-secondary">{row.icon} {row.label}</span>
            <div className="text-right">
              <p className="font-semibold text-glean-text-primary">{formatHours(row.hrs)}</p>
              <p className="text-emerald-600">{formatCurrency(row.dollars)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
