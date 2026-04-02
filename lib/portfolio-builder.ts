// ─── Portfolio Builder ────────────────────────────────────────────────────────
// Takes raw Navexa data + Yahoo Finance quotes → computed portfolio

import type {
  NavexaRawHolding,
  NavexaRawTrade,
  NavexaRawIncome,
} from './navexa-api'
import type { YFQuote } from './yahoo-finance'
import type {
  Holding,
  NavexaPortfolio,
  PortfolioMetrics,
  DividendPayment,
  Transaction,
} from '@/types/navexa'

// ─── Cost basis calculation from trades ──────────────────────────────────────

interface CostBasisResult {
  sharesHeld: number
  avgCostPerShare: number
  totalCostBasis: number
  realizedGain: number
  isSold: boolean
}

function calcCostBasis(trades: NavexaRawTrade[]): CostBasisResult {
  // FIFO cost basis
  const lots: { qty: number; price: number }[] = []
  let realizedGain = 0

  const sorted = [...trades].sort((a, b) =>
    new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
  )

  for (const trade of sorted) {
    if (trade.tradeType === 'Buy') {
      lots.push({ qty: trade.quantity, price: trade.price })
    } else if (trade.tradeType === 'Sell') {
      let remaining = trade.quantity
      while (remaining > 0 && lots.length > 0) {
        const lot = lots[0]
        const sold = Math.min(lot.qty, remaining)
        realizedGain += sold * (trade.price - lot.price) - (trade.brokerage / trade.quantity) * sold
        lot.qty -= sold
        remaining -= sold
        if (lot.qty <= 0) lots.shift()
      }
    }
  }

  const sharesHeld = lots.reduce((s, l) => s + l.qty, 0)
  const totalCostBasis = lots.reduce((s, l) => s + l.qty * l.price, 0)
  const avgCostPerShare = sharesHeld > 0 ? totalCostBasis / sharesHeld : 0

  return {
    sharesHeld: Math.round(sharesHeld * 1e8) / 1e8,
    avgCostPerShare,
    totalCostBasis,
    realizedGain,
    isSold: sharesHeld < 0.001,
  }
}

// ─── Build a single Holding ───────────────────────────────────────────────────

export function buildHolding(
  raw: NavexaRawHolding,
  trades: NavexaRawTrade[],
  income: NavexaRawIncome[],
  quote: YFQuote | undefined,
): Holding {
  const cb = calcCostBasis(trades)
  const dividendsReceived = income.reduce((s, i) => s + i.netAmount, 0)
  const currentPrice = quote?.price ?? 0
  const currentValue = cb.sharesHeld * currentPrice
  const unrealizedGain = currentValue - cb.totalCostBasis
  const unrealizedGainPct = cb.totalCostBasis > 0
    ? (unrealizedGain / cb.totalCostBasis) * 100 : 0
  const totalProfit = unrealizedGain + cb.realizedGain + dividendsReceived

  // Trailing 12-month dividend income from Navexa's actual income records
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const trailing12mIncome = income
    .filter(i => new Date(i.paidDate) >= oneYearAgo)
    .reduce((s, i) => s + i.netAmount, 0)

  // Annualised dividend per share based on trailing income
  const annualDivPerShare = cb.sharesHeld > 0 ? trailing12mIncome / cb.sharesHeld : 0
  const dividendYieldPct = currentPrice > 0 && annualDivPerShare > 0
    ? (annualDivPerShare / currentPrice) * 100 : 0
  const yieldOnCostPct = cb.avgCostPerShare > 0 && annualDivPerShare > 0
    ? (annualDivPerShare / cb.avgCostPerShare) * 100 : 0

  const transactions: Transaction[] = trades.map(t => ({
    id: String(t.id),
    holdingId: String(t.holdingId),
    type: t.tradeTypeId === 1 ? 'buy' : 'sell',
    date: t.tradeDate.slice(0, 10),
    shares: t.quantity,
    pricePerShare: t.price,
    totalAmount: t.value,
    fees: t.brokerage,
    currency: t.currencyCode as any,
    notes: t.notes,
  }))

  const dividendHistory: DividendPayment[] = income.map(i => ({
    id: String(i.id),
    holdingId: String(i.holdingId),
    ticker: i.symbol,
    exDate: i.exDividendDate?.slice(0, 10) ?? '',
    payDate: i.paidDate.slice(0, 10),
    amountPerShare: 0,   // Navexa doesn't return per-share in income — notes field has it
    totalAmount: i.netAmount,
    currency: i.dividendCurrency as any,
    isFuture: false,
  }))

  return {
    id: String(raw.id),
    portfolioId: String(raw.portfolioId),
    ticker: raw.symbol,
    name: raw.name ?? raw.symbol,
    exchange: raw.displayExchange,
    currency: raw.currencyCode as any,
    assetClass: raw.holdingTypeId === 3 ? 'fixed-income' : 'stock',
    sector: raw.classification?.sector ?? 'Unknown',
    industry: raw.classification?.industry ?? '',
    isSold: cb.isSold,
    shares: cb.sharesHeld,
    averageCostPerShare: cb.avgCostPerShare,
    totalCostBasis: cb.totalCostBasis,
    currentPrice,
    currentValue,
    unrealizedGain,
    unrealizedGainPct,
    realizedGain: cb.realizedGain,
    dividendsReceived,
    totalProfit,
    dividendYieldPct,
    yieldOnCostPct,
    annualDividendPerShare: annualDivPerShare,
    fxRateToAud: 1.0,
    transactions,
    dividendHistory,
  }
}

// ─── Build full portfolio ─────────────────────────────────────────────────────

export function buildPortfolio(
  rawPortfolioId: number,
  rawName: string,
  holdings: Holding[],
): NavexaPortfolio {
  const active = holdings.filter(h => !h.isSold)

  const totalValue = active.reduce((s, h) => s + h.currentValue, 0)
  const totalCostBasis = active.reduce((s, h) => s + h.totalCostBasis, 0)
  const totalUnrealizedGain = active.reduce((s, h) => s + h.unrealizedGain, 0)
  const totalRealizedGain = holdings.reduce((s, h) => s + h.realizedGain, 0)
  const totalDividendsReceived = holdings.reduce((s, h) => s + h.dividendsReceived, 0)
  const totalProfit = totalUnrealizedGain + totalRealizedGain + totalDividendsReceived
  const annualPassiveIncome = active.reduce(
    (s, h) => s + h.annualDividendPerShare * h.shares, 0
  )

  const metrics: PortfolioMetrics = {
    totalValue,
    totalCostBasis,
    totalUnrealizedGain,
    totalUnrealizedGainPct: totalCostBasis > 0 ? (totalUnrealizedGain / totalCostBasis) * 100 : 0,
    totalRealizedGain,
    totalDividendsReceived,
    totalProfit,
    irr: 0,   // IRR requires time-series — set to 0; can compute later
    annualPassiveIncome,
    annualYield: totalValue > 0 ? (annualPassiveIncome / totalValue) * 100 : 0,
  }

  return {
    id: String(rawPortfolioId),
    name: rawName,
    currency: 'AUD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metrics,
    holdings,
  }
}
