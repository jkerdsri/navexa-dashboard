import { NextResponse } from 'next/server'
import { fetchTrades, fetchIncome } from '@/lib/navexa-api'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ holdingId: string }> }
) {
  const { holdingId } = await params
  const id = Number(holdingId)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const [trades, income] = await Promise.all([fetchTrades(id), fetchIncome(id)])
  return NextResponse.json({ trades, income })
}
