import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'

const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload?.length) return null
  const { name, value, payload: seg } = payload[0]
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0
  return (
    <div
      className="rounded-xl shadow-lg border border-white/10 px-3 py-2 text-xs"
      style={{ background: 'linear-gradient(145deg, #052659 0%, #021024 100%)' }}
    >
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="w-2.5 h-2.5 rounded-sm"
          style={{ backgroundColor: seg.color }}
        />
        <span className="font-semibold text-white">{name}</span>
      </div>
      <div className="text-white/80">
        <span className="font-medium text-accent">{value}</span>{' '}
        dokumen · {pct}%
      </div>
    </div>
  )
}

const ActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={2}
      />
    </g>
  )
}

const DonutChart = ({ data, size = 180, strokeWidth = 35, title }) => {
  const total = useMemo(
    () => data.reduce((sum, d) => sum + (d.value || 0), 0),
    [data]
  )

  const outerRadius = size / 2
  const innerRadius = Math.max(0, outerRadius - strokeWidth)

  return (
    <div className="flex flex-col items-center w-full">
      {title && <h3 className="text-lg font-bold text-darkest mb-4">{title}</h3>}
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={90}
              endAngle={-270}
              paddingAngle={1}
              stroke="#ffffff"
              strokeWidth={2}
              activeShape={ActiveShape}
              isAnimationActive
              animationDuration={600}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip total={total} />}
              cursor={false}
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {total > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-darkest">{total}</span>
            <span className="text-[10px] text-cardLight tracking-wide uppercase">Total</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {data.map((segment, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-darkest/70">
              {segment.label} ({segment.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DonutChart
