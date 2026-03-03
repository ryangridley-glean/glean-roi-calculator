import { useEffect, useMemo, useState } from 'react'
import { useAgentUseCases } from '@/store/hooks/useAgentUseCases'
import { computeAllAgentROI } from '@/lib/agentRoi'
import { AgentSummaryBar } from '@/components/cards/AgentSummaryBar'
import { AgentUseCaseCard } from '@/components/cards/AgentUseCaseCard'
import { AgentValueChart } from '@/components/charts/AgentValueChart'
import { BENCHMARKS } from '@/constants/benchmarks'
import { Skeleton } from '@/components/ui/Skeleton'
import type { AgentStep, AgentUseCase } from '@/types/agents'

function renumberSteps(steps: AgentStep[]): AgentStep[] {
  return steps.map((step, index) => ({ ...step, step: index + 1 }))
}

function sumStepMinutes(steps: AgentStep[]): number {
  return steps.reduce((total, step) => total + Math.max(step.timeMinutes, 0), 0)
}

function normalizeUseCase(useCase: AgentUseCase): AgentUseCase {
  const preGleanSteps = renumberSteps(useCase.preGleanSteps)
  const withGleanSteps = renumberSteps(useCase.withGleanSteps)
  const preGleanTotalMinutes = sumStepMinutes(preGleanSteps)
  const withGleanTotalMinutes = sumStepMinutes(withGleanSteps)

  return {
    ...useCase,
    preGleanSteps,
    withGleanSteps,
    preGleanTotalMinutes,
    withGleanTotalMinutes,
    timeSavedPerRunMinutes: Math.max(preGleanTotalMinutes - withGleanTotalMinutes, 0),
    costPerRunUsd: 0,
  }
}

function buildDefaultSteps(count: number): AgentStep[] {
  return Array.from({ length: count }).map((_, index) => ({
    step: index + 1,
    activity: `Step ${index + 1}`,
    timeMinutes: 0,
    notes: '',
  }))
}

