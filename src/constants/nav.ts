export interface NavItem {
  label: string
  id: string
  badge?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Executive Summary', id: 'executive-summary', badge: 'NEW' },
  { label: 'Overview', id: 'overview' },
  { label: 'Scenario Modeler', id: 'scenario-modeler', badge: 'NEW' },
  { label: 'Insights chat', id: 'insights-chat' },
  { label: 'Departments', id: 'departments' },
  { label: 'Managers', id: 'managers' },
  { label: 'Assistant', id: 'assistant' },
  { label: 'Agents', id: 'agents' },
  { label: 'Embedded integrations', id: 'embedded' },
]

export const NAV_SECONDARY: NavItem[] = [
  { label: 'Content Analytics', id: 'content-analytics' },
]
