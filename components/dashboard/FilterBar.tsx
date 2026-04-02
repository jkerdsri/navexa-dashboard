'use client'

import { cn } from '@/lib/utils'
import type { DashboardFilters } from '@/types/navexa'

interface Props {
  filters: DashboardFilters
  onChange: (f: DashboardFilters) => void
}

function Toggle({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
        checked
          ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200',
      )}
    >
      <span className={cn(
        'w-3 h-3 rounded-full border transition-colors',
        checked ? 'bg-emerald-400 border-emerald-400' : 'bg-transparent border-slate-500',
      )} />
      {label}
    </button>
  )
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Currency toggle */}
      <div className="flex rounded-lg border border-slate-700 overflow-hidden text-xs font-medium">
        {(['AUD', 'holding'] as const).map(c => (
          <button
            key={c}
            onClick={() => onChange({ ...filters, currency: c })}
            className={cn(
              'px-3 py-1.5 transition-colors',
              filters.currency === c
                ? 'bg-slate-700 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200',
            )}
          >
            {c === 'AUD' ? 'In AUD' : 'Local Currency'}
          </button>
        ))}
      </div>

      <Toggle
        label="Show Sold"
        checked={filters.showSold}
        onToggle={() => onChange({ ...filters, showSold: !filters.showSold })}
      />
    </div>
  )
}
