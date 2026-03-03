interface ProgressBarProps {
  value: number
  max?: number
  color?: string
}

export function ProgressBar({ value, max = 100, color = 'bg-glean-blue' }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
