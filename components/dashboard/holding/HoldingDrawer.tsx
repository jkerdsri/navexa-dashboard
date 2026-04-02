'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Holding } from '@/types/navexa'
import type { NavexaRawTrade, NavexaRawIncome } from '@/lib/navexa-api'
import { OverviewTab } from './OverviewTab'
import { TradesTab } from './TradesTab'
import { IncomeTab } from './IncomeTab'

type Tab = 'Overview' | 'Trades' | 'Income'
const TABS: Tab[] = ['Overview', 'Trades', 'Income']

interface Props {
  holding: Holding | null
  onClose: () => void
}

export function HoldingDrawer({ holding, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [trades, setTrades] = useState<NavexaRawTrade[]>([])
  const [income, setIncome] = useState<NavexaRawIncome[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (h: Holding) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/holdings/${h.id}`)
      const data = await res.json()
      setTrades(data.trades ?? [])
      setIncome(data.income ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (holding) {
      setActiveTab('Overview')
      load(holding)
    }
  }, [holding, load])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const isOpen = holding !== null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        'fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-slate-950 border-l border-slate-800',
        'flex flex-col shadow-2xl transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}>
        {holding && (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {holding.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white leading-tight">
                        {holding.name}
                        <span className="ml-2 text-slate-400 font-normal text-base">({holding.ticker})</span>
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                        <span>{holding.ticker}:{holding.exchange}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-300">MooMoo</span>
                        <span className="text-slate-600">|</span>
                        <span>{holding.sector}</span>
                        {holding.currentPrice > 0 && (
                          <>
                            <span className="text-slate-600">|</span>
                            <span className="text-white font-medium">${holding.currentPrice.toFixed(3)}</span>
                            <span className={cn(
                              'flex items-center gap-0.5',
                              holding.unrealizedGain >= 0 ? 'text-emerald-400' : 'text-red-400',
                            )}>
                              {holding.unrealizedGain >= 0
                                ? <TrendingUp className="w-3 h-3" />
                                : <TrendingDown className="w-3 h-3" />}
                              {holding.unrealizedGainPct >= 0 ? '+' : ''}{holding.unrealizedGainPct.toFixed(2)}%
                            </span>
                          </>
                        )}
                        {holding.isSold && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 text-xs">SOLD</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4 border-b border-slate-800 -mb-5">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                      activeTab === tab
                        ? 'text-white border-emerald-400'
                        : 'text-slate-400 border-transparent hover:text-white',
                    )}
                  >
                    {tab}
                    {tab === 'Trades' && trades.length > 0 && (
                      <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {trades.length}
                      </span>
                    )}
                    {tab === 'Income' && income.length > 0 && (
                      <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400">
                        {income.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <span className="text-slate-500 text-sm">Loading…</span>
                </div>
              ) : (
                <>
                  {activeTab === 'Overview' && <OverviewTab holding={holding} />}
                  {activeTab === 'Trades'   && <TradesTab trades={trades} />}
                  {activeTab === 'Income'   && <IncomeTab income={income} />}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
