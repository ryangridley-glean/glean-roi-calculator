import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DepartmentUsage } from '@/types/metrics'
import { Skeleton } from '@/components/ui/Skeleton'

type MetricKey = 'searchQueries' | 'chatSessions' | 'agentRuns'

interface DepartmentBarChartProps {
  departments: DepartmentUsage[]
  metricKey: MetricKey
  color: string
  isLoading?: boolean
}

export function DepartmentBarChart({ departments, metricKey, color, isLoading }: DepartmentBarChartProps) {
  if (isLoading) return <Skeleton className="h-48 w-full" />

  const data = [...departments]
    .sort((a, b) => b[metricKey] - a[metricKey])
    .slice(0, 5)
    .map(d => ({ dept: d.department, value: d[metricKey] }))

  return (
    <div className="card">
      <p className="text-sm font-medium text-glean-text-primary mb-4">Top departments</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#9AA0A6' }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="dept"
            tick={{ fontSize: 11, fill: '#5F6368' }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
