import { useState } from 'react'
import { useFilters } from '@/store/FilterContext'
import { useMetrics } from '@/store/hooks/useMetrics'
import { useROI } from '@/store/hooks/useROI'
import { useWaldoSavings } from '@/store/hooks/useWaldoSavings'
import { DEFAULT_ASSUMPTIONS, type ROIAssumptions } from '@/lib/roi'
import { MODEL_RATES, WALDO_PER_QUERY, FRONTIER_MODEL_SHARES } from '@/constants/modelRates'
import { HealthMetricBar } from '@/components/cards/HealthMetricBar'
import { StatCard } from '@/components/cards/StatCard'
import { ROISummaryCard } from '@/components/cards/ROISummaryCard'
import { WaldoSavingsCard } from '@/components/cards/WaldoSavingsCard'
import { ContractCard } from '@/components/cards/ContractCard'
import { ActiveUsersTrend } from '@/components/charts/ActiveUsersTrend'
import { ActiveUsersByProduct } from '@/components/charts/ActiveUsersByProduct'
import { TotalInteractionsByProduct } from '@/components/charts/TotalInteractionsByProduct'
import { TimeSavedBar } from '@/components/charts/TimeSavedBar'
import { WaldoSavingsTabs } from '@/components/tabs/WaldoSavingsTabs'
import { DepartmentFilter } from '@/components/filters/DepartmentFilter'
import { DateRangePicker } from '@/components/filters/DateRangePicker'
import { formatNumber } from '@/lib/formatters'

function loadAssumptions(): ROIAssumptions {
  try {
    const saved = localStorage.getItem('glean_roi_assumptions')
    return saved ? { ...DEFAULT_ASSUMPTIONS, ...JSON.parse(saved) } : DEFAULT_ASSUMPTIONS
  } catch {
    return DEFAULT_ASSUMPTIONS
  }
}

