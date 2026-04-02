import type {
  NavexaPortfolio,
  Holding,
  DividendPayment,
  MonthlyDividendSummary,
  SectorAllocation,
} from '@/types/navexa'

// ─── Mock Holdings (ASX-focused, AUD portfolio) ───────────────────────────────
const mockHoldings: Holding[] = [
  {
    id: 'h1',
    portfolioId: 'p1',
    ticker: 'CBA',
    name: 'Commonwealth Bank',
    exchange: 'ASX',
    currency: 'AUD',
    assetClass: 'stock',
    sector: 'Financials',
    industry: 'Banks',
    isSold: false,
    shares: 50,
    averageCostPerShare: 98.50,
    totalCostBasis: 4925.00,
    currentPrice: 132.40,
    currentValue: 6620.00,
    unrealizedGain: 1695.00,
    unrealizedGainPct: 34.42,
    realizedGain: 0,
    dividendsReceived: 540.00,
    totalProfit: 2235.00,
    dividendYieldPct: 3.48,
    yieldOnCostPct: 4.68,
    annualDividendPerShare: 4.61,
    fxRateToAud: 1.0,
    transactions: [
      { id: 't1', holdingId: 'h1', type: 'buy', date: '2022-06-15', shares: 50, pricePerShare: 98.50, totalAmount: 4925.00, fees: 9.95, currency: 'AUD' },
    ],
    dividendHistory: [
      { id: 'd1', holdingId: 'h1', ticker: 'CBA', exDate: '2024-08-14', payDate: '2024-09-27', amountPerShare: 2.25, totalAmount: 112.50, currency: 'AUD', isFuture: false },
      { id: 'd2', holdingId: 'h1', ticker: 'CBA', exDate: '2025-02-12', payDate: '2025-03-28', amountPerShare: 2.36, totalAmount: 118.00, currency: 'AUD', isFuture: false },
      { id: 'd3', holdingId: 'h1', ticker: 'CBA', exDate: '2025-08-13', payDate: '2025-09-26', amountPerShare: 2.40, totalAmount: 120.00, currency: 'AUD', isFuture: false },
      { id: 'd4', holdingId: 'h1', ticker: 'CBA', exDate: '2026-02-11', payDate: '2026-03-27', amountPerShare: 2.45, totalAmount: 122.50, currency: 'AUD', isFuture: false },
      { id: 'd5', holdingId: 'h1', ticker: 'CBA', exDate: '2026-08-12', payDate: '2026-09-25', amountPerShare: 2.51, totalAmount: 125.50, currency: 'AUD', isFuture: true },
    ],
  },
  {
    id: 'h2',
    portfolioId: 'p1',
    ticker: 'BHP',
    name: 'BHP Group',
    exchange: 'ASX',
    currency: 'AUD',
    assetClass: 'stock',
    sector: 'Materials',
    industry: 'Diversified Metals & Mining',
    isSold: false,
    shares: 80,
    averageCostPerShare: 44.20,
    totalCostBasis: 3536.00,
    currentPrice: 38.90,
    currentValue: 3112.00,
    unrealizedGain: -424.00,
    unrealizedGainPct: -11.99,
    realizedGain: 0,
    dividendsReceived: 412.00,
    totalProfit: -12.00,
    dividendYieldPct: 5.76,
    yieldOnCostPct: 5.05,
    annualDividendPerShare: 2.24,
    fxRateToAud: 1.0,
    transactions: [
      { id: 't2', holdingId: 'h2', type: 'buy', date: '2023-03-10', shares: 80, pricePerShare: 44.20, totalAmount: 3536.00, fees: 9.95, currency: 'AUD' },
    ],
    dividendHistory: [
      { id: 'd6', holdingId: 'h2', ticker: 'BHP', exDate: '2024-09-04', payDate: '2024-09-24', amountPerShare: 1.05, totalAmount: 84.00, currency: 'AUD', isFuture: false },
      { id: 'd7', holdingId: 'h2', ticker: 'BHP', exDate: '2025-03-05', payDate: '2025-03-25', amountPerShare: 1.12, totalAmount: 89.60, currency: 'AUD', isFuture: false },
      { id: 'd8', holdingId: 'h2', ticker: 'BHP', exDate: '2025-09-03', payDate: '2025-09-23', amountPerShare: 1.10, totalAmount: 88.00, currency: 'AUD', isFuture: false },
      { id: 'd9', holdingId: 'h2', ticker: 'BHP', exDate: '2026-03-04', payDate: '2026-03-24', amountPerShare: 1.13, totalAmount: 90.40, currency: 'AUD', isFuture: false },
      { id: 'd10', holdingId: 'h2', ticker: 'BHP', exDate: '2026-09-02', payDate: '2026-09-22', amountPerShare: 1.15, totalAmount: 92.00, currency: 'AUD', isFuture: true },
    ],
  },
  {
    id: 'h3',
    portfolioId: 'p1',
    ticker: 'WDS',
    name: 'Woodside Energy',
    exchange: 'ASX',
    currency: 'AUD',
    assetClass: 'stock',
    sector: 'Energy',
    industry: 'Oil & Gas',
    isSold: false,
    shares: 120,
    averageCostPerShare: 32.10,
    totalCostBasis: 3852.00,
    currentPrice: 24.80,
    currentValue: 2976.00,
    unrealizedGain: -876.00,
    unrealizedGainPct: -22.74,
    realizedGain: 0,
    dividendsReceived: 620.00,
    totalProfit: -256.00,
    dividendYieldPct: 8.87,
    yieldOnCostPct: 6.86,
    annualDividendPerShare: 2.20,
    fxRateToAud: 1.0,
    transactions: [
      { id: 't3', holdingId: 'h3', type: 'buy', date: '2022-11-20', shares: 120, pricePerShare: 32.10, totalAmount: 3852.00, fees: 9.95, currency: 'AUD' },
    ],
    dividendHistory: [
      { id: 'd11', holdingId: 'h3', ticker: 'WDS', exDate: '2024-08-27', payDate: '2024-09-16', amountPerShare: 0.85, totalAmount: 102.00, currency: 'AUD', isFuture: false },
      { id: 'd12', holdingId: 'h3', ticker: 'WDS', exDate: '2025-02-25', payDate: '2025-03-17', amountPerShare: 0.90, totalAmount: 108.00, currency: 'AUD', isFuture: false },
      { id: 'd13', holdingId: 'h3', ticker: 'WDS', exDate: '2025-08-26', payDate: '2025-09-15', amountPerShare: 0.88, totalAmount: 105.60, currency: 'AUD', isFuture: false },
      { id: 'd14', holdingId: 'h3', ticker: 'WDS', exDate: '2026-02-24', payDate: '2026-03-16', amountPerShare: 0.92, totalAmount: 110.40, currency: 'AUD', isFuture: false },
      { id: 'd15', holdingId: 'h3', ticker: 'WDS', exDate: '2026-08-25', payDate: '2026-09-14', amountPerShare: 0.95, totalAmount: 114.00, currency: 'AUD', isFuture: true },
    ],
  },
  {
    id: 'h4',
    portfolioId: 'p1',
    ticker: 'CSL',
    name: 'CSL Limited',
    exchange: 'ASX',
    currency: 'AUD',
    assetClass: 'stock',
    sector: 'Healthcare',
    industry: 'Biotechnology',
    isSold: false,
    shares: 15,
    averageCostPerShare: 285.00,
    totalCostBasis: 4275.00,
    currentPrice: 312.50,
    currentValue: 4687.50,
    unrealizedGain: 412.50,
    unrealizedGainPct: 9.65,
    realizedGain: 0,
    dividendsReceived: 180.00,
    totalProfit: 592.50,
    dividendYieldPct: 1.22,
    yieldOnCostPct: 1.33,
    annualDividendPerShare: 3.81,
    fxRateToAud: 1.0,
    transactions: [
      { id: 't4', holdingId: 'h4', type: 'buy', date: '2023-07-05', shares: 15, pricePerShare: 285.00, totalAmount: 4275.00, fees: 9.95, currency: 'AUD' },
    ],
    dividendHistory: [
      { id: 'd16', holdingId: 'h4', ticker: 'CSL', exDate: '2024-09-10', payDate: '2024-10-08', amountPerShare: 1.74, totalAmount: 26.10, currency: 'USD', isFuture: false },
      { id: 'd17', holdingId: 'h4', ticker: 'CSL', exDate: '2025-03-07', payDate: '2025-04-07', amountPerShare: 1.85, totalAmount: 27.75, currency: 'USD', isFuture: false },
      { id: 'd18', holdingId: 'h4', ticker: 'CSL', exDate: '2025-09-09', payDate: '2025-10-07', amountPerShare: 1.90, totalAmount: 28.50, currency: 'USD', isFuture: false },
      { id: 'd19', holdingId: 'h4', ticker: 'CSL', exDate: '2026-03-06', payDate: '2026-04-06', amountPerShare: 1.95, totalAmount: 29.25, currency: 'USD', isFuture: false },
      { id: 'd20', holdingId: 'h4', ticker: 'CSL', exDate: '2026-09-08', payDate: '2026-10-06', amountPerShare: 2.00, totalAmount: 30.00, currency: 'USD', isFuture: true },
    ],
  },
  {
    id: 'h5',
    portfolioId: 'p1',
    ticker: 'GMG',
    name: 'Goodman Group',
    exchange: 'ASX',
    currency: 'AUD',
    assetClass: 'stock',
    sector: 'Real Estate',
    industry: 'Industrial REITs',
    isSold: false,
    shares: 100,
    averageCostPerShare: 21.40,
    totalCostBasis: 2140.00,
    currentPrice: 35.20,
    currentValue: 3520.00,
    unrealizedGain: 1380.00,
    unrealizedGainPct: 64.49,
    realizedGain: 0,
    dividendsReceived: 95.00,
    totalProfit: 1475.00,
    dividendYieldPct: 0.85,
    yieldOnCostPct: 1.40,
    annualDividendPerShare: 0.30,
    fxRateToAud: 1.0,
    transactions: [
      { id: 't5', holdingId: 'h5', type: 'buy', date: '2021-09-15', shares: 100, pricePerShare: 21.40, totalAmount: 2140.00, fees: 9.95, currency: 'AUD' },
    ],
    dividendHistory: [
      { id: 'd21', holdingId: 'h5', ticker: 'GMG', exDate: '2025-02-21', payDate: '2025-03-14', amountPerShare: 0.15, totalAmount: 15.00, currency: 'AUD', isFuture: false },
      { id: 'd22', holdingId: 'h5', ticker: 'GMG', exDate: '2025-08-20', payDate: '2025-09-12', amountPerShare: 0.15, totalAmount: 15.00, currency: 'AUD', isFuture: false },
      { id: 'd23', holdingId: 'h5', ticker: 'GMG', exDate: '2026-02-19', payDate: '2026-03-13', amountPerShare: 0.15, totalAmount: 15.00, currency: 'AUD', isFuture: false },
      { id: 'd24', holdingId: 'h5', ticker: 'GMG', exDate: '2026-08-19', payDate: '2026-09-11', amountPerShare: 0.15, totalAmount: 15.00, currency: 'AUD', isFuture: true },
    ],
  },
  {
    id: 'h6',
    portfolioId: 'p1',
    ticker: 'TLS',
    name: 'Telstra Group',
    exchange: 'ASX',
    currency: 'AUD',
    assetClass: 'stock',
    sector: 'Communication Services',
    industry: 'Telecom Services',
    isSold: false,
    shares: 500,
    averageCostPerShare: 3.92,
    totalCostBasis: 1960.00,
    currentPrice: 3.85,
    currentValue: 1925.00,
    unrealizedGain: -35.00,
    unrealizedGainPct: -1.79,
    realizedGain: 0,
    dividendsReceived: 340.00,
    totalProfit: 305.00,
    dividendYieldPct: 4.42,
    yieldOnCostPct: 4.49,
    annualDividendPerShare: 0.17,
    fxRateToAud: 1.0,
    transactions: [
      { id: 't6', holdingId: 'h6', type: 'buy', date: '2022-04-20', shares: 500, pricePerShare: 3.92, totalAmount: 1960.00, fees: 9.95, currency: 'AUD' },
    ],
    dividendHistory: [
      { id: 'd25', holdingId: 'h6', ticker: 'TLS', exDate: '2024-08-28', payDate: '2024-09-25', amountPerShare: 0.085, totalAmount: 42.50, currency: 'AUD', isFuture: false },
      { id: 'd26', holdingId: 'h6', ticker: 'TLS', exDate: '2025-02-26', payDate: '2025-03-26', amountPerShare: 0.085, totalAmount: 42.50, currency: 'AUD', isFuture: false },
      { id: 'd27', holdingId: 'h6', ticker: 'TLS', exDate: '2025-08-27', payDate: '2025-09-24', amountPerShare: 0.085, totalAmount: 42.50, currency: 'AUD', isFuture: false },
      { id: 'd28', holdingId: 'h6', ticker: 'TLS', exDate: '2026-02-25', payDate: '2026-03-25', amountPerShare: 0.085, totalAmount: 42.50, currency: 'AUD', isFuture: false },
      { id: 'd29', holdingId: 'h6', ticker: 'TLS', exDate: '2026-08-26', payDate: '2026-09-23', amountPerShare: 0.085, totalAmount: 42.50, currency: 'AUD', isFuture: true },
    ],
  },
  // Sold position
  {
    id: 'h7',
    portfolioId: 'p1',
    ticker: 'RIO',
    name: 'Rio Tinto',
    exchange: 'ASX',
    currency: 'AUD',
    assetClass: 'stock',
    sector: 'Materials',
    industry: 'Steel',
    isSold: true,
    shares: 0,
    averageCostPerShare: 118.00,
    totalCostBasis: 5900.00,
    currentPrice: 114.50,
    currentValue: 0,
    unrealizedGain: 0,
    unrealizedGainPct: 0,
    realizedGain: 875.00,
    dividendsReceived: 420.00,
    totalProfit: 1295.00,
    dividendYieldPct: 0,
    yieldOnCostPct: 0,
    annualDividendPerShare: 0,
    fxRateToAud: 1.0,
    transactions: [
      { id: 't7', holdingId: 'h7', type: 'buy', date: '2021-05-10', shares: 50, pricePerShare: 118.00, totalAmount: 5900.00, fees: 9.95, currency: 'AUD' },
      { id: 't8', holdingId: 'h7', type: 'sell', date: '2024-03-15', shares: 50, pricePerShare: 135.50, totalAmount: 6775.00, fees: 9.95, currency: 'AUD' },
    ],
    dividendHistory: [],
  },
]

