import { useEffect, useState } from 'react'
import { dataProvider } from '@/api'
import { useFilters } from '@/store/FilterContext'

export function DepartmentFilter() {
  const { filters, setDepartment } = useFilters()
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    dataProvider.getDepartments().then(setDepartments)
  }, [])

  return (
    <div className="relative">
      <select
        value={filters.department ?? ''}
        onChange={e => setDepartment(e.target.value || null)}
        className="appearance-none pl-8 pr-8 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
      >
        <option value="">All departments</option>
        {departments.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20H7a2 2 0 01-2-2v-1a5 5 0 015-5h4a5 5 0 015 5v1a2 2 0 01-2 2zm-5-9a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      </span>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▾</span>
    </div>
  )
}
