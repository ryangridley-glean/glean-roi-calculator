import type { WaldoSavingsResult } from '@/lib/waldoValue'
import { formatCurrency, formatNumber, formatTokens } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface WaldoSavingsCardProps {
  savings: WaldoSavingsResult | null
  isLoading?: boolean
}

export function WaldoSavingsCard({ savings, isLoading }: WaldoSavingsCardProps) {
  if (isLoading || !savings) {
    return (
      <div className="card border-t-4 border-t-emerald-500 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-4 gap-6">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      </div>
    )
  }

  const metrics = [
    {
      label: 'Frontier tokens diverted',
      value: formatTokens(savings.frontierTokensDiverted),
      sub: 'tokens kept off GPT-5.5 & Opus 4.8',
      color: 'text-emerald-600',
    },
    {
      label: 'Net token cost saved',
      value: formatCurrency(savings.netCostSavedUsd),
      sub: `after Waldo cost (${formatCurrency(savings.waldoCostUsd)})`,
      color: 'text-glean-blue',
    },
    {
      label: 'Savings rate',
      value: `${savings.savingsRatePct}%`,
      sub: 'vs. frontier-only baseline',
      color: 'text-violet-600',
    },
    {
      label: 'Waldo queries handled',
      value: formatNumber(savings.waldoEligibleQueries),
      sub: 'Assistant + Agents in period',
      color: 'text-amber-600',
    },
  ]

  return (
    <div className="card border-t-4 border-t-emerald-500">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-glean-text-primary">Waldo Token Savings</h3>
        <span className="text-xs text-glean-text-tertiary">
          Waldo orchestration · frontier model offset
        </span>
      </div>

      <div className="grid grid-cols-4 gap-6 divide-x divide-glean-border">
        {metrics.map((m, i) => (
          <div key={m.label} className={i > 0 ? 'pl-6' : ''}>
            <p className="text-xs font-medium text-glean-text-secondary mb-2">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color} mb-1`}>{m.value}</p>
            <p className="text-xs text-glean-text-tertiary">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-glean-border grid grid-cols-2 gap-4 text-xs">
        {savings.breakdown.map(row => (
          <div key={row.modelId} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-glean-text-secondary">
              {row.label} <span className="text-glean-text-tertiary">({Math.round(row.share * 100)}%)</span>
            </span>
            <div className="text-right">
              <p className="font-semibold text-glean-text-primary">{formatTokens(row.divertedTotalTokens)} diverted</p>
              <p className="text-emerald-600">{formatCurrency(row.baselineCostUsd - row.actualCostUsd)} saved</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
