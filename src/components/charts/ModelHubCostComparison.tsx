import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import { MODEL_HUB_SCENARIOS, MODEL_HUB_PERIOD_LABEL } from '@/constants/modelHubScenarios'
import { formatCurrency } from '@/lib/formatters'

const COLORS = {
  openSource: '#8B5CF6',
  waldo: '#10B981',
  frontier: '#6366F1',
}

export function ModelHubCostComparison() {
  const data = MODEL_HUB_SCENARIOS.map(s => ({
    scenario: s.label,
    openSource: s.openSourceCostUsd,
    waldo: s.waldoCostUsd,
    frontier: s.frontierCostUsd,
    total: s.totalCostUsd,
  }))

  const modelHubTotal = MODEL_HUB_SCENARIOS.find(s => s.id === 'model-hub')!.totalCostUsd
  const gptOnlyTotal = MODEL_HUB_SCENARIOS.find(s => s.id === 'gpt-only')!.totalCostUsd
  const opusOnlyTotal = MODEL_HUB_SCENARIOS.find(s => s.id === 'opus-only')!.totalCostUsd
  const vsGpt = Math.round(((gptOnlyTotal - modelHubTotal) / gptOnlyTotal) * 100)
  const vsOpus = Math.round(((opusOnlyTotal - modelHubTotal) / opusOnlyTotal) * 100)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Total inference cost by routing strategy</h3>
        <p className="text-sm text-gray-500">
          What total token spend would have been with frontier-only routing vs. Model Hub (open-source models + Waldo)
        </p>
        <p className="text-xs text-gray-400 mt-1">{MODEL_HUB_PERIOD_LABEL}</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
          <XAxis dataKey="scenario" tick={{ fontSize: 12, fill: '#5F6368' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#9AA0A6' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatCurrency(v)}
          />
          <Tooltip
            formatter={(v: number, name: string) => {
              const labels: Record<string, string> = {
                openSource: 'Open-source models',
                waldo: 'Waldo',
                frontier: 'Frontier models',
              }
              return [formatCurrency(v), labels[name] ?? name]
            }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8EAED' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                openSource: 'Open-source models',
                waldo: 'Waldo',
                frontier: 'Frontier models',
              }
              return labels[value] ?? value
            }}
          />
          <Bar dataKey="openSource" stackId="a" fill={COLORS.openSource}>
            {data.map((row, i) => (
              <Cell key={i} fill={row.openSource > 0 ? COLORS.openSource : 'transparent'} />
            ))}
          </Bar>
          <Bar dataKey="waldo" stackId="a" fill={COLORS.waldo}>
            {data.map((row, i) => (
              <Cell key={i} fill={row.waldo > 0 ? COLORS.waldo : 'transparent'} />
            ))}
          </Bar>
          <Bar dataKey="frontier" stackId="a" fill={COLORS.frontier} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {MODEL_HUB_SCENARIOS.map(s => (
          <div key={s.id} className="bg-gray-50 rounded-lg px-3 py-2.5">
            <p className="text-xs font-semibold text-gray-800">{s.label}</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{formatCurrency(s.totalCostUsd)}</p>
            <p className="text-[10px] text-gray-500 mt-1 leading-snug">{s.description}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Model Hub saves {vsGpt}% vs. GPT-5.5-only and {vsOpus}% vs. Opus 4.8-only ({formatCurrency(modelHubTotal)} total)
      </p>
    </div>
  )
}
