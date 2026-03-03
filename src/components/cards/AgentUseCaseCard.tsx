import { useMemo } from 'react'
import type { AgentROI } from '@/types/agents'
import { formatCurrency } from '@/lib/formatters'
import { Badge } from '@/components/ui/Badge'

interface AgentUseCaseCardProps {
  agentROI: AgentROI
  analysisWeeks: number
  onMetricUpdate?: (
    useCaseId: string,
    field: 'numberOfUsers' | 'runsPerUserPerWeek',
    value: number,
  ) => void
  onMetaUpdate?: (
    useCaseId: string,
    field: 'name' | 'description',
    value: string,
  ) => void
  onStepChange?: (
    useCaseId: string,
    phase: 'pre' | 'with',
    stepIndex: number,
    field: 'activity' | 'timeMinutes' | 'notes',
    value: string | number,
  ) => void
  onAddStep?: (useCaseId: string, phase: 'pre' | 'with') => void
  onRemoveStep?: (useCaseId: string, phase: 'pre' | 'with', stepIndex: number) => void
  onDeleteAgent?: (useCaseId: string) => void
}

const CATEGORY_BADGE: Record<string, 'blue' | 'green' | 'orange' | 'teal' | 'rose'> = {
  Engineering: 'blue',
  Operations: 'green',
  Finance: 'orange',
  HR: 'teal',
  Support: 'rose',
}

