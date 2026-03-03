import type { TimePreset, DateRange } from './api'

export interface FilterState {
  preset: TimePreset
  dateRange: DateRange
  department: string | null
}
