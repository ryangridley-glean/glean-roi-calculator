import { AppProvider, useApp } from '@/store/AppContext'
import { FilterProvider } from '@/store/FilterContext'
import { AppShell } from '@/components/layout/AppShell'
import { OverviewPage } from '@/pages/OverviewPage'
import { DepartmentsPage } from '@/pages/DepartmentsPage'
import { ManagersPage } from '@/pages/ManagersPage'
import { AssistantPage } from '@/pages/AssistantPage'
import { AgentsPage } from '@/pages/AgentsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

const PAGE_TITLES: Record<string, string> = {
  'executive-summary': 'Executive Summary',
  'scenario-modeler': 'Scenario Modeler',
  'insights-chat': 'Insights Chat',
  'departments': 'Departments',
  'managers': 'Managers',
  'assistant': 'Assistant',
  'agents': 'Agents',
  'embedded': 'Embedded Integrations',
  'content-analytics': 'Content Analytics',
}

function Router() {
  const { activePage } = useApp()
  if (activePage === 'overview') return <OverviewPage />
  if (activePage === 'departments') return <DepartmentsPage />
  if (activePage === 'managers') return <ManagersPage />
  if (activePage === 'assistant') return <AssistantPage />
  if (activePage === 'agents') return <AgentsPage />
  return <PlaceholderPage title={PAGE_TITLES[activePage] ?? activePage} />
}

export default function App() {
  return (
    <AppProvider>
      <FilterProvider>
        <AppShell>
          <Router />
        </AppShell>
      </FilterProvider>
    </AppProvider>
  )
}
