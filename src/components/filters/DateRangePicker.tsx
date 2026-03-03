import { useFilters } from '@/store/FilterContext'
import type { TimePreset } from '@/types/api'

const PRESETS: { label: string; value: TimePreset }[] = [
  { label: 'Past 7 days', value: '7d' },
  { label: 'Past 30 days', value: '30d' },
  { label: 'Past 90 days', value: '90d' },
  { label: 'Contract period', value: 'contract' },
]

export function DateRangePicker() {
  const { filters, setPreset, setCustomRange } = useFilters()

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={filters.preset === 'custom' ? 'custom' : filters.preset}
          onChange={e => {
            const v = e.target.value as TimePreset
            if (v !== 'custom') setPreset(v)
          }}
          className="appearance-none pl-3 pr-7 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
        >
          {PRESETS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
          <option value="custom">Custom range</option>
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-500 text-xs">▾</span>
      </div>

      {filters.preset === 'custom' && (
        <div className="flex items-center gap-1 text-sm">
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={e => setCustomRange({ ...filters.dateRange, start: e.target.value })}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <span className="text-gray-400">→</span>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={e => setCustomRange({ ...filters.dateRange, end: e.target.value })}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}
    </div>
  )
}
