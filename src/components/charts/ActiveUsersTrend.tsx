import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import type { DailySnapshot } from '@/types/metrics'
import { formatShortDate } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface ActiveUsersTrendProps {
  snapshots: DailySnapshot[]
  isLoading?: boolean
}

function downsample(snapshots: DailySnapshot[], maxPoints = 60): DailySnapshot[] {
  if (snapshots.length <= maxPoints) return snapshots
  const step = Math.ceil(snapshots.length / maxPoints)
  return snapshots.filter((_, i) => i % step === 0)
}

// Matches Glean's chart colors exactly
const COLORS = {
  dau: '#CC44CC',   // magenta/purple
  wau: '#6B7A1A',   // olive green
  mau: '#3B3BCC',   // blue/indigo
}

export function ActiveUsersTrend({ snapshots, isLoading }: ActiveUsersTrendProps) {
  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />

  const data = downsample(snapshots).map(s => ({
    date: formatShortDate(s.date),
    'Daily Active Users':   s.activeUsers,
    'Weekly Active Users':  s.wau,
    'Monthly Active Users': s.mau,
  }))

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-1">
        <h3 className="text-base font-semibold text-gray-900">Active users trend</h3>
        <p className="text-sm text-gray-500">Monthly, weekly, and daily active users over time in the selected time period</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 16, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
          <Line type="monotone" dataKey="Daily Active Users"   stroke={COLORS.dau} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Weekly Active Users"  stroke={COLORS.wau} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Monthly Active Users" stroke={COLORS.mau} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
