import type { CompetitorId, CompetitorProfile, ConsolidationItem, StackCoverageRow } from '@/types/tco'

export const COMPETITORS: Record<CompetitorId, CompetitorProfile> = {
  'microsoft-copilot': {
    id: 'microsoft-copilot',
    label: 'Microsoft Copilot + M365',
    shortLabel: 'Copilot',
    color: '#0078D4',
    perSeatMonthlyUsd: 30,
    productivitySuiteMonthlyUsd: 36,
    supplementalSearchAnnualUsd: 48_000,
    diyFteRequired: 0.5,
    diyFteLoadedCostUsd: 165_000,
    infraAnnualUsd: 36_000,
    inferenceCostMultiplier: 2.8,
    coveragePct: 62,
    gaps: ['Salesforce', 'Zendesk', 'Confluence (non-M365)', 'Custom internal apps'],
    strengths: ['Deep Word/Outlook/Teams integration', 'Familiar Microsoft UX'],
  },
  'chatgpt-enterprise': {
    id: 'chatgpt-enterprise',
    label: 'ChatGPT Enterprise + DIY RAG',
    shortLabel: 'ChatGPT Ent.',
    color: '#10A37F',
    perSeatMonthlyUsd: 60,
    productivitySuiteMonthlyUsd: 0,
    supplementalSearchAnnualUsd: 72_000,
    diyFteRequired: 2,
    diyFteLoadedCostUsd: 180_000,
    infraAnnualUsd: 96_000,
    inferenceCostMultiplier: 3.9,
    coveragePct: 45,
    gaps: ['Permission-aware enterprise retrieval', 'Cross-app orchestration', 'Governed agent workflows'],
    strengths: ['Strong general reasoning', 'Fast time-to-first-chat'],
  },
  'google-gemini': {
    id: 'google-gemini',
    label: 'Google Gemini Workspace',
    shortLabel: 'Gemini',
    color: '#4285F4',
    perSeatMonthlyUsd: 30,
    productivitySuiteMonthlyUsd: 18,
    supplementalSearchAnnualUsd: 52_000,
    diyFteRequired: 0.5,
    diyFteLoadedCostUsd: 165_000,
    infraAnnualUsd: 32_000,
    inferenceCostMultiplier: 2.6,
    coveragePct: 58,
    gaps: ['Microsoft 365 content', 'Salesforce', 'On-prem file shares', 'Proprietary internal wikis'],
    strengths: ['Gmail/Docs/Sheets native', 'Competitive per-seat pricing'],
  },
  'build-your-own': {
    id: 'build-your-own',
    label: 'Build-your-own AI stack',
    shortLabel: 'DIY stack',
    color: '#6B7280',
    perSeatMonthlyUsd: 0,
    productivitySuiteMonthlyUsd: 0,
    supplementalSearchAnnualUsd: 0,
    diyFteRequired: 3,
    diyFteLoadedCostUsd: 185_000,
    infraAnnualUsd: 120_000,
    inferenceCostMultiplier: 3.2,
    coveragePct: 40,
    gaps: ['Unified UX', 'Ongoing connector maintenance', 'Enterprise permissions model'],
    strengths: ['Full control', 'No vendor platform fee'],
  },
}

export const CONSOLIDATION_ITEMS: ConsolidationItem[] = [
  { id: 'legacy-search', tool: 'Legacy enterprise search', category: 'Search', annualSpendUsd: 85_000, replacedBy: 'Glean Search', reductionPct: 100 },
  { id: 'chatgpt-seats', tool: 'ChatGPT Team / Plus (shadow)', category: 'AI chat', annualSpendUsd: 42_000, replacedBy: 'Glean Assistant', reductionPct: 80 },
  { id: 'perplexity', tool: 'Perplexity Enterprise pilot', category: 'AI chat', annualSpendUsd: 18_000, replacedBy: 'Glean Assistant', reductionPct: 100 },
  { id: 'consultant-find', tool: 'Consultant "find the doc" hours', category: 'Services', annualSpendUsd: 65_000, replacedBy: 'Glean Search + Agents', reductionPct: 60 },
  { id: 'zendesk-deflect', tool: 'L1 IT helpdesk volume', category: 'Support', annualSpendUsd: 95_000, replacedBy: 'Glean Assistant', reductionPct: 25 },
  { id: 'rag-infra', tool: 'Vector DB + embedding pipeline', category: 'Infrastructure', annualSpendUsd: 48_000, replacedBy: 'Waldo + Model Hub', reductionPct: 70 },
]

export const STACK_COVERAGE: StackCoverageRow[] = [
  { source: 'Microsoft 365 / Google Workspace', gleanPct: 98, competitorPct: 95 },
  { source: 'Salesforce & CRM', gleanPct: 96, competitorPct: 35 },
  { source: 'Confluence / Notion / wikis', gleanPct: 94, competitorPct: 55 },
  { source: 'Slack / Teams messages', gleanPct: 92, competitorPct: 70 },
  { source: 'Zendesk / support tickets', gleanPct: 90, competitorPct: 20 },
  { source: 'Jira / Linear / dev tools', gleanPct: 88, competitorPct: 45 },
  { source: 'Custom internal apps', gleanPct: 82, competitorPct: 15 },
  { source: 'Permission-aware answers', gleanPct: 99, competitorPct: 40 },
]

export function getCompetitor(id: CompetitorId): CompetitorProfile {
  return COMPETITORS[id]
}
