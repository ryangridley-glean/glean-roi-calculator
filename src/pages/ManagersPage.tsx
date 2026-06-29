const MANAGERS = [
  { name: 'Alex Chen',     dept: 'Engineering', teamSize: 18, wau: 15, searches: 1420, chats: 380, status: 'champion' },
  { name: 'Jordan Lee',    dept: 'Support',     teamSize: 12, wau: 10, searches:  980, chats: 520, status: 'champion' },
  { name: 'Sam Patel',     dept: 'Product',     teamSize: 10, wau:  7, searches:  640, chats: 210, status: 'healthy' },
  { name: 'Taylor Brooks', dept: 'Engineering', teamSize: 15, wau:  9, searches:  880, chats: 240, status: 'healthy' },
  { name: 'Morgan Kim',    dept: 'Sales',       teamSize: 14, wau:  5, searches:  420, chats: 310, status: 'at-risk' },
  { name: 'Casey Rivera',  dept: 'Marketing',   teamSize: 11, wau:  3, searches:  210, chats: 120, status: 'at-risk' },
  { name: 'Drew Foster',   dept: 'HR',          teamSize:  9, wau:  4, searches:  290, chats: 180, status: 'at-risk' },
  { name: 'Quinn Abbott',  dept: 'Finance',     teamSize: 10, wau:  2, searches:  120, chats:  60, status: 'critical' },
  { name: 'Blair Nguyen',  dept: 'Legal',       teamSize:  8, wau:  1, searches:   48, chats:  12, status: 'critical' },
]

const STATUS_CONFIG = {
  champion: { label: '🏆 Champion', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  healthy:  { label: '✅ Healthy',  bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-700' },
  'at-risk':{ label: '⚠️ At risk',  bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700' },
  critical: { label: '🚨 Critical', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     badge: 'bg-red-100 text-red-700' },
}

export function ManagersPage() {
  const champions = MANAGERS.filter(m => m.status === 'champion').length
  const atRisk    = MANAGERS.filter(m => m.status === 'at-risk' || m.status === 'critical').length

  return (
    <div className="px-8 py-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Managers</h1>
        <p className="text-sm text-gray-500 mt-1">Team-level adoption analytics and manager accountability</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Champion managers', value: champions, color: 'text-emerald-600', desc: 'driving strong team adoption' },
          { label: 'Managers needing support', value: atRisk, color: 'text-red-500', desc: 'teams below activity threshold' },
          { label: 'Avg team activity rate', value: `${Math.round(MANAGERS.reduce((s,m)=>s+(m.wau/m.teamSize*100),0)/MANAGERS.length)}%`, color: 'text-indigo-600', desc: 'weekly active users / team size' },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs font-medium text-gray-700 mt-1">{m.label}</p>
            <p className="text-[10px] text-gray-400">{m.desc}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {MANAGERS.sort((a,b) => (b.wau/b.teamSize) - (a.wau/a.teamSize)).map(mgr => {
          const cfg = STATUS_CONFIG[mgr.status as keyof typeof STATUS_CONFIG]
          const actPct = Math.round((mgr.wau / mgr.teamSize) * 100)
          return (
            <div key={mgr.name} className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm shrink-0">{mgr.name.split(' ').map(n=>n[0]).join('')}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{mgr.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{mgr.dept} · {mgr.teamSize} direct reports</p>
                </div>
                <div className="grid grid-cols-4 gap-5 text-right">
                  {[{ label: 'WAU', val: `${mgr.wau} / ${mgr.teamSize}` },{ label: 'Activity', val: `${actPct}%` },{ label: 'Searches', val: mgr.searches.toLocaleString() },{ label: 'Chats', val: mgr.chats.toLocaleString() }].map(s => (
                    <div key={s.label}><p className="text-sm font-bold text-gray-900">{s.val}</p><p className="text-[10px] text-gray-400">{s.label}</p></div>
                  ))}
                </div>
              </div>
              {mgr.status !== 'champion' && mgr.status !== 'healthy' && (
                <div className="mt-3 pt-3 border-t border-opacity-30 border-current text-xs text-amber-800">
                  💡 <strong>Suggested action:</strong> Schedule a 1:1 with {mgr.name.split(' ')[0]} to review Glean adoption blockers for their {mgr.dept} team.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
