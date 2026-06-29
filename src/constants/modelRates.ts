export type FrontierModelId = 'gpt-5.5' | 'opus-4.8'
export type ModelId = FrontierModelId | 'waldo'

export interface ModelRate {
  id: ModelId
  label: string
  inputPerM: number
  outputPerM: number
  sourceNote?: string
}

export const MODEL_RATES: Record<ModelId, ModelRate> = {
  waldo: {
    id: 'waldo',
    label: 'Waldo',
    inputPerM: 0.50,
    outputPerM: 2.50,
    sourceNote: 'Waldo opt-in terms (Jun 2026)',
  },
  'gpt-5.5': {
    id: 'gpt-5.5',
    label: 'GPT-5.5',
    inputPerM: 1.25,
    outputPerM: 10.00,
    sourceNote: 'GPT-5.4 proxy until 5.5 published',
  },
  'opus-4.8': {
    id: 'opus-4.8',
    label: 'Claude Opus 4.8',
    inputPerM: 5.00,
    outputPerM: 25.00,
    sourceNote: 'Opus 4.7 rates',
  },
}

/** Traffic split across frontier models for Waldo-routed queries */
export const FRONTIER_MODEL_SHARES: Record<FrontierModelId, number> = {
  'gpt-5.5': 0.70,
  'opus-4.8': 0.30,
}

/** Per-query token assumptions from Waldo customer opt-in example */
export const WALDO_PER_QUERY = {
  withoutWaldo: { frontierInput: 95_000, frontierOutput: 3_000 },
  withWaldo: {
    frontierInput: 70_000,
    frontierOutput: 2_000,
    waldoInput: 15_000,
    waldoOutput: 1_000,
  },
  divertedTotalTokens: 26_000,
} as const

export function tokenCostUsd(
  inputTokens: number,
  outputTokens: number,
  rate: ModelRate,
): number {
  return (inputTokens / 1_000_000) * rate.inputPerM
    + (outputTokens / 1_000_000) * rate.outputPerM
}
