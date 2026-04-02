// ─── Navexa API Service Layer ─────────────────────────────────────────────────
// Auth: X-Api-Key header
// Base: https://api.navexa.com.au

const BASE = 'https://api.navexa.com.au'

function headers() {
  const key = process.env.NEXT_PUBLIC_NAVEXA_API_KEY ?? ''
  return { 'X-Api-Key': key, 'Content-Type': 'application/json' }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: headers(), cache: 'no-store' })
  if (!res.ok) throw new Error(`Navexa ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

// ─── Raw API shapes ────────────────────────────────────────────────────────────

export interface NavexaRawPortfolio {
  id: number
  name: string
  dateCreated: string
  baseCurrencyCode: string
}

export interface NavexaRawHolding {
  id: number
  symbol: string
  exchange: string
  displayExchange: string
  name: string | null
  currencyCode: string
  holdingTypeId: number          // 1=stock/ETF, 3=cash
  portfolioId: number
  dateCreated: string
  classification: {
    sector: string | null
    sectorCode: number | null
    industryGroup: string | null
    industry: string | null
    subIndustry: string | null
  } | null
}

export interface NavexaRawTrade {
  id: number
  tradeDate: string
  quantity: number
  price: number
  brokerage: number
  notes: string
  tradeType: 'Buy' | 'Sell'
  tradeTypeId: number
  holdingId: number
  currencyCode: string
  exchangeRate: number | null
  value: number
}

export interface NavexaRawIncome {
  id: number
  paidDate: string
  exDividendDate: string
  total: number
  netAmount: number
  grossAmount: number
  frankingCredits: number
  holdingId: number
  symbol: string
  companyName: string
  notes: string
  isReinvested: boolean
  dividendCurrency: string
  exchangeRate: number | null
}

// ─── Public API ────────────────────────────────────────────────────────────────

export async function fetchPortfolios(): Promise<NavexaRawPortfolio[]> {
  return get<NavexaRawPortfolio[]>('/v1/portfolios')
}

export async function fetchHoldings(portfolioId: number): Promise<NavexaRawHolding[]> {
  return get<NavexaRawHolding[]>(`/v1/portfolios/${portfolioId}/holdings`)
}

export async function fetchTrades(holdingId: number): Promise<NavexaRawTrade[]> {
  return get<NavexaRawTrade[]>(`/v1/holdings/${holdingId}/trades`)
}

export async function fetchIncome(holdingId: number): Promise<NavexaRawIncome[]> {
  return get<NavexaRawIncome[]>(`/v1/holdings/${holdingId}/income`)
}
