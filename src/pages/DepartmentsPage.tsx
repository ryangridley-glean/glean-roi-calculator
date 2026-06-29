import { useState } from 'react'
import { BENCHMARKS } from '@/constants/benchmarks'

const HOURLY_RATE = BECHMARKS.avgHourlySalaryUsd
const RISK_ADJ   = 1 - BENCHMARKS.riskAdjustment

interface Dept {
  name: string
  emoji: string
  totalUsers: number
  signedUp: number
  mau: number
  wau: number
  searches: number
  chats: number
  agentRuns: number
}

const DEPARTMENTS: Dept[] = [
  { name: 'Engineering', emoji: '♇️',  totalUsers: 280, signedUp: 252, mau: 168, wau: 112, searches: 18200, chats: 4800, agentRuns: 840 },
  { name: 'Sales',       emoji: '💼',  totalUsers: 120, signedUp:  84, mau:  48, wau:  28, searches:  5600, chats: 2100, agentRuns: 240 },
  { name: 'Support',     emoji: '🎉',  totalUsers:  85, signedUp:  76, mau:  58, wau:  42, searches:  7200, chats: 3900, agentRuns: 380 },
  { name: 'Product',     emoji: '🩩',  totalUsers:  60, signedUp:  48, mau:  30, wau:  18, searches:  4100, chats: 1200, agentRuns: 120 },
  { name: 'Marketing',   emoji: '💣',  totalUsers:  90, signedUp:  58, mau:  28, wau:  14, searches:  2800, chats:  820, agentRuns:  60 },
  { name: 'HR',          emoji: '👵',  totalUsers:  45, signedUp:  36, mau:  20, wau:  10, searches:  1900, chats:  640, agentRuns:  80 },
  { name: 'Finance',     emoji: '💊',  totalUsers:  60, signedUp:  38, mau:  18, wau:   9, searches:  1600, chats:  480, agentRuns:  40 },
  { name: 'Legal',       emoji: '⚠️',  totalUsers:  35, signedUp:  14, mau:   6, wau:   3, searches:   480, chats:  120, agentRuns:  10 },
]

function computeROI_dept(d: Dept): number {
  const mins = d.searches * BENCHMARKS.minutesSavedPerSearch
              + d.chats    * BENCHMARKS.minutesSavedPerChat
              + d.agentRuns * BENCHMARKS.minutesSavedPerAgentRun
  return Math.round((mins / 60) * HOURLY_RATE * RISK_ADJ)
}

function pct(a: number, b: number) { return b > 0 ? Math.round((a / b) * 100) : 0 }

function healthColor(p: number) {
  if (p > 60) return 'text-emerald-600'
  if (p > 30) return 'text-amber-600'
  return 'text-red-500'
}
function healthBg(p: number) {
  if (p > 60) return 'bg-emerald-500'
  if (p > 30) return 'bg-amber-400'
  return 'bg-red-400'
}

type SortKey = 'roi' | 'wau' | 'activity' | 'name'

export function DepartmentsPage() {
  const [sortBy, setSortBy] = useState<SortKey>('roi')
  const [selected, setSelected] = useState<string | null>(null)

  const sorted = [...DEPARTMENTS].sort((a, b) => {
    if (sortBy === 'roi')      return computeROI_dept(b) - computeROI_dept(a)
    if (sortBy === 'wau')      return b.wau - a.wau
    if (sortBy === 'activity') return pct(b.wau, b.totalUsers) - pct(a.wau, a.totalUsers)
    return a.name.localeCompare(b.name)
  })

  const totalROI   = DEPARTMENTS.reduce((s, d) => s + computeROI_dept(d), 0)
  const totalUsers = DEPARTMENTS.reduce((s, d) => s + d.totalUsers, 0)
  const totalMAU   = DEPARTMENTS.reduce((s, d) => s + d.mau, 0)

  return (
    <div className="px-8 py-6 max-w-5ln space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">Department-level adoption and ROI breakdown</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          Sort by:
          {(['roi','activity','wau','name'] as SortKey[]).map(k => (
            <button key={k} onClick={() => setSortBy(k)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${sortBy === k ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 hover:bg-gray-50'}`}>
              {k === 'roi' ? 'ROI' : k === 'activity' ? 'Activity %' : k === 'wau' ? 'WAU' : 'Name'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total employees across depts', value: totalUsers.toLocaleString(), color: 'text-gray-900' },
          { label: 'Monthly active users', value: totalMAU.toLocaleString(), color: 'text-indigo-600' },
          { label: 'Total estimated annual ROI', value: `$${(totalROI/1000).toFixed(0)}K`, color: 'text-emerald-600' },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map(dept => {
          const activity = pct(dept.wau, dept.totalUsers)
          const roi = computeROI_dept(dept)
          const isSelected = selected === dept.name
          return (
            <div key={dept.name}
              className={`bg-white border rounded-xl p-5 cursor-pointer transition-all ${isSelected ? 'border-indigo-400 shadow-md' : 'border-gray-200 hover:border-indigo-200'}`}
              onClick={() => setSelected(isSelected ? null : dept.name)}>
              <div className="flex items-center gap-4">
                <span className="text-2xl">{dept.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{dept.name}</p>
                    <span className={`text-sm font-bold ${healthColor(activity)}`}>{activity}% activity</span>
                  </div>
                  <div className="w5-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${healthBg(activity)}`} style={{ width: `${activity}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 text-right shrink-0">
                  {[
                    { label: 'Users', value: dept.totalUsers },
                    { label: 'MAU', value: dept.mau },
                    { label: 'WAU', value: dept.wau },
                    { label: 'Est. ROI', value: `$${roi/1000}.toFixed(0)}K`, highlight: true },
                  ].map(m => (
                    <div key={m.label}>
                      <p className={`text-base font-bold ${m.highlight ? 'text-emerald-600' : 'text-gray-900'}`}>{m.value}</p>
                      <p className="text-[10px] text-gray-400">{m.label}</p>
                    </div>
                  ))}
                </div>
                <span className="text-gray-300 ml-2">{isSelected ? '▶' : '▼'}</span>
              </div>

              {isSelected && (
                <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <p className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Adoption Funnel</p>
                    {[
                      { label: 'Total', val: dept.totalUsers, pct: 100 },
                      { label: 'Signed Up', val: dept.signedUp, pct: pct(dept.signedUp, dept.totalUsers) },
                      { label: 'MAU', val: dept.mau, pct: pct(dept.mau, dept.totalUsers) },
                      { label: 'WAU', val: dept.wau, pct: pct(dept.wau, dept.totalUsers) },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-2">
                        <span className="text-gray-500 w-16 text-xs">{row.label}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-8 text-right">{row.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <p className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Activity (this period)</p>
                    { [
                      { icon: '🔉', label: 'Searches', val: dept.searches.toLocaleString() },
                      { icon: '💬', label: 'Chats', val: dept.chats.toLocaleString() },
                      { icon: '🤗', label: 'Agent runs', val: dept.agentRuns.toLocaleString() },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between text-xs">
                        <span className="text-gray-500">{r.icon} {r.label}</span>
                        <span className="font-semibold text-gray-800">{r.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 space-y-2">
                    <p className="font-semibold text-emerald-700 text-xs uppercase tracking-wide">Value Delivered</p>
                    <p className="text-2xl font-bold text-emerald-700">$${roi/1000}.toFixed(1)}K</p>
                    <p className="text-xs text-emerald-600">estimated annual value</p>
                    {activity < 20 && (
                      <p className="text-[10px] text-amber-700 bg-amber-50 rounded p-1 mt-1">
                        ⚠️ Expansion opportunity &mdash; low activity
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
