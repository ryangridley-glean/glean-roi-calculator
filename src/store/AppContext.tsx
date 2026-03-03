import { createContext, useContext, useState, type ReactNode } from 'react'

interface AppContextValue {
  activePage: string
  setActivePage: (page: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState('overview')
  return (
    <AppContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
