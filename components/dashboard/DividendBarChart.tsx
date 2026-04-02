'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { MonthlyDividendSummary } from '@/types/navexa'

interface Props {
  data: MonthlyDividendSummary[]
  year: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
      <div className="font-semibold text-white mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.fill }} className="flex justify-between gap-4">
          <span>{p.name}</span>
          <span>${p.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}

export function DividendBarChart({ data, year }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Monthly Dividend Income</h2>
        <span className="text-xs text-slate-400">{year}</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} barSize={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${v}`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="received" name="Received" fill="#22c55e" radius={[3, 3, 0, 0]} />
          <Bar dataKey="projected" name="Projected" fill="#3b82f6" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
