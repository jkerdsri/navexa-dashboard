'use client'

import { cn } from '@/lib/utils'
import type { NavexaRawTrade } from '@/lib/navexa-api'

interface Props { trades: NavexaRawTrade[] }

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(n)
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function TradesTab({ trades }: Props) {
  const sorted = [...trades].sort((a, b) => new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime())
  const totalQty = sorted.reduce((s, t) => s + (t.tradeType === 'Buy' ? t.quantity : -t.quantity), 0)
  const totalBrokerage = sorted.reduce((s, t) => s + t.brokerage, 0)

  if (!sorted.length) {
    return <p className="text-slate-500 text-sm py-8 text-center">No trades recorded.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            {['Trade Date', 'Type', 'Price', 'Quantity', 'Brokerage', 'Value'].map(h => (
              <th key={h} className={cn(
                'px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider',
                h === 'Trade Date' || h === 'Type' ? 'text-left' : 'text-right',
              )}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(t => {
            const isBuy = t.tradeType === 'Buy'
            return (
              <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3 text-slate-300">{fmtDate(t.tradeDate)}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-semibold',
                    isBuy ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400',
                  )}>{t.tradeType}</span>
                </td>
                <td className="px-4 py-3 text-right text-slate-200">{fmt(t.price)}</td>
                <td className={cn('px-4 py-3 text-right font-medium', isBuy ? 'text-slate-200' : 'text-red-400')}>
                  {isBuy ? '' : '-'}{t.quantity}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">{fmt(t.brokerage)}</td>
                <td className={cn('px-4 py-3 text-right font-semibold', isBuy ? 'text-slate-200' : 'text-red-400')}>
                  {isBuy ? '' : '-'}{fmt(Math.abs(t.value))}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-700 bg-slate-800/20">
            <td colSpan={3} />
            <td className="px-4 py-3 text-right font-semibold text-white">{totalQty}</td>
            <td className="px-4 py-3 text-right font-semibold text-white">{fmt(totalBrokerage)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
