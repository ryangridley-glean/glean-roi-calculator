import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, LabelList, ResponsiveContainer,
} from 'recharts'
import type { DailySnapshot } from '@/types/metrics'
import { formatShortDate } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

type Tab = 'Search' | 'Assistant' | 'Agents'

interface TotalInteractionsByProductProps {
  snapshots: DailySnapshot[]
  isLoading?: boolean
}

function downsample(snapshots: DailySnapshot[], maxPoints = 30): DailySnapshot[] {
  if (snapshots.length <= maxPoints) return snapshots
  const step = Math.ceil(snapshots.length / maxPoints)
  return snapshots.filter((_, i) => i % step === 0)
}

const BAR_COLOR = '#3B3BCC'

export function TotalInteractionsByProduct({ snapshots, isLoading }: TotalInteractionsByProductProps) {
  const [tab, setTab] = useState<Tab>('Search')

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />

  const keyMap: Record<Tab, keyof DailySnapshot> = {
    Search:    'searchQueries',
    Assistant: 'chatSessions',
    Agents:    'agentRuns',
  }

  const data = downsample(snapshots).map(s => ({
    date: formatShortDate(s.date),
    value: s[keyMap[tab]] as number,
  }))

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Total interactions by product</h3>
          <p className="text-sm text-gray-500">Total number of interactions for selected product over time</p>
        </div>
        {/* Search / Assistant / Agents tab toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
          {(['Search', 'Assistant', 'Agents'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 font-medium transition-colors ${
                tab === t
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 16, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: number) => [v.toLocaleString(), tab]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="value" fill={BAR_COLOR} radius={[2, 2, 0, 0]}>
            <LabelList
              dataKey="value"
              position="inside"
              style={{ fill: '#fff', fontSize: 10, fontWeight: 600 }}
              formatter={(v: number) => v > 100 ? v.toLocaleString() : ''}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
