import type { ReactNode } from 'react'
import { DepartmentFilter } from '@/components/filters/DepartmentFilter'
import { DateRangePicker } from '@/components/filters/DateRangePicker'

interface BusinessPageHeaderProps {
  title: string
  subtitle: string
  actions?: ReactNode
}

export function BusinessPageHeader({ title, subtitle, actions }: BusinessPageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-glean-text-primary">{title}</h1>
          <p className="text-sm text-glean-text-secondary mt-1 max-w-2xl">{subtitle}</p>
        </div>
        {actions}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DepartmentFilter />
          <DateRangePicker />
        </div>
        <span className="text-xs text-glean-text-tertiary">Updated daily · Days in UTC</span>
      </div>
    </div>
  )
}
