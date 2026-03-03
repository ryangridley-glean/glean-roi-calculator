import type { ROIResult } from '@/lib/roi'
import { BENCHMARKS } from '@/constants/benchmarks'
import { formatHours, formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface TimeSavedBarProps {
  roi: ROIResult | null
  isLoading?: boolean
}

export function TimeSavedBar({ roi, isLoading }: TimeSavedBarProps) {
  if (isLoading || !roi) return <Skeleton className="h-40 w-full" />

  const grossMinutes =
    roi.breakdown.searchMinutes + roi.breakdown.chatMinutes + roi.breakdown.agentMinutes || 1

  const segments = [
    {
      label: 'Search',
      minutes: roi.breakdown.searchMinutes,
      hoursAdj: roi.breakdown.searchHoursAdj,
      dollarsAdj: roi.breakdown.searchDollarsAdj,
      color: 'bg-glean-blue',
      textColor: 'text-glean-blue',
      benchmark: `${BENCHMARKS.minutesSavedPerSearch} min/query`,
      source: 'Forrester',
    },
    {
      label: 'Chat / Assistant',
      minutes: roi.breakdown.chatMinutes,
      hoursAdj: roi.breakdown.chatHoursAdj,
      dollarsAdj: roi.breakdown.chatDollarsAdj,
      color: 'bg-glean-indigo',
      textColor: 'text-glean-indigo',
      benchmark: `${BENCHMARKS.minutesSavedPerChat} min/session`,
      source: 'Forrester',
    },
    {
      label: 'Agents',
      minutes: roi.breakdown.agentMinutes,
      hoursAdj: roi.breakdown.agentHoursAdj,
      dollarsAdj: roi.breakdown.agentDollarsAdj,
      color: 'bg-glean-violet',
      textColor: 'text-glean-violet',
      benchmark: `${BENCHMARKS.minutesSavedPerAgentRun} min/run`,
      source: 'Internal est.',
    },
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-glean-text-primary">Time saved by activity</h3>
        <div className="text-xs text-glean-text-tertiary space-x-3">
          <span>Risk-adjusted: <strong className="text-glean-text-primary">{formatHours(roi.totalHoursSaved)}</strong></span>
          <span>Gross: <strong className="text-glean-text-secondary">{formatHours(roi.grossHoursSaved)}</strong></span>
        </div>
      </div>

      {/* Segmented bar — proportions based on gross minutes */}
      <div className="flex h-4 rounded-full overflow-hidden mb-5 gap-0.5">
        {segments.map(seg => (
          <div
            key={seg.label}
            className={`${seg.color} transition-all duration-500`}
            style={{ width: `${(seg.minutes / grossMinutes) * 100}%` }}
          />
        ))}
      </div>

      {/* Per-activity cards showing risk-adjusted values */}
      <div className="grid grid-cols-3 gap-4">
        {segments.map(seg => (
          <div key={seg.label} className="text-center">
            <div className={`inline-block w-3 h-3 rounded-sm ${seg.color} mb-2`} />
            <p className="text-xs font-semibold text-glean-text-primary">{seg.label}</p>
            <p className={`text-lg font-bold ${seg.textColor}`}>{formatHours(seg.hoursAdj)}</p>
            <p className="text-xs text-emerald-600 font-medium">{formatCurrency(seg.dollarsAdj)}</p>
            <p className="text-[10px] text-glean-text-tertiary mt-1">
              {seg.benchmark}
              <span className="ml-1 text-glean-text-tertiary opacity-70">· {seg.source}</span>
            </p>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-glean-text-tertiary mt-4 pt-3 border-t border-glean-border">
        Values shown are risk-adjusted ({Math.round(BENCHMARKS.riskAdjustment * 100)}% reduction applied, Glean standard).
        Source: Forrester Research Total Economic Impact™ study.
      </p>
    </div>
  )
}
