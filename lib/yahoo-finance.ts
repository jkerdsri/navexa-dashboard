// ─── Yahoo Finance price fetcher ──────────────────────────────────────────────
// Uses v8/finance/chart (works without crumb/auth)
// ASX tickers: append .AX  (AXW exchange also uses .AX on Yahoo)

const YF_BASE = 'https://query1.finance.yahoo.com'
const YF_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
}

export interface YFQuote {
  ticker: string
  price: number
  currency: string
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  dividendYield: number              // as decimal e.g. 0.048 = 4.8%
  trailingAnnualDividendRate: number // $ per share per year
  forwardPE: number | null
  marketCap: number | null
}

function toYFSymbol(ticker: string): string {
  return `${ticker}.AX`
}

async function fetchChart(symbol: string): Promise<YFQuote | null> {
  try {
    const url = `${YF_BASE}/v8/finance/chart/${symbol}?interval=1d&range=1d`
    const res = await fetch(url, { headers: YF_HEADERS, cache: 'no-store' })
    if (!res.ok) return null

    const json = await res.json() as any
    const result = json?.chart?.result?.[0]
    if (!result) return null

    const meta = result.meta
    const ticker = symbol.replace('.AX', '')

    return {
      ticker,
      price: meta.regularMarketPrice ?? 0,
      currency: meta.currency ?? 'AUD',
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? 0,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? 0,
      dividendYield: meta.dividendYield ?? 0,
      trailingAnnualDividendRate: meta.trailingAnnualDividendRate ?? 0,
      forwardPE: meta.forwardPE ?? null,
      marketCap: meta.marketCap ?? null,
    }
  } catch {
    return null
  }
}

export async function fetchQuotes(
  tickers: { ticker: string; exchange: string }[]
): Promise<Map<string, YFQuote>> {
  const result = new Map<string, YFQuote>()

  const toFetch = tickers.filter(t => t.exchange !== 'Cash')

  // Fetch in batches of 10 in parallel to avoid overwhelming Yahoo
  const BATCH = 10
  for (let i = 0; i < toFetch.length; i += BATCH) {
    const batch = toFetch.slice(i, i + BATCH)
    const quotes = await Promise.all(
      batch.map(t => fetchChart(toYFSymbol(t.ticker)).then(q => ({ ticker: t.ticker, quote: q })))
    )
    for (const { ticker, quote } of quotes) {
      if (quote) result.set(ticker, quote)
    }
  }

  return result
}
