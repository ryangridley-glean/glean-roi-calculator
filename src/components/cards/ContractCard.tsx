import { useState } from 'react'
import type { ContractInfo } from '@/types/contract'
import { formatDate, formatNumber } from '@/lib/formatters'
import { diffDays, today } from '@/lib/dateUtils'

interface ContractCardProps {
  contract: ContractInfo
  onContractValueChange: (val: number | null) => void
}

export function ContractCard({ contract, onContractValueChange }: ContractCardProps) {
  const [inputVal, setInputVal] = useState(
    contract.contractValueUsd ? String(contract.contractValueUsd) : ''
  )

  const daysActive = diffDays(contract.contractStartDate, today())
  const totalDays  = diffDays(contract.contractStartDate, contract.contractEndDate)
  const daysLeft   = diffDays(today(), contract.contractEndDate)
  const utilization = Math.round((daysActive / totalDays) * 100)

  function handleBlur() {
    const n = parseFloat(inputVal.replace(/[^0-9.]/g, ''))
    onContractValueChange(isNaN(n) ? null : n)
  }

  const items = [
    { label: 'Company', value: contract.companyName },
    { label: 'Contract start', value: formatDate(contract.contractStartDate) },
    { label: 'Contract end', value: formatDate(contract.contractEndDate) },
    { label: 'Days active', value: `${formatNumber(daysActive)} of ${totalDays}` },
    { label: 'Days remaining', value: daysLeft > 0 ? `${daysLeft} days` : 'Expired' },
    { label: 'Licensed seats', value: formatNumber(contract.licensedSeats) },
  ]

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-glean-text-primary mb-4">Contract Details</h3>

      {/* Progress bar for contract period */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-glean-text-tertiary mb-1">
          <span>{formatDate(contract.contractStartDate)}</span>
          <span>{utilization}% complete</span>
          <span>{formatDate(contract.contractEndDate)}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-glean-blue rounded-full"
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-5">
        {items.map(item => (
          <div key={item.label}>
            <p className="text-xs text-glean-text-tertiary mb-0.5">{item.label}</p>
            <p className="font-medium text-glean-text-primary">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Contract value input */}
      <div className="border-t border-glean-border pt-4">
        <label className="text-xs text-glean-text-secondary block mb-1.5">
          Annual contract value (for ROI multiplier)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-glean-text-secondary text-sm">$</span>
          <input
            type="text"
            placeholder="e.g. 240000"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onBlur={handleBlur}
            className="flex-1 border border-glean-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-glean-blue"
          />
        </div>
      </div>
    </div>
  )
}
