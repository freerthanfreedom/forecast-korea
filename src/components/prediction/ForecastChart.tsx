'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { formatDateShort } from '@/lib/utils'

interface ChartDataPoint {
  date: string
  probability: number
}

interface ForecastChartProps {
  data: ChartDataPoint[]
  communityData?: ChartDataPoint[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {Math.round(entry.value)}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ForecastChart({ data, communityData }: ForecastChartProps) {
  if (data.length === 0 && (!communityData || communityData.length === 0)) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground bg-muted/30 rounded-lg">
        아직 예측 이력이 없습니다
      </div>
    )
  }

  // 날짜별 집계
  const merged: Record<string, { date: string; community?: number; mine?: number }> = {}

  if (communityData) {
    communityData.forEach(({ date, probability }) => {
      merged[date] = { ...merged[date], date, community: probability }
    })
  }
  data.forEach(({ date, probability }) => {
    merged[date] = { ...merged[date], date, mine: probability }
  })

  const chartData = Object.values(merged).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateShort}
          tick={{ fontSize: 11 }}
          className="text-muted-foreground"
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11 }}
          className="text-muted-foreground"
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="4 4" />
        {communityData && communityData.length > 0 && (
          <Line
            type="monotone"
            dataKey="community"
            name="집단예측"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        )}
        {data.length > 0 && (
          <Line
            type="monotone"
            dataKey="mine"
            name="내 예측"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
