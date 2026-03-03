import { Skeleton } from '@/components/ui/Skeleton'

interface StatCardProps {
  label: string
  sublabel?: string
  value: string | number
  isLoading?: boolean
  highlight?: boolean
}

export function StatCard({ label, sublabel, value, isLoading, highlight }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="card space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    )
  }

  return (
    <div className={`card ${highlight ? 'border-l-4 border-l-glean-blue' : ''}`}>
      <p className="text-sm font-medium text-glean-text-primary">{label}</p>
      {sublabel && <p className="text-xs text-glean-text-secondary mt-0.5">{sublabel}</p>}
      <p className="stat-number mt-3">{value}</p>
    </div>
  )
}
