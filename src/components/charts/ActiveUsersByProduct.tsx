import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import type { DailySnapshot } from '@/types/metrics'
import { formatShortDate } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

type Window = 'MAU' | 'WAU' | 'DAU'

interface ActiveUsersByProductProps {
  snapshots: DailySnapshot[]
  isLoading?: boolean
}

function downsample(snapshots: DailySnapshot[], maxPoints = 60): DailySnapshot[] {
  if (snapshots.length <= maxPoints) return snapshots
  const step = Math.ceil(snapshots.length / maxPoints)
  return snapshots.filter((_, i) => i % step === 0)
}

const COLORS = {
  Search:    '#3B3BCC',
  Assistant: '#6B7A1A',
  Agents:    '#CC44CC',
}

export function ActiveUsersByProduct({ snapshots, isLoading }: ActiveUsersByProductProps) {
  const [window, setWindow] = useState<Window>('MAU')

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />

  const factor = window === 'MAU' ? 1 : window === 'WAU' ? 0.45 : 0.15

  const data = downsample(snapshots).map(s => {
    const base = window === 'MAU' ? s.mau : window === 'WAU' ? s.wau : s.activeUsers
    return {
      date: formatShortDate(s.date),
      Search:    Math.round(base * 0.88),
      Assistant: Math.round(base * 0.38),
      Agents:    Math.round(base * 0.14),
    }
  })

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Active Users by product</h3>
          <p className="text-sm text-gray-500">Number of active users for each product over time</p>
        </div>
        {/* MAU / WAU / DAU toggle — matches Glean's outlined pill buttons */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
          {(['MAU', 'WAU', 'DAU'] as Window[]).map(w => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className={`px-3 py-1.5 font-medium transition-colors ${
                window === w
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 16, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Line type="monotone" dataKey="Search"    stroke={COLORS.Search}    strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Assistant" stroke={COLORS.Assistant} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Agents"    stroke={COLORS.Agents}    strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
