import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'

interface HealthMetricBarProps {
  label: string
  description: string
  value: number
  isLoading?: boolean
  color?: string
}

export function HealthMetricBar({ label, description, value, isLoading, color }: HealthMetricBarProps) {
  if (isLoading) {
    return (
      <div className="card space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-8 w-14" />
        <Skeleton className="h-2 w-full" />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center gap-1.5 mb-1">
        <p className="text-sm font-medium text-glean-text-primary">{label}</p>
        <span className="text-glean-text-tertiary text-xs">ⓘ</span>
      </div>
      <p className="text-xs text-glean-text-secondary mb-3">{description}</p>
      <p className="text-3xl font-bold text-glean-text-primary mb-3">{value}%</p>
      <ProgressBar value={value} color={color ?? 'bg-glean-blue'} />
    </div>
  )
}
