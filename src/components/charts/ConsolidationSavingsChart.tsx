import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { ConsolidationItem } from '@/types/tco'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface ConsolidationSavingsChartProps {
  items: ConsolidationItem[]
  totalAnnualUsd: number
  isLoading?: boolean
}

export function ConsolidationSavingsChart({ items, totalAnnualUsd, isLoading }: ConsolidationSavingsChartProps) {
  if (isLoading) return <Skeleton className="h-80 w-full rounded-xl" />

  const data = items.map(item => ({
    tool: item.tool.length > 22 ? `${item.tool.slice(0, 20)}…` : item.tool,
    fullTool: item.tool,
    saved: Math.round(item.annualSpendUsd * (item.reductionPct / 100)),
  })).sort((a, b) => b.saved - a.saved)

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-glean-text-primary">Tool consolidation savings</h3>
        <p className="text-sm text-glean-text-secondary">
          Overlapping spend Glean replaces or reduces · {formatCurrency(totalAnnualUsd)}/yr total
        </p>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#9AA0A6' }} tickFormatter={(v: number) => formatCurrency(v)} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="tool" width={120} tick={{ fontSize: 11, fill: '#5F6368' }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: number) => [formatCurrency(v), 'Annual savings']}
            labelFormatter={(_: string, payload) => payload?.[0]?.payload?.fullTool ?? ''}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Bar dataKey="saved" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#10B981' : '#34D399'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
