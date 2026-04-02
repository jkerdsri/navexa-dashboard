'use client'

import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  subPositive?: boolean | null  // null = neutral
  icon?: React.ReactNode
  accent?: boolean
}

export function MetricCard({ label, value, sub, subPositive, icon, accent }: MetricCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-3',
      accent && 'border-emerald-800/50 bg-emerald-950/30',
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && (
        <div className={cn(
          'text-xs font-medium',
          subPositive === true && 'text-emerald-400',
          subPositive === false && 'text-red-400',
          subPositive === null && 'text-slate-400',
        )}>
          {sub}
        </div>
      )}
    </div>
  )
}
