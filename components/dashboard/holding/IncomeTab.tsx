'use client'

import type { NavexaRawIncome } from '@/lib/navexa-api'

interface Props { income: NavexaRawIncome[] }

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(n)
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function IncomeTab({ income }: Props) {
  const sorted = [...income].sort((a, b) => new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime())
  const total = sorted.reduce((s, i) => s + i.netAmount, 0)

  if (!sorted.length) {
    return <p className="text-slate-500 text-sm py-8 text-center">No income recorded.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            {['Ex-Date', 'Pay Date', 'Net Amount', 'Gross Amount', 'Franking Credits', 'Franked %', 'Notes'].map(h => (
              <th key={h} className={`px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider ${
                h === 'Ex-Date' || h === 'Pay Date' || h === 'Notes' ? 'text-left' : 'text-right'
              }`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(i => {
            const frankingPct = i.grossAmount > 0 ? (i.frankingCredits / i.grossAmount) * 100 : 0
            return (
              <tr key={i.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3 text-slate-300">{i.exDividendDate ? fmtDate(i.exDividendDate) : '—'}</td>
                <td className="px-4 py-3 text-slate-300">{fmtDate(i.paidDate)}</td>
                <td className="px-4 py-3 text-right font-semibold text-emerald-400">{fmt(i.netAmount)}</td>
                <td className="px-4 py-3 text-right text-slate-300">{fmt(i.grossAmount)}</td>
                <td className="px-4 py-3 text-right text-slate-400">{fmt(i.frankingCredits)}</td>
                <td className="px-4 py-3 text-right text-slate-400">{frankingPct.toFixed(0)}%</td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-[160px] truncate">{i.notes || '—'}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-700 bg-slate-800/20">
            <td colSpan={2} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Total</td>
            <td className="px-4 py-3 text-right font-bold text-emerald-400">{fmt(total)}</td>
            <td colSpan={4} />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
