// ─── Navexa API Types ─────────────────────────────────────────────────────────
// Based on https://api.navexa.com.au — map these when real API key is available

export type Currency = 'AUD' | 'USD' | 'GBP' | 'EUR' | 'HKD' | 'JPY'

export type AssetClass = 'stock' | 'etf' | 'fund' | 'crypto' | 'property' | 'fixed-income'

export type TransactionType = 'buy' | 'sell' | 'dividend' | 'split' | 'transfer'

// ─── Portfolio (top-level) ────────────────────────────────────────────────────
export interface NavexaPortfolio {
  id: string
  name: string
  currency: Currency
  createdAt: string
  updatedAt: string
  metrics: PortfolioMetrics
  holdings: Holding[]
}

export interface PortfolioMetrics {
  totalValue: number           // Current market value in portfolio currency
  totalCostBasis: number       // Total amount invested
  totalUnrealizedGain: number  // Current value - cost basis
  totalUnrealizedGainPct: number
  totalRealizedGain: number    // Gains from sold positions
  totalDividendsReceived: number
  totalProfit: number          // Unrealized + Realized + Dividends
  irr: number                  // Internal Rate of Return (annualised %)
  annualPassiveIncome: number  // Projected annual dividends from current holdings
  annualYield: number          // annualPassiveIncome / totalValue * 100
}

// ─── Holding ──────────────────────────────────────────────────────────────────
export interface Holding {
  id: string
  portfolioId: string
  ticker: string
  name: string
  exchange: string
  currency: Currency           // Holding's native currency
  assetClass: AssetClass
  sector: string
  industry: string
  isSold: boolean

  // Position data
  shares: number               // Current shares held
  averageCostPerShare: number  // In holding currency
  totalCostBasis: number       // shares * averageCostPerShare

  // Current market data
  currentPrice: number         // In holding currency
  currentValue: number         // shares * currentPrice

  // Returns
  unrealizedGain: number       // currentValue - totalCostBasis
  unrealizedGainPct: number
  realizedGain: number         // From sell transactions
  dividendsReceived: number    // Total dividends received
  totalProfit: number          // unrealizedGain + realizedGain + dividendsReceived

  // Dividend data
  dividendYieldPct: number     // Forward annual yield %
  yieldOnCostPct: number       // Annual dividend / costBasis * 100
  annualDividendPerShare: number

  // FX rates (to portfolio AUD)
  fxRateToAud: number

  transactions: Transaction[]
  dividendHistory: DividendPayment[]
}

// ─── Transaction ──────────────────────────────────────────────────────────────
export interface Transaction {
  id: string
  holdingId: string
  type: TransactionType
  date: string                 // ISO date
  shares: number
  pricePerShare: number
  totalAmount: number
  fees: number
  currency: Currency
  notes?: string
}

// ─── Dividend Payment ─────────────────────────────────────────────────────────
export interface DividendPayment {
  id: string
  holdingId: string
  ticker: string
  exDate: string
  payDate: string
  amountPerShare: number
  totalAmount: number
  currency: Currency
  isFuture: boolean            // true = scheduled/projected, false = received
}

// ─── Sector Allocation ────────────────────────────────────────────────────────
export interface SectorAllocation {
  sector: string
  value: number
  pct: number
  color: string
}

// ─── Monthly Dividend Summary ─────────────────────────────────────────────────
export interface MonthlyDividendSummary {
  month: string               // 'Jan', 'Feb', etc.
  year: number
  received: number
  projected: number
}

// ─── UI State ─────────────────────────────────────────────────────────────────
export interface DashboardFilters {
  showSold: boolean
  currency: 'AUD' | 'holding'
}
