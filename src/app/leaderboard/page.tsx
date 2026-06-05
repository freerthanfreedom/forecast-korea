import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import AdSlot from '@/components/common/AdSlot'
import EmptyState from '@/components/common/EmptyState'
import { Trophy } from 'lucide-react'
import type { LeaderboardEntry } from '@/types'

export const metadata: Metadata = {
  title: '랭킹',
  description: '정확도 점수 기반 예측자 랭킹을 확인하세요.',
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_stats')
    .select('*, profiles(*)')
    .gt('total_predictions', 0)
    .order('accuracy_score', { ascending: false, nullsFirst: false })
    .limit(100)

  if (!data) return []

  return data.map((row, idx) => ({
    user_id: row.user_id,
    display_name: (row.profiles as { display_name: string })?.display_name || '사용자',
    avatar_url: (row.profiles as { avatar_url: string | null })?.avatar_url || null,
    total_predictions: row.total_predictions,
    resolved_predictions: row.resolved_predictions,
    accuracy_score: row.accuracy_score,
    average_brier_score: row.average_brier_score,
    rank: row.rank ?? idx + 1,
  }))
}

export default async function LeaderboardPage() {
  const entries = await getLeaderboard()

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">예측자 랭킹</h1>
        <p className="text-sm text-muted-foreground">
          Brier Score 기반 정확도 점수로 순위가 결정됩니다. 점수가 높을수록 예측이 정확합니다.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { label: '총 참여자', value: entries.length },
          {
            label: '평균 정확도',
            value: entries.length
              ? `${(entries.reduce((a, b) => a + (b.accuracy_score ?? 0), 0) / entries.length).toFixed(1)}점`
              : '-',
          },
          {
            label: '최고 점수',
            value: entries[0]?.accuracy_score ? `${entries[0].accuracy_score.toFixed(1)}점` : '-',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-muted/50 rounded-lg p-3">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <AdSlot className="w-full" />

      {entries.length === 0 ? (
        <EmptyState
          title="랭킹 데이터가 없습니다"
          description="예측 결과가 확정되면 랭킹이 표시됩니다."
          icon={<Trophy className="h-12 w-12 opacity-30" />}
        />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <LeaderboardTable entries={entries} />
        </div>
      )}

      <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground">
        <p className="font-medium mb-1">점수 산정 방식</p>
        <p>
          Brier Score: (예측확률 - 실제결과)² 로 계산됩니다. 낮을수록 정확합니다.
          <br />
          정확도 점수: (1 - Brier Score) × 100 으로 변환됩니다. 높을수록 정확합니다.
          <br />
          예측점수는 현금, 상품, 쿠폰, 포인트, 가상자산으로 교환되지 않습니다.
        </p>
      </div>
    </div>
  )
}
