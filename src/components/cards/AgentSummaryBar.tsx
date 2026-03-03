import type { AgentROI } from '@/types/agents'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface AgentSummaryBarProps {
  agentROIs: AgentROI[]
  isLoading?: boolean
  analysisWeeks: number
}

export function AgentSummaryBar({ agentROIs, isLoading, analysisWeeks }: AgentSummaryBarProps) {
  if (isLoading || agentROIs.length === 0) {
    return (
      <div className="card border-t-4 border-t-violet-500 space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-4 gap-6">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      </div>
    )
  }

  const totalValue = agentROIs.reduce((s, r) => s + r.annualValueUsd, 0)
  const totalNetBenefit = agentROIs.reduce((s, r) => s + r.netBenefitUsd, 0)
  const totalProjectedRuns = agentROIs.reduce((s, r) => s + r.annualRunsTotal, 0)

  const metrics = [
    {
      label: 'Active Agents',
      value: String(agentROIs.length),
      sub: 'use cases deployed',
      color: 'text-glean-blue',
    },
    {
      label: 'Value Generated',
      value: formatCurrency(totalValue),
      sub: `${analysisWeeks} week period`,
      color: 'text-emerald-600',
    },
    {
      label: 'Net Benefit',
      value: formatCurrency(totalNetBenefit),
      sub: 'net time-savings value',
      color: 'text-violet-600',
    },
    {
      label: 'Projected Runs',
      value: totalProjectedRuns.toLocaleString(),
      sub: `${analysisWeeks} week period`,
      color: 'text-amber-600',
    },
  ]

  return (
    <div className="card border-t-4 border-t-violet-500">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-glean-text-primary">Agent ROI Summary</h3>
        <span className="text-xs text-glean-text-tertiary">
          {analysisWeeks} week analysis window
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
    </div>
  )
}
