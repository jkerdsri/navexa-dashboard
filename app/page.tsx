'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, BarChart2, Percent, RefreshCw } from 'lucide-react'

import { getSectorAllocation, getMonthlyDividends, getDividendGrowthByYear } from '@/lib/mock-data'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ReturnsTable } from '@/components/dashboard/ReturnsTable'
import { SectorChart } from '@/components/dashboard/SectorChart'
import { DividendBarChart } from '@/components/dashboard/DividendBarChart'
import { DividendGrowthChart } from '@/components/dashboard/DividendGrowthChart'
import { FilterBar } from '@/components/dashboard/FilterBar'
import { HoldingDrawer } from '@/components/dashboard/holding/HoldingDrawer'
import type { NavexaPortfolio, Holding, DashboardFilters } from '@/types/navexa'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

function fmtPct(n: number, decimals = 1) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`
}

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<NavexaPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<DashboardFilters>({ showSold: false, currency: 'AUD' })
  const [dividendYear, setDividendYear] = useState(new Date().getFullYear())
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/portfolio')
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data: NavexaPortfolio = await res.json()
      setPortfolio(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading portfolio from Navexa…</p>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <p className="text-red-400 text-sm">{error ?? 'No data'}</p>
          <button onClick={load} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { metrics, holdings } = portfolio
  const sectorData = getSectorAllocation(holdings)
  const monthlyDividends = getMonthlyDividends(holdings, dividendYear)
  const dividendGrowth = getDividendGrowthByYear(holdings)
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 2, currentYear - 1, currentYear]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-white text-sm">{portfolio.name}</span>
              <span className="text-slate-500 text-xs ml-2">via Navexa</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FilterBar filters={filters} onChange={setFilters} />
            <button
              onClick={load}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">

        {/* ── Metric Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Portfolio Value"
            value={fmtCurrency(metrics.totalValue)}
            sub={`Cost basis ${fmtCurrency(metrics.totalCostBasis)}`}
            subPositive={null}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <MetricCard
            label="Total Profit"
            value={fmtCurrency(metrics.totalProfit)}
            sub={`Unrealized ${fmtCurrency(metrics.totalUnrealizedGain)} · Realized ${fmtCurrency(metrics.totalRealizedGain)} · Divs ${fmtCurrency(metrics.totalDividendsReceived)}`}
            subPositive={metrics.totalProfit >= 0}
            icon={<TrendingUp className="w-4 h-4" />}
            accent={metrics.totalProfit >= 0}
          />
          <MetricCard
            label="Unrealized Return"
            value={fmtPct(metrics.totalUnrealizedGainPct)}
            sub={`${fmtCurrency(metrics.totalUnrealizedGain)} gain on cost`}
            subPositive={metrics.totalUnrealizedGain >= 0}
            icon={<BarChart2 className="w-4 h-4" />}
          />
          <MetricCard
            label="Annual Passive Income"
            value={fmtCurrency(metrics.annualPassiveIncome)}
            sub={`${metrics.annualYield.toFixed(2)}% yield on portfolio`}
            subPositive={null}
            icon={<Percent className="w-4 h-4" />}
          />
        </div>

        {/* ── Charts Row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <SectorChart data={sectorData} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-end">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => setDividendYear(y)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    dividendYear === y
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
            <DividendBarChart data={monthlyDividends} year={dividendYear} />
          </div>
        </div>

        {/* ── Dividend Growth ──────────────────────────────────────────── */}
        <DividendGrowthChart data={dividendGrowth} />

        {/* ── Returns Table ────────────────────────────────────────────── */}
        <ReturnsTable holdings={holdings} filters={filters} onSelectHolding={setSelectedHolding} />

      </main>

      <footer className="border-t border-slate-800 mt-10 py-4 text-center text-xs text-slate-600">
        {portfolio.name} · Powered by Navexa + Yahoo Finance · {new Date().toLocaleDateString('en-AU')}
      </footer>

      {/* ── Holding Detail Drawer ─────────────────────────────────────── */}
      <HoldingDrawer holding={selectedHolding} onClose={() => setSelectedHolding(null)} />
    </div>
  )
}