export function OverviewPage() {
  const { filters } = useFilters()
  const { data, isLoading } = useMetrics(filters)

  const [contractValue, setContractValue] = useState<number | null>(() => {
    const saved = localStorage.getItem('glean_contract_value')
    return saved ? parseFloat(saved) : null
  })

  const [assumptions, setAssumptions] = useState<ROIAssumptions>(loadAssumptions)
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [showWaldoMethodology, setShowWaldoMethodology] = useState(false)

  function handleContractValueChange(val: number | null) {
    setContractValue(val)
    if (val !== null) localStorage.setItem('glean_contract_value', String(val))
    else localStorage.removeItem('glean_contract_value')
  }

  function updateAssumption<K extends keyof ROIAssumptions>(key: K, val: ROIAssumptions[K]) {
    setAssumptions(prev => {
      const next = { ...prev, [key]: val }
      localStorage.setItem('glean_roi_assumptions', JSON.stringify(next))
      return next
    })
  }

  const effectiveContractValue = contractValue ?? data?.contract.contractValueUsd ?? null
  const roi = useROI(data?.summary ?? null, effectiveContractValue, assumptions)
  const waldoSavings = useWaldoSavings(data?.summary?.waldoUsage)
  const summary = data?.summary
  const health = summary?.health

  return (
    <div className="px-8 py-6 max-w-5xl space-y-6">

      {/* ── Page title row ───────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <button
          onClick={() => setShowAssumptions(v => !v)}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          How ROI is calculated
        </button>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DepartmentFilter />
          <DateRangePicker />
        </div>
        <span className="text-sm text-gray-400">Updated daily · Days in UTC</span>
      </div>

      {/* ── Forrester assumptions panel (collapsible) ────────────── */}
      {showAssumptions && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            ROI Calculation Assumptions
            <span className="ml-2 text-xs font-normal text-gray-500">(Forrester Research methodology)</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Fully-burdened hourly rate ($/hr)</label>
              <input
                type="number"
                value={assumptions.hourlyRateUsd}
                onChange={e => updateAssumption('hourlyRateUsd', parseFloat(e.target.value) || DEFAULT_ASSUMPTIONS.hourlyRateUsd)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
              <p className="text-[10px] text-gray-400 mt-1">Forrester default: $52/hr</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Risk adjustment (%)</label>
              <input
                type="number" min={0} max={50}
                value={Math.round(assumptions.riskAdjustment * 100)}
                onChange={e => updateAssumption('riskAdjustment', (parseFloat(e.target.value) || 10) / 100)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
              <p className="text-[10px] text-gray-400 mt-1">Glean standard: 10%</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-200 grid grid-cols-3 gap-3 text-xs text-gray-500">
            <span>🔍 <strong>Search:</strong> 8.10 min/query (Forrester)</span>
            <span>💬 <strong>Chat:</strong> 16.80 min/session (Forrester)</span>
            <span>🤖 <strong>Agents:</strong> 20 min/run (internal est.)</span>
          </div>
        </div>
      )}

      {/* ── Health metrics ───────────────────────────────────────── */}
      <div>
        <p className="text-sm text-gray-700 mb-3">
          What is the overall health of Glean at {data?.contract.companyName ?? '…'} as of today?
        </p>
        <div className="grid grid-cols-3 gap-4">
          <HealthMetricBar label="Coverage" description="How many users know about Glean" value={health?.coverage ?? 0} isLoading={isLoading} />
          <HealthMetricBar label="Activity" description="How many use Glean after signup" value={health?.activity ?? 0} isLoading={isLoading} color="bg-indigo-500" />
          <HealthMetricBar label="Stickiness" description="How many users make Glean a habit" value={health?.stickiness ?? 0} isLoading={isLoading} color="bg-purple-500" />
        </div>
      </div>

      {/* ── User stats row ───────────────────────────────────────── */}
      <div>
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total employees" sublabel="as of yesterday" value={formatNumber(summary?.totalEmployees ?? 0)} isLoading={isLoading} />
          <StatCard label="Employees who signed up" sublabel="as of yesterday" value={formatNumber(summary?.signedUpEmployees ?? 0)} isLoading={isLoading} />
          <StatCard label="Monthly active users" sublabel="as of yesterday" value={formatNumber(summary?.monthlyActiveUsers ?? 0)} isLoading={isLoading} />
          <StatCard label="Weekly active users" sublabel="as of yesterday" value={formatNumber(summary?.weeklyActiveUsers ?? 0)} isLoading={isLoading} />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Note: The cards above display cumulative data and are not affected by the selected time period.
        </p>
      </div>

      {/* ── Active users trend (MAU/WAU/DAU lines) ───────────────── */}
      <ActiveUsersTrend snapshots={summary?.dailySnapshots ?? []} isLoading={isLoading} />

      {/* ── Active users by product (Search/Assistant/Agents) ────── */}
      <ActiveUsersByProduct snapshots={summary?.dailySnapshots ?? []} isLoading={isLoading} />

      {/* ── What are users doing on Glean? ───────────────────────── */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">What are users doing on Glean?</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-700 flex items-center gap-1">
              Total searches in period
              <span className="text-gray-400 text-xs" title="Total search queries in selected period">ⓘ</span>
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-3">
              {isLoading ? '—' : formatNumber(summary?.totalSearchQueries ?? 0)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-700 flex items-center gap-1">
              Total Assistant interactions in period
              <span className="text-gray-400 text-xs" title="Total chat/assistant sessions in selected period">ⓘ</span>
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-3">
              {isLoading ? '—' : formatNumber(summary?.totalChatSessions ?? 0)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-700 flex items-center gap-1">
              Total agent runs in period
              <span className="text-gray-400 text-xs" title="Total agent runs in selected period">ⓘ</span>
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-3">
              {isLoading ? '—' : formatNumber(summary?.totalAgentRuns ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Total interactions by product bar chart ──────────────── */}
      <TotalInteractionsByProduct snapshots={summary?.dailySnapshots ?? []} isLoading={isLoading} />

      {/* ─────────────────── ROI SECTIONS ──────────────────────── */}

      {/* ROI Summary */}
      <ROISummaryCard
        roi={roi}
        hourlyRate={assumptions.hourlyRateUsd}
        riskAdjPct={Math.round(assumptions.riskAdjustment * 100)}
        isLoading={isLoading}
      />

      {/* Time saved breakdown */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3" id="benchmarks">
          Time saved by activity (Forrester benchmarks)
        </p>
        <TimeSavedBar roi={roi} isLoading={isLoading} />
      </div>

      {/* Contract details */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">Contract details</p>
        {data && (
          <ContractCard
            contract={{ ...data.contract, contractValueUsd: effectiveContractValue }}
            onContractValueChange={handleContractValueChange}
          />
        )}
      </div>

      {/* ─────────────────── WALDO TOKEN SAVINGS ───────────────── */}

      <div className="pt-2">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Waldo token savings</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Value from Waldo orchestrating Assistant and Agents queries before frontier models run
            </p>
          </div>
          <button
            onClick={() => setShowWaldoMethodology(v => !v)}
            className="flex items-center gap-1 text-sm text-emerald-600 hover:underline shrink-0 ml-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How savings are calculated
          </button>
        </div>
      </div>

      {showWaldoMethodology && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Waldo Token Savings Methodology
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            Waldo is Glean&apos;s agentic search model that runs before frontier LLMs, handling retrieval
            and orchestration so expensive models only see refined context. Savings are computed as
            the difference between a counterfactual &quot;frontier-only&quot; baseline and actual spend
            (frontier + Waldo).
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div className="bg-white rounded-lg p-3 border border-emerald-100">
              <p className="font-semibold text-gray-800 mb-2">Per-query tokens (without Waldo)</p>
              <p>Frontier input: {WALDO_PER_QUERY.withoutWaldo.frontierInput.toLocaleString()}</p>
              <p>Frontier output: {WALDO_PER_QUERY.withoutWaldo.frontierOutput.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-emerald-100">
              <p className="font-semibold text-gray-800 mb-2">Per-query tokens (with Waldo)</p>
              <p>Frontier input: {WALDO_PER_QUERY.withWaldo.frontierInput.toLocaleString()}</p>
              <p>Frontier output: {WALDO_PER_QUERY.withWaldo.frontierOutput.toLocaleString()}</p>
              <p>Waldo input: {WALDO_PER_QUERY.withWaldo.waldoInput.toLocaleString()}</p>
              <p>Waldo output: {WALDO_PER_QUERY.withWaldo.waldoOutput.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
            {(['waldo', 'gpt-5.5', 'opus-4.8'] as const).map(id => (
              <span key={id}>
                <strong>{MODEL_RATES[id].label}:</strong>{' '}
                ${MODEL_RATES[id].inputPerM}/M in · ${MODEL_RATES[id].outputPerM}/M out
                {MODEL_RATES[id].sourceNote && (
                  <span className="text-gray-400"> ({MODEL_RATES[id].sourceNote})</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-3">
            Traffic split: {Math.round(FRONTIER_MODEL_SHARES['gpt-5.5'] * 100)}% GPT-5.5 ·{' '}
            {Math.round(FRONTIER_MODEL_SHARES['opus-4.8'] * 100)}% Opus 4.8 ·{' '}
            {WALDO_PER_QUERY.divertedTotalTokens.toLocaleString()} tokens diverted per query (~25%)
          </p>
        </div>
      )}

      <WaldoSavingsCard savings={waldoSavings} isLoading={isLoading} />

      <WaldoSavingsTabs savings={waldoSavings} isLoading={isLoading} />
    </div>
  )
}
