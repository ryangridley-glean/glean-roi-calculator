import { useState } from 'react'
import type { WaldoSavingsResult } from '@/lib/waldoValue'
import { FrontierTokensDivertedChart } from '@/components/charts/FrontierTokensDivertedChart'
import { WaldoCostComparison } from '@/components/charts/WaldoCostComparison'
import { ModelHubCostComparison } from '@/components/charts/ModelHubCostComparison'

type Tab = 'waldo' | 'model-hub'

const TABS: { id: Tab; label: string; description: string }[] = [
  {
    id: 'waldo',
    label: 'Waldo savings',
    description: 'Frontier token diversion and cost with vs. without Waldo',
  },
  {
    id: 'model-hub',
    label: 'Model Hub',
    description: 'Frontier-only baselines vs. open-source models + Waldo routing',
  },
]

interface WaldoSavingsTabsProps {
  savings: WaldoSavingsResult | null
  isLoading?: boolean
}

export function WaldoSavingsTabs({ savings, isLoading }: WaldoSavingsTabsProps) {
  const [active, setActive] = useState<Tab>('waldo')
  const tab = TABS.find(t => t.id === active)!

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-4">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`
              px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
              ${active === t.id
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">{tab.description}</p>

      {active === 'waldo' ? (
        <div className="grid grid-cols-2 gap-4">
          <FrontierTokensDivertedChart savings={savings} isLoading={isLoading} />
          <WaldoCostComparison savings={savings} isLoading={isLoading} />
        </div>
      ) : (
        <ModelHubCostComparison />
      )}
    </div>
  )
}
