import { useState } from 'react'
import type { DailySnapshot, DepartmentUsage } from '@/types/metrics'
import { StatCard } from '@/components/cards/StatCard'
import { UsageTrendChart } from '@/components/charts/UsageTrendChart'
import { DepartmentBarChart } from '@/components/charts/DepartmentBarChart'
import { formatNumber } from '@/lib/formatters'

type Tab = 'search' | 'chat' | 'agents'

interface TabConfig {
  id: Tab
  label: string
  metricKey: 'searchQueries' | 'chatSessions' | 'agentRuns'
  color: string
  totalKey: keyof { totalSearchQueries: number; totalChatSessions: number; totalAgentRuns: number }
  noun: string
}

const TABS: TabConfig[] = [
  { id: 'search', label: 'Search', metricKey: 'searchQueries', color: '#1A73E8', totalKey: 'totalSearchQueries', noun: 'queries' },
  { id: 'chat',   label: 'Chat / Assistant', metricKey: 'chatSessions',  color: '#3D5AFE', totalKey: 'totalChatSessions',  noun: 'sessions' },
  { id: 'agents', label: 'Agents', metricKey: 'agentRuns',     color: '#7C4DFF', totalKey: 'totalAgentRuns',     noun: 'runs' },
]

interface UsageBreakdownTabsProps {
  snapshots: DailySnapshot[]
  departments: DepartmentUsage[]
  totals: { totalSearchQueries: number; totalChatSessions: number; totalAgentRuns: number }
  isLoading?: boolean
}

export function UsageBreakdownTabs({ snapshots, departments, totals, isLoading }: UsageBreakdownTabsProps) {
  const [active, setActive] = useState<Tab>('search')
  const tab = TABS.find(t => t.id === active)!

  const avgPerDay = snapshots.length > 0
    ? Math.round(totals[tab.totalKey] / snapshots.length)
    : 0

  const peakDay = snapshots.reduce(
    (max, s) => s[tab.metricKey] > max ? s[tab.metricKey] : max,
    0
  )

  return (
    <div className="card">
      {/* Tab bar */}
      <div className="flex border-b border-glean-border mb-6">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`
              px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
              ${active === t.id
                ? 'border-glean-blue text-glean-blue'
                : 'border-transparent text-glean-text-secondary hover:text-glean-text-primary'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label={`Total ${tab.noun}`} value={formatNumber(totals[tab.totalKey])} isLoading={isLoading} />
        <StatCard label="Avg per day" value={formatNumber(avgPerDay)} isLoading={isLoading} />
        <StatCard label="Peak day" value={formatNumber(peakDay)} isLoading={isLoading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <UsageTrendChart
          snapshots={snapshots}
          metricKey={tab.metricKey}
          label={tab.label}
          color={tab.color}
          isLoading={isLoading}
        />
        <DepartmentBarChart
          departments={departments}
          metricKey={tab.metricKey}
          color={tab.color}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
