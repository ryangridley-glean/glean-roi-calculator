import { NAV_ITEMS, NAV_SECONDARY } from '@/constants/nav'
import { useApp } from '@/store/AppContext'

export function Sidebar() {
  const { activePage, setActivePage } = useApp()

  return (
    <aside className="w-48 shrink-0 bg-white border-r border-glean-border flex flex-col h-screen sticky top-0">
      <nav className="flex-1 overflow-y-auto px-4 pt-6 pb-4">
        {/* "Insights" bold heading — matches Glean portal exactly */}
        <p className="text-[17px] font-bold text-glean-text-primary mb-3 px-1">Insights</p>

        <div className="space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                w-full text-left flex items-center justify-between px-2 py-1.5 rounded-lg text-[14px] transition-colors
                ${activePage === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-800 hover:bg-gray-50'}
              `}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="my-3 border-t border-glean-border" />

          {NAV_SECONDARY.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                w-full text-left px-2 py-1.5 rounded-lg text-[14px] transition-colors
                ${activePage === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-800 hover:bg-gray-50'}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  )
}