// ─── Portfolio ────────────────────────────────────────────────────────────────
export const mockPortfolio: NavexaPortfolio = {
  id: 'p1',
  name: 'ASX Portfolio',
  currency: 'AUD',
  createdAt: '2021-05-10T00:00:00Z',
  updatedAt: new Date().toISOString(),
  metrics: {
    totalValue: mockHoldings.reduce((s, h) => s + h.currentValue, 0),
    totalCostBasis: mockHoldings.filter(h => !h.isSold).reduce((s, h) => s + h.totalCostBasis, 0),
    totalUnrealizedGain: mockHoldings.filter(h => !h.isSold).reduce((s, h) => s + h.unrealizedGain, 0),
    totalUnrealizedGainPct: 0, // calculated below
    totalRealizedGain: mockHoldings.reduce((s, h) => s + h.realizedGain, 0),
    totalDividendsReceived: mockHoldings.reduce((s, h) => s + h.dividendsReceived, 0),
    totalProfit: mockHoldings.reduce((s, h) => s + h.totalProfit, 0),
    irr: 11.4,
    annualPassiveIncome: mockHoldings.filter(h => !h.isSold).reduce((s, h) => s + h.annualDividendPerShare * h.shares, 0),
    annualYield: 0, // calculated below
  },
  holdings: mockHoldings,
}