export function AgentUseCaseCard({
  agentROI,
  analysisWeeks,
  onMetricUpdate,
  onMetaUpdate,
  onStepChange,
  onAddStep,
  onRemoveStep,
  onDeleteAgent,
}: AgentUseCaseCardProps) {
  const { useCase } = agentROI

  const pct = agentROI.timeReductionPercent
  const afterWidthPct = useCase.preGleanTotalMinutes > 0
    ? Math.max((useCase.withGleanTotalMinutes / useCase.preGleanTotalMinutes) * 100, 5)
    : 5

  const tableRowCount = Math.max(useCase.preGleanSteps.length, useCase.withGleanSteps.length)
  const tableRows = useMemo(
    () =>
      Array.from({ length: tableRowCount }).map((_, index) => ({
        step: index + 1,
        pre: useCase.preGleanSteps[index],
        with: useCase.withGleanSteps[index],
      })),
    [tableRowCount, useCase.preGleanSteps, useCase.withGleanSteps],
  )

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge label={useCase.category} variant={CATEGORY_BADGE[useCase.category] ?? 'blue'} />
          <input
            value={useCase.name}
            onChange={e => onMetaUpdate?.(useCase.id, 'name', e.target.value)}
            className="text-base font-semibold text-glean-text-primary bg-transparent border-b border-transparent hover:border-gray-200 focus:border-indigo-300 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onDeleteAgent?.(useCase.id)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>

      <textarea
        value={useCase.description}
        onChange={e => onMetaUpdate?.(useCase.id, 'description', e.target.value)}
        className="w-full text-sm text-glean-text-secondary mb-5 resize-y min-h-14 rounded-lg border border-transparent hover:border-gray-200 focus:border-indigo-300 outline-none px-1 py-1"
      />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <label className="text-xs text-glean-text-secondary">
          Impacted users
          <input
            type="number"
            min={0}
            value={useCase.numberOfUsers}
            onChange={e => onMetricUpdate?.(useCase.id, 'numberOfUsers', Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-glean-border px-3 py-2 text-sm text-glean-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </label>
        <label className="text-xs text-glean-text-secondary">
          Runs per user/week
          <input
            type="number"
            min={0}
            step={0.1}
            value={useCase.runsPerUserPerWeek}
            onChange={e => onMetricUpdate?.(useCase.id, 'runsPerUserPerWeek', Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-glean-border px-3 py-2 text-sm text-glean-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </label>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-glean-text-secondary w-20 shrink-0 text-right font-medium">Before</span>
          <div className="flex-1 h-9 bg-rose-50 rounded-lg relative overflow-hidden">
            <div className="h-full bg-rose-300 rounded-lg w-full" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-700">
              {useCase.preGleanTotalMinutes} min
              <span className="font-normal ml-1 text-rose-500">
                ({useCase.preGleanSteps.length} steps)
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-glean-text-secondary w-20 shrink-0 text-right font-medium">With Glean</span>
          <div className="flex-1 h-9 bg-gray-50 rounded-lg relative">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg transition-all duration-700"
              style={{ width: `${afterWidthPct}%` }}
            />
            <span
              className="absolute top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-700"
              style={{ left: `calc(${Math.min(afterWidthPct, 85)}% + 12px)` }}
            >
              {useCase.withGleanTotalMinutes} min
              <span className="font-normal ml-1 text-indigo-400">
                ({useCase.withGleanSteps.length} steps)
              </span>
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-xs font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {pct}% faster with Glean
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-glean-blue">{useCase.timeSavedPerRunMinutes} min</p>
          <p className="text-[11px] text-glean-text-tertiary mt-0.5">saved per agent run</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(agentROI.annualValueUsd)}</p>
          <p className="text-[11px] text-glean-text-tertiary mt-0.5">value generated ({analysisWeeks}w)</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-violet-600">{agentROI.annualRunsTotal.toLocaleString()}</p>
          <p className="text-[11px] text-glean-text-tertiary mt-0.5">projected runs ({analysisWeeks}w)</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-glean-text-tertiary mb-1">
        <span>{useCase.numberOfUsers} users</span>
        <span className="text-gray-300">|</span>
        <span>{useCase.runsPerUserPerWeek} runs/user/week</span>
        <span className="text-gray-300">|</span>
        <span>{Math.round(useCase.numberOfUsers * useCase.runsPerUserPerWeek)} runs/week</span>
        <span className="text-gray-300">|</span>
        <span>{agentROI.annualRunsTotal.toLocaleString()} projected runs ({analysisWeeks}w)</span>
        <span className="text-gray-300">|</span>
        <span>Net benefit: <strong className="text-glean-text-primary">{formatCurrency(agentROI.netBenefitUsd)}</strong></span>
      </div>

      <div className="mt-5 pt-5 border-t border-glean-border space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-glean-text-secondary uppercase tracking-wide">
            Step-by-step time table
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-glean-text-tertiary border-b border-glean-border">
                <th className="py-2 pr-2">Step</th>
                <th className="py-2 pr-2">Pre-Glean activity</th>
                <th className="py-2 pr-2">Pre min</th>
                <th className="py-2 pr-2">Post-Glean activity</th>
                <th className="py-2 pr-2">Post min</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr key={row.step} className="border-b border-gray-100">
                  <td className="py-2 pr-2 font-medium text-glean-text-secondary">Step {row.step}</td>
                  <td className="py-2 pr-2">
                    {row.pre ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={row.pre.activity}
                          onChange={e => onStepChange?.(useCase.id, 'pre', index, 'activity', e.target.value)}
                          className="w-full rounded-md border border-rose-200 px-2 py-1.5 text-xs text-glean-text-primary"
                        />
                        <button
                          onClick={() => onRemoveStep?.(useCase.id, 'pre', index)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                          aria-label="Delete pre-glean step"
                          title="Delete pre-glean step"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M4 7h16M10 4h4M9 4h6v3H9V4zm-2 3l1 13h8l1-13M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="text-glean-text-tertiary italic">No pre step</div>
                    )}
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min={0}
                      value={row.pre?.timeMinutes ?? 0}
                      onChange={e => onStepChange?.(useCase.id, 'pre', index, 'timeMinutes', Number(e.target.value))}
                      disabled={!row.pre}
                      className="w-24 rounded-md border border-rose-200 px-2 py-1.5 text-xs text-glean-text-primary disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    {row.with ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={row.with.activity}
                          onChange={e => onStepChange?.(useCase.id, 'with', index, 'activity', e.target.value)}
                          className="w-full rounded-md border border-indigo-200 px-2 py-1.5 text-xs text-glean-text-primary"
                        />
                        <button
                          onClick={() => onRemoveStep?.(useCase.id, 'with', index)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
                          aria-label="Delete post-glean step"
                          title="Delete post-glean step"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M4 7h16M10 4h4M9 4h6v3H9V4zm-2 3l1 13h8l1-13M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="text-glean-text-tertiary italic">No post step</div>
                    )}
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min={0}
                      value={row.with?.timeMinutes ?? 0}
                      onChange={e => onStepChange?.(useCase.id, 'with', index, 'timeMinutes', Number(e.target.value))}
                      disabled={!row.with}
                      className="w-24 rounded-md border border-indigo-200 px-2 py-1.5 text-xs text-glean-text-primary disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-5 gap-2 items-center">
          <div />
          <button
            onClick={() => onAddStep?.(useCase.id, 'pre')}
            className="justify-self-start text-xs text-rose-600 hover:text-rose-700"
          >
            + Pre step
          </button>
          <div />
          <button
            onClick={() => onAddStep?.(useCase.id, 'with')}
            className="justify-self-start text-xs text-indigo-600 hover:text-indigo-700"
          >
            + Post step
          </button>
          <div />
        </div>

        <p className="text-xs text-glean-text-tertiary">
          Step labels auto-populate as Step 1, Step 2, Step 3. Enter minutes for pre and post Glean to calculate savings.
        </p>
      </div>
    </div>
  )
}
