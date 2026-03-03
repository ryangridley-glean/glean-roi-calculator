import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { FilterState } from '@/types/filters'
import type { TimePreset, DateRange } from '@/types/api'
import { today, daysAgo } from '@/lib/dateUtils'

const CONTRACT_START = '2024-06-01'

function defaultRange(preset: TimePreset): DateRange {
  switch (preset) {
    case '7d':       return { start: daysAgo(7), end: today() }
    case '30d':      return { start: daysAgo(30), end: today() }
    case '90d':      return { start: daysAgo(90), end: today() }
    case 'contract': return { start: CONTRACT_START, end: today() }
    default:         return { start: daysAgo(30), end: today() }
  }
}

const INITIAL: FilterState = {
  preset: 'contract',
  dateRange: defaultRange('contract'),
  department: null,
}

type Action =
  | { type: 'SET_PRESET'; preset: TimePreset }
  | { type: 'SET_CUSTOM_RANGE'; range: DateRange }
  | { type: 'SET_DEPARTMENT'; dept: string | null }

function reducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case 'SET_PRESET':
      return { ...state, preset: action.preset, dateRange: defaultRange(action.preset) }
    case 'SET_CUSTOM_RANGE':
      return { ...state, preset: 'custom', dateRange: action.range }
    case 'SET_DEPARTMENT':
      return { ...state, department: action.dept }
    default:
      return state
  }
}

interface FilterContextValue {
  filters: FilterState
  setPreset: (preset: TimePreset) => void
  setCustomRange: (range: DateRange) => void
  setDepartment: (dept: string | null) => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(reducer, INITIAL)

  useEffect(() => {
    const saved = localStorage.getItem('glean_roi_preset')
    if (saved) dispatch({ type: 'SET_PRESET', preset: saved as TimePreset })
  }, [])

  useEffect(() => {
    localStorage.setItem('glean_roi_preset', filters.preset)
  }, [filters.preset])

  return (
    <FilterContext.Provider value={{
      filters,
      setPreset: preset => dispatch({ type: 'SET_PRESET', preset }),
      setCustomRange: range => dispatch({ type: 'SET_CUSTOM_RANGE', range }),
      setDepartment: dept => dispatch({ type: 'SET_DEPARTMENT', dept }),
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used inside FilterProvider')
  return ctx
}
