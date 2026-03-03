export interface AgentStep {
  step: number
  activity: string
  timeMinutes: number
  notes: string
}

export interface QualitativeBenefit {
  area: string
  description: string
}

export interface AgentUseCase {
  id: string
  name: string
  description: string
  category: string
  preGleanSteps: AgentStep[]
  withGleanSteps: AgentStep[]
  preGleanTotalMinutes: number
  withGleanTotalMinutes: number
  timeSavedPerRunMinutes: number
  numberOfUsers: number
  runsPerUserPerWeek: number
  costPerRunUsd: number
  qualitativeBenefits: QualitativeBenefit[]
}

export interface AgentROI {
  useCase: AgentUseCase
  annualTimeSavedHours: number
  annualValueUsd: number
  annualCostUsd: number
  netBenefitUsd: number
  valueCostRatio: number
  timeReductionPercent: number
  annualRunsTotal: number
}
