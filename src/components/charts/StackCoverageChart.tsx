import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { STACK_COVERAGE } from '@/constants/competitors'
import { Skeleton } from '@/components/ui/Skeleton'

interface StackCoverageChartProps {
  competitorLabel: string
  competitorColor: string
  isLoading?: boolean
}

export function StackCoverageChart({ competitorLabel, competitorColor, isLoading }: StackCoverageChartProps) {
  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />

  const data = STACK_COVERAGE.map(row => ({
    source: row.source.length > 28 ? `${row.source.slice(0, 26)}…` : row.source,
    fullSource: row.source,
    glean: row.gleanPct,
    competitor: row.competitorPct,
  }))

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-glean-text-primary">Enterprise stack coverage</h3>
        <p className="text-sm text-glean-text-secondary">
          Permission-aware retrieval across data sources · Glean vs. {competitorLabel}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(280, data.length * 34)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9AA0A6' }} tickFormatter={(v: number) => `${v}%`} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="source" width={160} tick={{ fontSize: 11, fill: '#5F6368' }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: number, name: string) => [`${v}%`, name === 'glean' ? 'Glean' : competitorLabel]}
            labelFormatter={(_: string, payload) => payload?.[0]?.payload?.fullSource ?? ''}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v: string) => v === 'glean' ? 'Glean' : competitorLabel} />
          <Bar dataKey="glean" name="glean" fill="#1A73E8" radius={[0, 2, 2, 0]} barSize={10} />
          <Bar dataKey="competitor" name="competitor" fill={competitorColor} radius={[0, 2, 2, 0]} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
