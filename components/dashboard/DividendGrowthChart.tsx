'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface YearTotal {
  year: number
  total: number
}

interface Props {
  data: YearTotal[]
}

const YEAR_COLORS: Record<number, string> = {
  2024: '#64748b',
  2025: '#3b82f6',
  2026: '#22c55e',
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

export function DividendGrowthChart({ data }: Props) {
  // Transform to {year: 2024, total: x} for display
  const chartData = [{ name: 'Annual Dividends', ...Object.fromEntries(data.map(d => [d.year, d.total])) }]

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-white">Dividend Growth</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barGap={4} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${v}`}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {data.map(d => (
            <Bar
              key={d.year}
              dataKey={d.year}
              name={String(d.year)}
              fill={YEAR_COLORS[d.year] ?? '#6b7280'}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
