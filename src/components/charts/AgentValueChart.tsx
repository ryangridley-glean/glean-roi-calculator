import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import type { AgentROI } from '@/types/agents'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface AgentValueChartProps {
  agentROIs: AgentROI[]
  isLoading?: boolean
}

const COLORS = ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE']

export function AgentValueChart({ agentROIs, isLoading }: AgentValueChartProps) {
  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />

  const data = agentROIs.map(r => ({
    name: r.useCase.name,
    value: r.netBenefitUsd,
  }))

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-glean-text-primary">Net benefit by agent</h3>
          <p className="text-sm text-glean-text-tertiary">Annual value generated minus agent operating costs</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={agentROIs.length * 52 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#9AA0A6' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatCurrency(v)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#3C4043' }}
            tickLine={false}
            axisLine={false}
            width={200}
          />
          <Tooltip
            formatter={(v: number) => [formatCurrency(v), 'Net Benefit']}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #E8EAED',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
