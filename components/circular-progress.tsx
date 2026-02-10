"use client"

interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
}

export function CircularProgress({
  value,
  max,
  size = 180,
  strokeWidth = 12,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min((value / max) * 100, 100)
  const offset = circumference - (percentage / 100) * circumference

  const isOverBudget = value > max

  const getColor = () => {
    if (isOverBudget) return "hsl(var(--destructive))"
    if (percentage > 80) return "hsl(var(--warning))"
    return "hsl(var(--primary))"
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-0.5">
        <span className="text-xs font-medium text-muted-foreground">Spent</span>
        <span className="font-display text-2xl font-bold text-foreground">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs text-muted-foreground">
          of budget
        </span>
      </div>
    </div>
  )
}
