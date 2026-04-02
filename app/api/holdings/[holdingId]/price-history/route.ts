import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RANGE_MAP: Record<string, { interval: string; range: string }> = {
  '5D':  { interval: '5m',  range: '5d' },
  '1M':  { interval: '1d',  range: '1mo' },
  '6M':  { interval: '1d',  range: '6mo' },
  'YTD': { interval: '1d',  range: 'ytd' },
  '1Y':  { interval: '1d',  range: '1y' },
  '3Y':  { interval: '1wk', range: '3y' },
  '5Y':  { interval: '1wk', range: '5y' },
  'All': { interval: '1mo', range: 'max' },
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ holdingId: string }> }
) {
  const { holdingId } = await params
  const url = new URL(req.url)
  const ticker = url.searchParams.get('ticker') ?? ''
  const period = url.searchParams.get('period') ?? '1Y'
  const { interval, range } = RANGE_MAP[period] ?? RANGE_MAP['1Y']

  try {
    const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.AX?interval=${interval}&range=${range}`
    const res = await fetch(yfUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ prices: [] })

    const json = await res.json() as any
    const result = json?.chart?.result?.[0]
    if (!result) return NextResponse.json({ prices: [] })

    const timestamps: number[] = result.timestamp ?? []
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? []

    const prices = timestamps
      .map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        price: closes[i] ?? null,
      }))
      .filter(p => p.price !== null)

    return NextResponse.json({ prices, meta: result.meta })
  } catch {
    return NextResponse.json({ prices: [] })
  }
}
