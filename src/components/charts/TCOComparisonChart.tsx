import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { TCOComparisonResult } from '@/types/tco'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface TCOComparisonChartProps {
  tco: TCOComparisonResult | null
  isLoading?: boolean
}

export function TCOComparisonChart({ tco, isLoading }: TCOComparisonChartProps) {
  if (isLoading || !tco) return <Skeleton className="h-80 w-full rounded-xl" />

  const data = [
    {
      vendor: 'Glean',
      platform: tco.glean.platformAnnualUsd,
      inference: tco.glean.inferenceAnnualUsd,
      people: tco.glean.adminAnnualUsd,
      total: tco.glean.totalCostAnnualUsd,
    },
    {
      vendor: tco.competitor.shortLabel,
      platform: tco.competitorCosts.platformAnnualUsd,
      inference: tco.competitorCosts.inferenceAnnualUsd,
      people: tco.competitorCosts.peopleAnnualUsd + tco.competitorCosts.supplementalAnnualUsd + tco.competitorCosts.infraAnnualUsd,
      total: tco.competitorCosts.totalCostAnnualUsd,
    },
  ]

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-glean-text-primary">Annual total cost of ownership</h3>
        <p className="text-sm text-glean-text-secondary">
          Hard costs for Glean vs. {tco.competitor.label} · {tco.activeSeats.toLocaleString()} active seats
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
          <XAxis dataKey="vendor" tick={{ fontSize: 12, fill: '#5F6368' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#9AA0A6' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatCurrency(v)}
          />
          <Tooltip
            formatter={(v: number, name: string) => {
              const labels: Record<string, string> = {
                platform: 'Platform',
                inference: 'LLM inference',
                people: 'People & infra',
              }
              return [formatCurrency(v), labels[name] ?? name]
            }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v: string) => ({
            platform: 'Platform',
            inference: 'LLM inference',
            people: 'People & infra',
          }[v] ?? v)} />
          <Bar dataKey="platform" stackId="a" fill="#1A73E8" />
          <Bar dataKey="inference" stackId="a" fill="#7C4DFF" />
          <Bar dataKey="people" stackId="a" fill="#9AA0A6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-glean-text-tertiary mt-3 text-center">
        Glean saves {formatCurrency(tco.savingsVsCompetitorUsd)}/yr ({tco.savingsPct}%) vs. {tco.competitor.shortLabel} on hard costs
      </p>
    </div>
  )
}
