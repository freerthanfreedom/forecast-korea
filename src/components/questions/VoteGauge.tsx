'use client'

interface VoteGaugeProps {
  probability: number // 0~100, YES 확률
  predictionCount: number
}

export default function VoteGauge({ probability, predictionCount }: VoteGaugeProps) {
  const yes = Math.round(probability)
  const no = 100 - yes

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-green-600">YES {yes}%</span>
        <span className="text-xs text-muted-foreground">{predictionCount}명 참여</span>
        <span className="text-red-500">NO {no}%</span>
      </div>
      <div className="flex h-5 rounded-full overflow-hidden bg-red-100">
        <div
          className="bg-green-500 transition-all duration-700 ease-out flex items-center justify-center"
          style={{ width: `${yes}%` }}
        />
        <div
          className="bg-red-400 transition-all duration-700 ease-out flex items-center justify-center"
          style={{ width: `${no}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>← 일어날 것 같다</span>
        <span>일어나지 않을 것 같다 →</span>
      </div>
    </div>
  )
}
