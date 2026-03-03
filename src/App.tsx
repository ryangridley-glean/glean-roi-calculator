import { AppProvider, useApp } from '@/store/AppContext'
import { FilterProvider } from '@/store/FilterContext'
import { AppShell } from '@/components/layout/AppShell'
import { OverviewPage } from '@/pages/OverviewPage'
import { AgentsPage } from '@/pages/AgentsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

const PAGE_TITLES: Record<string, string> = {
  'insights-chat': 'Insights Chat',
  'departments':   'Departments',
  'assistant':     'Assistant',
  'agents':        'Agents',
  'embedded':      'Embedded Integrations',
  'announcements': 'Announcements',
  'answers':       'Answers',
  'collections':   'Collections',
  'go-links':      'Go Links',
}

function Router() {
  const { activePage } = useApp()
  if (activePage === 'overview') return <OverviewPage />
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
