import { useFilters } from '@/store/FilterContext'
import { useMetrics } from '@/store/hooks/useMetrics'
import { formatNumber, formatHours, formatCurrency } from '@/lib/formatters'
import { BENCHMARKS } from '@/constants/benchmarks'

const TOP_TOPICS = [
  { topic: 'Product documentation', sessions: 1840, pct: 22 },
  { topic: 'Engineering runbooks', sessions: 1260, pct: 15 },
  { topic: 'HR & benefits policy', sessions: 980,  pct: 12 },
  { topic: 'Customer escalation summaries', sessions: 840, pct: 10 },
  { topic: 'Sales deal context', sessions: 760, pct: 9 },
  { topic: 'Onboarding guides', sessions: 630, pct: 8 },
  { topic: 'Security & compliance', sessions: 500, pct: 6 },
  { topic: 'Other', sessions: 1490, pct: 18 },
]

const DEPTH_CHAT = [
  { name: 'Engineering', sessions: 4800, color: 'bg-blue-500' },
  { name: 'Support',     sessions: 3900, color: 'bg-indigo-500' },
  { name: 'Sales',       sessions: 2100, color: 'bg-violet-500' },
  { name: 'Product',     sessions: 1200, color: 'bg-purple-400' },
  { name: 'HR',          sessions:  640, color: 'bg-fuchsia-400' },
  { name: 'Finance',     sessions:  480, color: 'bg-pink-400' },
  { name: 'Marketing',   sessions:  820, color: 'bg-rose-400' },
  { name: 'Legal',       sessions:  120, color: 'bg-gray-400' },
]
const maxSessions = Math.max(...DEPT_CHAT.map(d => d.sessions))

export function AssistantPage() {
  const { filters } = useFilters()
  const { data, isLoading } = useMetrics(filters)
  const totalChats = data?.summary?.totalChatSessions ?? 8300
  const avgPerUser = data?.summary?.monthlyActiveUsers
    ? Math.round(totalChats / data.summary.monthlyActiveUsers)
    : 24
  const hoursSaved = (totalChats * BENCHMARKS.minutesSavedPerChat / 60) * (1 - BENCHMARKS.riskAdjustment)
  const valueSaved = hoursSaved * BENCHMARKS.avgHourlySalaryUsd

  return (
    <div className="px-8 py-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Assistant</h1>
        <p className="text-sm text-gray-500 mt-1">AI Assistant (Chat) usage analytics and value delivered</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total chat sessions', value: isLoading ? '—' : formatNumber(totalChats), color: 'text-indigo-600', icon: '💬' },
          { label: 'Avg sessions / active user', value: isLoading ? '—' : String(avgPerUser), color: 'text-blue-600', icon: '👤' },
          { label: 'Hours saved (risk-adj.)', value: isLoading ? '—' : formatHours(hoursSaved), color: 'text-amber-600', icon: '⏱️' },
          { label: 'Value generated', value: isLoading ? '—' : formatCurrency(valueSaved), color: 'text-emerald-600', icon: '💰' },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-2xl mb-2">{m.icon}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top topics */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-900 mb-4">Top conversation topics</p>
          <div className="space-y-3">
            {TOP_TOPICS,map(t => (
              <div key={t.topic}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">{t.topic}</span>
                  <span className="font-semibold text-gray-900">{t.sessions.toLocaleString()} sessions</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage by department */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-900 mb-4">Chat sessions by department</p>
          <div className="space-y-3">
            {DEPT_CHAT.map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">{d.name}</span>
                  <span className="font-semibold text-gray-900">{d.sessions.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-2 rounded-full ${d.color}`} style={{ width: `${Math.round((d.sessions/maxSessions)*100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology note */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700">
        <strong>Methodology:</strong> Value calculated using Forrester TEI™ benchmark of {BENCHMARKS.minutesSavedPerChat} minutes saved per chat session at ${BENCHMARKS.avgHourlySalaryUsd}/hr burdened rate with {BENCHMARKS.riskAdjustment * 100}% risk adjustment.
        Topic breakdown based on simulated demo data — connect live data in V2 for real topic classification.
      </div>
    </div>
  )
}
