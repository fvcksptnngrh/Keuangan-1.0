const DonutChart = ({ data, size = 180, strokeWidth = 35, title }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, d) => sum + d.value, 0)

  let accumulatedOffset = 0

  return (
    <div className="flex flex-col items-center">
      {title && <h3 className="text-lg font-bold text-darkest mb-4">{title}</h3>}
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((segment, i) => {
          const percentage = total > 0 ? segment.value / total : 0
          const dashLength = circumference * percentage
          const dashOffset = circumference * accumulatedOffset
          accumulatedOffset += percentage

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-dashOffset}
              strokeLinecap="butt"
            />
          )
        })}
      </svg>
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
