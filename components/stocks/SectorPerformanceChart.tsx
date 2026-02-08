"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { useTheme } from "next-themes"

interface Sector {
  sector: string
  changesPercentage: string
}

interface SectorPerformanceChartProps {
  data: Sector[]
}

export function SectorPerformanceChart({ data }: SectorPerformanceChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Filter out "All sectors" if you want only specific sectors, or keep it.
  // Usually "All sectors" is a summary, might distract from the comparison.
  // Let's keep it but maybe highlight it? Or remove it for the chart.
  const chartData = data
    .filter(item => item.sector !== "All sectors")
    .map(item => ({
      name: item.sector,
      value: parseFloat(item.changesPercentage),
    }))
    .sort((a, b) => b.value - a.value) // Sort by performance

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Sector
              </span>
              <span className="font-bold text-muted-foreground">
                {label}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Change
              </span>
              <span className={`font-bold ${payload[0].value >= 0 ? "text-green-500" : "text-red-500"}`}>
                {payload[0].value.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 10,
            left: 10, // Increased for long labels
            bottom: 5,
          }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            width={100} // Adjust width for labels
            tick={{ fontSize: 12, fill: "currentColor" }}
            interval={0}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value >= 0 ? "#22c55e" : "#ef4444"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
