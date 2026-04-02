'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { Holding } from '@/types/navexa'

interface Props { holding: Holding }

const PERIODS = ['5D', '1M', '6M', 'YTD', '1Y', '3Y', '5Y', 'All'] as const
type Period = typeof PERIODS[number]

function fmt(n: number, decimals = 2) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD', minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n)
}

function StatRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-800/60">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-medium ${valueClass ?? 'text-white'}`}>{value}</span>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
      <div className="text-slate-400 mb-1">{label}</div>
      <div className="font-semibold text-white">${payload[0].value?.toFixed(2)}</div>
    </div>
  )
}

export function OverviewTab({ holding }: Props) {
  const [period, setPeriod] = useState<Period>('1Y')
  const [prices, setPrices] = useState<{ date: string; price: number }[]>([])
  const [loadingChart, setLoadingChart] = useState(true)

  useEffect(() => {
    setLoadingChart(true)
    fetch(`/api/holdings/${holding.id}/price-history?ticker=${holding.ticker}&period=${period}`)
      .then(r => r.json())
      .then(d => { setPrices(d.prices ?? []); setLoadingChart(false) })
      .catch(() => setLoadingChart(false))
  }, [holding.id, holding.ticker, period])

  const firstPrice = prices[0]?.price ?? 0
  const lastPrice = prices[prices.length - 1]?.price ?? 0
  const chartGain = firstPrice > 0 ? lastPrice - firstPrice : 0
  const chartGainPct = firstPrice > 0 ? (chartGain / firstPrice) * 100 : 0
  const isPositive = chartGain >= 0
  const strokeColor = isPositive ? '#22c55e' : '#ef4444'
  const fillColor = isPositive ? '#22c55e' : '#ef4444'

  // Thin display of dates on X axis
  const tickCount = Math.min(prices.length, 8)
  const step = Math.floor(prices.length / tickCount) || 1
  const xTicks = prices.filter((_, i) => i % step === 0).map(p => p.date)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Performance summary ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Holding Value', value: fmt(holding.currentValue), sub: null },
          {
            label: 'Capital Gain',
            value: fmt(holding.unrealizedGain),
            sub: `${holding.unrealizedGainPct >= 0 ? '+' : ''}${holding.unrealizedGainPct.toFixed(2)}%`,
            positive: holding.unrealizedGain >= 0,
          },
          { label: 'Income Return', value: fmt(holding.dividendsReceived), sub: null, positive: true },
          {
            label: 'Total Return',
            value: fmt(holding.totalProfit),
            sub: null,
            positive: holding.totalProfit >= 0,
          },
        ].map(card => (
          <div key={card.label} className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-3">
            <div className="text-xs text-slate-400 mb-1">{card.label}</div>
            <div className={`text-base font-bold ${
              card.positive === undefined ? 'text-white'
              : card.positive ? 'text-emerald-400' : 'text-red-400'
            }`}>{card.value}</div>
            {card.sub && (
              <div className={`text-xs mt-0.5 ${card.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {card.positive ? '▲' : '▼'} {card.sub} p.a.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Price chart ─────────────────────────────────── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-semibold text-white">Price</span>
            {!loadingChart && prices.length > 0 && (
              <span className={`text-xs ml-3 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{chartGain.toFixed(2)} ({chartGainPct >= 0 ? '+' : ''}{chartGainPct.toFixed(2)}%)
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  period === p
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loadingChart ? (
          <div className="h-48 flex items-center justify-center">
            <span className="text-slate-500 text-sm">Loading chart…</span>
          </div>
        ) : prices.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <span className="text-slate-500 text-sm">No price data available</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={prices} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${holding.ticker}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fillColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                ticks={xTicks}
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={d => {
                  const date = new Date(d)
                  return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
                }}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={52}
                tickFormatter={v => `$${v.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={1.5}
                fill={`url(#grad-${holding.ticker})`}
                dot={false}
                activeDot={{ r: 3, fill: strokeColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Key Stats ───────────────────────────────────── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Key Stats</h3>
        <div className="flex flex-col">
          <StatRow label="Holding Value" value={fmt(holding.currentValue)} />
          <StatRow label="Current Quantity" value={holding.shares.toFixed(holding.shares % 1 === 0 ? 0 : 4)} />
          <StatRow label="Current Price" value={`$${holding.currentPrice.toFixed(3)}`} />
          <StatRow label="Avg Buy Price" value={`$${holding.averageCostPerShare.toFixed(4)} p/s`} />
          <StatRow label="Cost Basis" value={`${fmt(holding.totalCostBasis)} ($${holding.averageCostPerShare.toFixed(4)} p/s)`} />
          <StatRow
            label="Capital Gain"
            value={`${fmt(holding.unrealizedGain)} (${holding.unrealizedGainPct >= 0 ? '+' : ''}${holding.unrealizedGainPct.toFixed(2)}%)`}
            valueClass={holding.unrealizedGain >= 0 ? 'text-emerald-400' : 'text-red-400'}
          />
          <StatRow label="Total Dividends Received" value={fmt(holding.dividendsReceived)} valueClass="text-emerald-400" />
          <StatRow
            label="Dividend Yield"
            value={holding.dividendYieldPct > 0 ? `${holding.dividendYieldPct.toFixed(2)}%` : '—'}
            valueClass="text-emerald-400"
          />
          <StatRow
            label="Yield on Cost"
            value={holding.yieldOnCostPct > 0 ? `${holding.yieldOnCostPct.toFixed(2)}%` : '—'}
          />
          <StatRow label="Sector" value={holding.sector} valueClass="text-slate-300" />
          <StatRow label="Exchange" value={`${holding.ticker}:${holding.exchange}`} valueClass="text-slate-300" />
        </div>
      </div>

    </div>
  )
}
