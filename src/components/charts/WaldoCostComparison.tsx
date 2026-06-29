import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { WaldoSavingsResult } from '@/lib/waldoValue'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface WaldoCostComparisonProps {
  savings: WaldoSavingsResult | null
  isLoading?: boolean
}

export function WaldoCostComparison({ savings, isLoading }: WaldoCostComparisonProps) {
  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />
  if (!savings) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-72 flex items-center justify-center">
        <p className="text-sm text-gray-500">No Waldo savings data for this period.</p>
      </div>
    )
  }

  const data = [
    {
      scenario: 'Without Waldo',
      frontier: savings.baselineFrontierCostUsd,
      waldo: 0,
      total: savings.baselineFrontierCostUsd,
    },
    {
      scenario: 'With Waldo',
      frontier: savings.actualFrontierCostUsd,
      waldo: savings.waldoCostUsd,
      total: savings.totalWithWaldoCostUsd,
    },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Token cost: with vs. without Waldo</h3>
        <p className="text-sm text-gray-500">
          Frontier model spend plus Waldo inference cost for the selected period
        </p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
          <XAxis dataKey="scenario" tick={{ fontSize: 12, fill: '#5F6368' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#9AA0A6' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatCurrency(v)}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              formatCurrency(v),
              name === 'frontier' ? 'Frontier models' : 'Waldo',
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => value === 'frontier' ? 'Frontier models' : 'Waldo'}
          />
          <Bar dataKey="frontier" stackId="a" fill="#6366F1" />
          <Bar dataKey="waldo" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Net savings: {formatCurrency(savings.netCostSavedUsd)} ({savings.savingsRatePct}% reduction)
      </p>
    </div>
  )
}
