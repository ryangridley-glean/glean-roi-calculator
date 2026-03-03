import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DailySnapshot } from '@/types/metrics'
import { formatShortDate } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

type MetricKey = 'searchQueries' | 'chatSessions' | 'agentRuns'

interface UsageTrendChartProps {
  snapshots: DailySnapshot[]
  metricKey: MetricKey
  label: string
  color: string
  isLoading?: boolean
}

const LABEL_MAP: Record<MetricKey, string> = {
  searchQueries: 'Search Queries',
  chatSessions: 'Chat Sessions',
  agentRuns: 'Agent Runs',
}

function downsample(snapshots: DailySnapshot[], maxPoints = 60): DailySnapshot[] {
  if (snapshots.length <= maxPoints) return snapshots
  const step = Math.ceil(snapshots.length / maxPoints)
  return snapshots.filter((_, i) => i % step === 0)
}

export function UsageTrendChart({ snapshots, metricKey, label, color, isLoading }: UsageTrendChartProps) {
  if (isLoading) return <Skeleton className="h-52 w-full" />

  const dataLabel = LABEL_MAP[metricKey]
  const data = downsample(snapshots).map(s => ({
    date: formatShortDate(s.date),
    [dataLabel]: s[metricKey],
  }))

  return (
    <div className="card">
      <p className="text-sm font-medium text-glean-text-primary mb-4">{label} over time</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Line
            type="monotone"
            dataKey={dataLabel}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
