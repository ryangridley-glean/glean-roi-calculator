import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top search bar — matches Glean portal */}
        <header className="sticky top-0 z-10 bg-white border-b border-glean-border flex items-center px-6 py-3 gap-4">
          <button className="text-gray-500 hover:text-gray-700 text-lg leading-none font-bold">≡</button>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 w-full max-w-xl">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-gray-400 select-none">Search for anything</span>
            </div>
          </div>
          <div className="w-5" />
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
