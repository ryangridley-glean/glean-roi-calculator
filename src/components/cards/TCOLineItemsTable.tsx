import type { TCOLineItem } from '@/types/tco'
import { formatCurrency } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface TCOLineItemsTableProps {
  lineItems: TCOLineItem[]
  gleanTotal: number
  competitorTotal: number
  competitorLabel: string
  isLoading?: boolean
}

export function TCOLineItemsTable({
  lineItems,
  gleanTotal,
  competitorTotal,
  competitorLabel,
  isLoading,
}: TCOLineItemsTableProps) {
  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />

  return (
    <div className="card overflow-hidden p-0">
      <div className="px-5 py-4 border-b border-glean-border">
        <h3 className="text-base font-semibold text-glean-text-primary">TCO line-item breakdown</h3>
        <p className="text-sm text-glean-text-secondary">Annual hard costs by category</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-glean-surface text-left text-xs text-glean-text-secondary uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium text-right">Glean</th>
              <th className="px-5 py-3 font-medium text-right">{competitorLabel}</th>
              <th className="px-5 py-3 font-medium text-right">Delta</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map(item => {
              const delta = item.competitorUsd - item.gleanUsd
              return (
                <tr key={item.id} className="border-t border-glean-border hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-glean-text-primary">{item.label}</p>
                    <p className="text-xs text-glean-text-tertiary">{item.description}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-glean-text-primary">
                    {formatCurrency(item.gleanUsd)}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-glean-text-primary">
                    {formatCurrency(item.competitorUsd)}
                  </td>
                  <td className={`px-5 py-3 text-right font-semibold ${delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {delta >= 0 ? '+' : ''}{formatCurrency(delta)}
                  </td>
                </tr>
              )
            })}
            <tr className="border-t-2 border-glean-border bg-glean-surface font-semibold">
              <td className="px-5 py-3 text-glean-text-primary">Total annual TCO</td>
              <td className="px-5 py-3 text-right text-glean-blue">{formatCurrency(gleanTotal)}</td>
              <td className="px-5 py-3 text-right">{formatCurrency(competitorTotal)}</td>
              <td className="px-5 py-3 text-right text-emerald-600">
                +{formatCurrency(competitorTotal - gleanTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