// Fix percentage calculations
const m = mockPortfolio.metrics
m.totalUnrealizedGainPct = m.totalCostBasis > 0 ? (m.totalUnrealizedGain / m.totalCostBasis) * 100 : 0
m.annualYield = m.totalValue > 0 ? (m.annualPassiveIncome / m.totalValue) * 100 : 0

// ─── Sector Allocation ────────────────────────────────────────────────────────
const SECTOR_COLORS: Record<string, string> = {
  Financials: '#3b82f6',
  Materials: '#f59e0b',
  Energy: '#ef4444',
  Healthcare: '#22c55e',
  'Real Estate': '#a855f7',
  'Communication Services': '#06b6d4',
  Technology: '#f97316',
  Utilities: '#84cc16',
  'Consumer Discretionary': '#ec4899',
  'Consumer Staples': '#14b8a6',
}

export function getSectorAllocation(holdings: Holding[]): SectorAllocation[] {
  const activeHoldings = holdings.filter(h => !h.isSold)
  const totalValue = activeHoldings.reduce((s, h) => s + h.currentValue, 0)

  const sectorMap = activeHoldings.reduce<Record<string, number>>((acc, h) => {
    acc[h.sector] = (acc[h.sector] ?? 0) + h.currentValue
    return acc
  }, {})

  return Object.entries(sectorMap)
    .map(([sector, value]) => ({
      sector,
      value,
      pct: totalValue > 0 ? (value / totalValue) * 100 : 0,
      color: SECTOR_COLORS[sector] ?? '#6b7280',
    }))
    .sort((a, b) => b.value - a.value)
}

// ─── Monthly Dividend Summary ─────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function getMonthlyDividends(holdings: Holding[], year: number): MonthlyDividendSummary[] {
  const result: MonthlyDividendSummary[] = MONTHS.map((month, i) => ({
    month,
    year,
    received: 0,
    projected: 0,
  }))

  holdings.forEach(h => {
    h.dividendHistory.forEach(d => {
      const payDate = new Date(d.payDate)
      if (payDate.getFullYear() !== year) return
      const idx = payDate.getMonth()
      if (d.isFuture) {
        result[idx].projected += d.totalAmount
      } else {
        result[idx].received += d.totalAmount
      }
    })
  })

  return result
}

// ─── Dividend Growth by Year ──────────────────────────────────────────────────
export function getDividendGrowthByYear(holdings: Holding[]): { year: number; total: number }[] {
  const years = [2024, 2025, 2026]
  return years.map(year => {
    let total = 0
    holdings.forEach(h => {
      h.dividendHistory
        .filter(d => new Date(d.payDate).getFullYear() === year && !d.isFuture)
        .forEach(d => { total += d.totalAmount })
    })
    return { year, total }
  })
}
