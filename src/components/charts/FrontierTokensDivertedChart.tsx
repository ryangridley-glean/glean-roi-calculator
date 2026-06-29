import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { WaldoSavingsResult } from '@/lib/waldoValue'
import { formatTokens } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface FrontierTokensDivertedChartProps {
  savings: WaldoSavingsResult | null
  isLoading?: boolean
}

export function FrontierTokensDivertedChart({ savings, isLoading }: FrontierTokensDivertedChartProps) {
  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />
  if (!savings) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-72 flex items-center justify-center">
        <p className="text-sm text-gray-500">No Waldo savings data for this period.</p>
      </div>
    )
  }

  const data = savings.breakdown.map(row => ({
    model: row.label.replace('Claude ', ''),
    diverted: row.divertedTotalTokens,
    input: row.divertedInputTokens,
    output: row.divertedOutputTokens,
  }))

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Frontier tokens diverted by model</h3>
        <p className="text-sm text-gray-500">
          Tokens that would have gone to frontier models but were avoided via Waldo orchestration
        </p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
          <XAxis dataKey="model" tick={{ fontSize: 12, fill: '#5F6368' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#9AA0A6' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatTokens(v)}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              formatTokens(v),
              name === 'input' ? 'Input diverted' : 'Output diverted',
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => value === 'input' ? 'Input tokens' : 'Output tokens'}
          />
          <Bar dataKey="input" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="output" stackId="a" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
