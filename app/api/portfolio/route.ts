import { NextResponse } from 'next/server'
import { fetchPortfolios, fetchHoldings, fetchTrades, fetchIncome } from '@/lib/navexa-api'
import { fetchQuotes } from '@/lib/yahoo-finance'
import { buildHolding, buildPortfolio } from '@/lib/portfolio-builder'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1. Get portfolio
    const portfolios = await fetchPortfolios()
    if (!portfolios.length) {
      return NextResponse.json({ error: 'No portfolios found' }, { status: 404 })
    }
    const portfolio = portfolios[0]

    // 2. Get holdings (skip cash balance holdingTypeId=3)
    const rawHoldings = await fetchHoldings(portfolio.id)
    const stockHoldings = rawHoldings.filter(h => h.holdingTypeId !== 3)

    // 3. Fetch trades + income for all holdings in parallel
    const [allTrades, allIncome] = await Promise.all([
      Promise.all(stockHoldings.map(h => fetchTrades(h.id).then(t => ({ id: h.id, data: t })))),
      Promise.all(stockHoldings.map(h => fetchIncome(h.id).then(i => ({ id: h.id, data: i })))),
    ])

    const tradesMap = new Map(allTrades.map(t => [t.id, t.data]))
    const incomeMap = new Map(allIncome.map(i => [i.id, i.data]))

    // 4. Fetch live prices from Yahoo Finance
    const quotes = await fetchQuotes(
      stockHoldings.map(h => ({ ticker: h.symbol, exchange: h.exchange }))
    )

    // 5. Build computed holdings
    const holdings = stockHoldings.map(raw => buildHolding(
      raw,
      tradesMap.get(raw.id) ?? [],
      incomeMap.get(raw.id) ?? [],
      quotes.get(raw.symbol),
    ))

    // 6. Build portfolio
    const result = buildPortfolio(portfolio.id, portfolio.name, holdings)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[/api/portfolio]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
