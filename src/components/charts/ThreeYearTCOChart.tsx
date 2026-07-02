import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { TCOComparisonResult } from '@/types/tco'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface ThreeYearTCOChartProps {
  tco: TCOComparisonResult | null
  isLoading?: boolean
}

export function ThreeYearTCOChart({ tco, isLoading }: ThreeYearTCOChartProps) {
  if (isLoading || !tco) return <Skeleton className="h-72 w-full rounded-xl" />

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-glean-text-primary">3-year cumulative TCO</h3>
        <p className="text-sm text-glean-text-secondary">
          Projected hard-cost spend if usage and pricing hold steady
        </p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={tco.threeYear} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#5F6368' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#9AA0A6' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatCurrency(v)}
          />
          <Tooltip
            formatter={(v: number) => formatCurrency(v)}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="glean" name="Glean" fill="#1A73E8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="competitor" name={tco.competitor.shortLabel} fill={tco.competitor.color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-glean-text-tertiary mt-3 text-center">
        3-year delta: {formatCurrency(tco.threeYear[2].competitor - tco.threeYear[2].glean)} saved with Glean
      </p>
    </div>
  )
}
