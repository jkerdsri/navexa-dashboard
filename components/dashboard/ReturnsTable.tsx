'use client'

import { cn } from '@/lib/utils'
import type { Holding, DashboardFilters } from '@/types/navexa'

interface Props {
  holdings: Holding[]
  filters: DashboardFilters
  onSelectHolding: (h: Holding) => void
}

function fmt(n: number, decimals = 2): string {
  return n.toLocaleString('en-AU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtCurrency(n: number, currency = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
}

function PctBadge({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span className={cn(
      'inline-block text-xs px-1.5 py-0.5 rounded font-medium',
      positive ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400',
    )}>
      {positive ? '+' : ''}{fmt(value)}%
    </span>
  )
}

function ValueCell({ value, positive }: { value: number; positive?: boolean }) {
  const isPos = positive !== undefined ? positive : value >= 0
  return (
    <span className={cn(isPos ? 'text-emerald-400' : 'text-red-400')}>
      {value >= 0 ? '+' : ''}{fmtCurrency(value)}
    </span>
  )
}

const COLS = [
  { key: 'name',          label: 'Holding',         align: 'left' },
  { key: 'costBasis',     label: 'Cost Basis',       align: 'right' },
  { key: 'costPerShare',  label: '$/Share',          align: 'right' },
  { key: 'currentValue',  label: 'Current Value',    align: 'right' },
  { key: 'divYield',      label: 'Div Yield',        align: 'right' },
  { key: 'yoc',           label: 'YoC',              align: 'right' },
  { key: 'capGain',       label: 'Cap Gain',         align: 'right' },
  { key: 'realizedPnl',   label: 'Realized P&L',     align: 'right' },
  { key: 'divReceived',   label: 'Dividends',        align: 'right' },
  { key: 'totalProfit',   label: 'Total Profit',     align: 'right' },
]

export function ReturnsTable({ holdings, filters, onSelectHolding }: Props) {
  const visible = holdings.filter(h => filters.showSold ? true : !h.isSold)
  const fx = (h: Holding, n: number) => filters.currency === 'AUD' ? n * h.fxRateToAud : n

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-white">Returns</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {COLS.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap',
                    col.align === 'right' ? 'text-right' : 'text-left',
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((h, i) => (
              <tr
                key={h.id}
                className={cn(
                  'border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors',
                  h.isSold && 'opacity-50',
                )}
              >
                {/* Holding */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelectHolding(h)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left group"
                  >
                    <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {h.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-emerald-400 group-hover:text-emerald-300 underline-offset-2 group-hover:underline">
                        {h.ticker}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[120px]">{h.name}</div>
                    </div>
                    {h.isSold && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">SOLD</span>
                    )}
                  </button>
                </td>

                {/* Cost Basis */}
                <td className="px-4 py-3 text-right text-slate-200 whitespace-nowrap">
                  {fmtCurrency(fx(h, h.totalCostBasis))}
                </td>

                {/* Cost Per Share */}
                <td className="px-4 py-3 text-right text-slate-200 whitespace-nowrap">
                  ${fmt(fx(h, h.averageCostPerShare))}
                </td>

                {/* Current Value */}
                <td className="px-4 py-3 text-right text-slate-200 whitespace-nowrap">
                  {h.isSold ? '—' : fmtCurrency(fx(h, h.currentValue))}
                </td>

                {/* Div Yield */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {h.isSold ? '—' : (
                    <span className="text-emerald-400">{fmt(h.dividendYieldPct)}%</span>
                  )}
                </td>

                {/* YoC */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {h.isSold ? '—' : (
                    <span className="text-sky-400">{fmt(h.yieldOnCostPct)}%</span>
                  )}
                </td>

                {/* Cap Gain */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div><ValueCell value={fx(h, h.unrealizedGain)} /></div>
                  <div><PctBadge value={h.unrealizedGainPct} /></div>
                </td>

                {/* Realized P&L */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <ValueCell value={fx(h, h.realizedGain)} />
                </td>

                {/* Dividends */}
                <td className="px-4 py-3 text-right text-emerald-400 whitespace-nowrap">
                  +{fmtCurrency(fx(h, h.dividendsReceived))}
                </td>

                {/* Total Profit */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className={cn('font-semibold', h.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {h.totalProfit >= 0 ? '+' : ''}{fmtCurrency(fx(h, h.totalProfit))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Totals row */}
          <tfoot>
            <tr className="border-t border-slate-700 bg-slate-800/30">
              <td className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Total</td>
              <td className="px-4 py-3 text-right font-semibold text-white whitespace-nowrap">
                {fmtCurrency(visible.filter(h => !h.isSold).reduce((s, h) => s + h.totalCostBasis, 0))}
              </td>
              <td />
              <td className="px-4 py-3 text-right font-semibold text-white whitespace-nowrap">
                {fmtCurrency(visible.filter(h => !h.isSold).reduce((s, h) => s + h.currentValue, 0))}
              </td>
              <td />
              <td />
              <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                <ValueCell value={visible.reduce((s, h) => s + h.unrealizedGain, 0)} />
              </td>
              <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                <ValueCell value={visible.reduce((s, h) => s + h.realizedGain, 0)} />
              </td>
              <td className="px-4 py-3 text-right font-semibold text-emerald-400 whitespace-nowrap">
                +{fmtCurrency(visible.reduce((s, h) => s + h.dividendsReceived, 0))}
              </td>
              <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                <ValueCell value={visible.reduce((s, h) => s + h.totalProfit, 0)} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
