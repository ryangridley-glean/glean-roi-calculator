export interface NavItem {
  label: string
  id: string
  badge?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', id: 'overview' },
  { label: 'Insights chat', id: 'insights-chat', badge: 'NEW' },
  { label: 'Departments', id: 'departments' },
  { label: 'Managers', id: 'managers' },
  { label: 'Assistant', id: 'assistant' },
  { label: 'Agents', id: 'agents' },
  { label: 'Embedded integrations', id: 'embedded' },
]

export const NAV_SECONDARY: NavItem[] = [
  { label: 'Announcements', id: 'announcements' },
  { label: 'Answers', id: 'answers' },
  { label: 'Collections', id: 'collections' },
  { label: 'Go Links', id: 'go-links' },
]
