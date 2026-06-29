/** Illustrative Model Hub cost scenarios (fake data for demo) */

export interface ModelHubScenario {
  id: string
  label: string
  totalCostUsd: number
  openSourceCostUsd: number
  waldoCostUsd: number
  frontierCostUsd: number
  description: string
}

export const MODEL_HUB_SCENARIOS: ModelHubScenario[] = [
  {
    id: 'gpt-only',
    label: 'GPT-5.5 only',
    totalCostUsd: 1_240_000,
    openSourceCostUsd: 0,
    waldoCostUsd: 0,
    frontierCostUsd: 1_240_000,
    description: 'All Assistant & Agents queries routed to GPT-5.5 with no Waldo or open-source routing',
  },
  {
    id: 'opus-only',
    label: 'Opus 4.8 only',
    totalCostUsd: 4_870_000,
    openSourceCostUsd: 0,
    waldoCostUsd: 0,
    frontierCostUsd: 4_870_000,
    description: 'All Assistant & Agents queries routed to Claude Opus 4.8 with no Waldo or open-source routing',
  },
  {
    id: 'model-hub',
    label: 'Model Hub',
    totalCostUsd: 318_000,
    openSourceCostUsd: 142_000,
    waldoCostUsd: 118_000,
    frontierCostUsd: 58_000,
    description: 'Model Hub routes routine work to open-source models, Waldo orchestrates retrieval, frontier models handle complex tasks only',
  },
]

export const MODEL_HUB_PERIOD_LABEL = '90-day period · illustrative data'
