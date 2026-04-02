'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { SectorAllocation } from '@/types/navexa'

interface Props {
  data: SectorAllocation[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as SectorAllocation
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
      <div className="font-semibold text-white">{d.sector}</div>
      <div className="text-slate-300">
        ${d.value.toLocaleString('en-AU', { maximumFractionDigits: 0 })} AUD
      </div>
      <div className="text-slate-400">{d.pct.toFixed(1)}%</div>
    </div>
  )
}

export function SectorChart({ data }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-4 h-full">
      <h2 className="text-sm font-semibold text-white">Sector Allocation</h2>
      <div className="flex flex-col lg:flex-row items-center gap-4 flex-1">
        <div className="w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={76}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {data.map(d => (
            <div key={d.sector} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-slate-300 flex-1 truncate">{d.sector}</span>
              <span className="text-slate-400 w-10 text-right">{d.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