export function AgentsPage() {
  const { data: useCases, isLoading } = useAgentUseCases()
  const [analysisWeeks, setAnalysisWeeks] = useState(48)
  const [editableUseCases, setEditableUseCases] = useState<AgentUseCase[]>([])
  const [isAgentPickerOpen, setIsAgentPickerOpen] = useState(false)
  const [agentSearch, setAgentSearch] = useState('')
  const agentTemplates = useMemo(
    () => (useCases ?? []).map(normalizeUseCase),
    [useCases],
  )
  const sortedTemplates = useMemo(
    () =>
      [...agentTemplates].sort(
        (a, b) =>
          (b.numberOfUsers * b.runsPerUserPerWeek) - (a.numberOfUsers * a.runsPerUserPerWeek),
      ),
    [agentTemplates],
  )
  const filteredTemplates = useMemo(() => {
    const q = agentSearch.trim().toLowerCase()
    if (!q) return sortedTemplates
    return sortedTemplates.filter(template => template.name.toLowerCase().includes(q))
  }, [sortedTemplates, agentSearch])

  useEffect(() => {
    if (!useCases) return
    setEditableUseCases(useCases.map(normalizeUseCase))
  }, [useCases])

  const agentROIs = useMemo(
    () => computeAllAgentROI(editableUseCases, BENCHMARKS.avgHourlySalaryUsd, analysisWeeks),
    [editableUseCases, analysisWeeks],
  )

  function updateUseCase(id: string, updater: (useCase: AgentUseCase) => AgentUseCase) {
    setEditableUseCases(prev =>
      prev.map(useCase => (useCase.id === id ? normalizeUseCase(updater(useCase)) : useCase)),
    )
  }

  function handleMetricUpdate(
    useCaseId: string,
    field: 'numberOfUsers' | 'runsPerUserPerWeek',
    value: number,
  ) {
    const safeValue = Number.isFinite(value) ? Math.max(value, 0) : 0
    updateUseCase(useCaseId, useCase => ({
      ...useCase,
      [field]: field === 'numberOfUsers' ? Math.round(safeValue) : safeValue,
    }))
  }

  function handleMetaUpdate(
    useCaseId: string,
    field: 'name' | 'description',
    value: string,
  ) {
    updateUseCase(useCaseId, useCase => ({
      ...useCase,
      [field]: value,
    }))
  }

  function handleStepChange(
    useCaseId: string,
    phase: 'pre' | 'with',
    stepIndex: number,
    field: 'activity' | 'timeMinutes' | 'notes',
    value: string | number,
  ) {
    const key = phase === 'pre' ? 'preGleanSteps' : 'withGleanSteps'
    updateUseCase(useCaseId, useCase => {
      const steps = [...useCase[key]]
      const currentStep = steps[stepIndex] ?? {
        step: stepIndex + 1,
        activity: `Step ${stepIndex + 1}`,
        timeMinutes: 0,
        notes: '',
      }

      if (!steps[stepIndex]) {
        steps[stepIndex] = currentStep
      }

      steps[stepIndex] = {
        ...currentStep,
        [field]:
          field === 'timeMinutes'
            ? Math.max(Number.isFinite(value) ? Number(value) : 0, 0)
            : String(value),
      }

      return { ...useCase, [key]: steps }
    })
  }

  function handleAddStep(useCaseId: string, phase: 'pre' | 'with') {
    const key = phase === 'pre' ? 'preGleanSteps' : 'withGleanSteps'
    updateUseCase(useCaseId, useCase => ({
      ...useCase,
      [key]: [
        ...useCase[key],
        {
          step: useCase[key].length + 1,
          activity: 'New step',
          timeMinutes: 0,
          notes: '',
        },
      ],
    }))
  }

  function handleRemoveStep(useCaseId: string, phase: 'pre' | 'with', stepIndex: number) {
    const key = phase === 'pre' ? 'preGleanSteps' : 'withGleanSteps'
    updateUseCase(useCaseId, useCase => ({
      ...useCase,
      [key]: useCase[key].filter((_, index) => index !== stepIndex),
    }))
  }

  function handleAddAgentFromTemplate(template: AgentUseCase) {
    const id = `custom-agent-${Date.now()}`
    setEditableUseCases(prev => [
      normalizeUseCase({
        id,
        name: template.name,
        description: template.description,
        category: template.category,
        preGleanSteps: buildDefaultSteps(3),
        withGleanSteps: template.withGleanSteps.map(step => ({ ...step })),
        preGleanTotalMinutes: 0,
        withGleanTotalMinutes: 0,
        timeSavedPerRunMinutes: 0,
        numberOfUsers: template.numberOfUsers,
        runsPerUserPerWeek: template.runsPerUserPerWeek,
        costPerRunUsd: 0,
        qualitativeBenefits: [],
      }),
      ...prev,
    ])
    setIsAgentPickerOpen(false)
    setAgentSearch('')
  }

  function handleDeleteAgent(useCaseId: string) {
    setEditableUseCases(prev => prev.filter(useCase => useCase.id !== useCaseId))
  }

  return (
    <div className="px-8 py-6 max-w-5xl space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agents</h1>
          <span className="text-sm text-gray-400">
            ROI calculated at ${BENCHMARKS.avgHourlySalaryUsd}/hr blended rate
          </span>
        </div>
        <div className="flex items-end gap-3">
          <button
            onClick={() => setIsAgentPickerOpen(true)}
            className="h-10 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Add Agent to ROI
          </button>
          <label className="text-xs text-glean-text-secondary">
            Analysis period (weeks)
            <input
              type="number"
              min={1}
              value={analysisWeeks}
              onChange={e => setAnalysisWeeks(Math.max(Math.round(Number(e.target.value) || 0), 1))}
              className="mt-1 w-40 rounded-lg border border-glean-border px-3 py-2 text-sm text-glean-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </label>
        </div>
      </div>

      <AgentSummaryBar agentROIs={agentROIs} isLoading={isLoading} analysisWeeks={analysisWeeks} />
      <AgentValueChart agentROIs={agentROIs} isLoading={isLoading} />

      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-900">
          Agent use case breakdown
        </p>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))
        ) : (
          agentROIs.map(roi => (
            <AgentUseCaseCard
              key={roi.useCase.id}
              agentROI={roi}
              analysisWeeks={analysisWeeks}
              onMetricUpdate={handleMetricUpdate}
              onMetaUpdate={handleMetaUpdate}
              onStepChange={handleStepChange}
              onAddStep={handleAddStep}
              onRemoveStep={handleRemoveStep}
              onDeleteAgent={handleDeleteAgent}
            />
          ))
        )}
      </div>

      {isAgentPickerOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f1117]/95 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-3xl font-semibold text-white">Add Agent to ROI</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Select an existing agent, then estimate pre-Glean steps and time.
                </p>
              </div>
              <button
                onClick={() => setIsAgentPickerOpen(false)}
                className="h-10 px-4 rounded-lg border border-white/20 text-sm text-gray-200 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <input
                type="text"
                placeholder="Search agents"
                value={agentSearch}
                onChange={e => setAgentSearch(e.target.value)}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
              <div className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-gray-200">
                Most used
              </div>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-12 text-center text-gray-300">
                No agents match your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTemplates.map(template => {
                  const runsPerWeek = Math.round(template.numberOfUsers * template.runsPerUserPerWeek)
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleAddAgentFromTemplate(template)}
                      className="text-left rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 hover:border-indigo-300/40 transition-colors"
                    >
                      <p className="text-lg font-semibold text-white">{template.name}</p>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-3">{template.description}</p>
                      <div className="mt-5 flex items-center justify-between text-xs text-gray-300">
                        <span>{runsPerWeek.toLocaleString()} runs/week</span>
                        <span>{template.withGleanSteps.length} post steps</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
