import { useState, useEffect, useRef } from 'react'
import { dataProvider } from '@/api'
import type { MetricsResponse } from '@/types/api'
import type { FilterState } from '@/types/filters'

interface MetricsState {
  data: MetricsResponse | null
  isLoading: boolean
  error: string | null
}

export function useMetrics(filters: FilterState): MetricsState {
  const [state, setState] = useState<MetricsState>({ data: null, isLoading: true, error: null })
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    dataProvider
      .getMetrics({
        dateRange: filters.dateRange,
        departmentFilter: filters.department ?? undefined,
      })
      .then(data => {
        if (!ctrl.signal.aborted) {
          setState({ data, isLoading: false, error: null })
        }
      })
      .catch(err => {
        if (!ctrl.signal.aborted) {
          setState(prev => ({ ...prev, isLoading: false, error: String(err) }))
        }
      })

    return () => ctrl.abort()
  }, [filters.dateRange.start, filters.dateRange.end, filters.department])

  return state
}
