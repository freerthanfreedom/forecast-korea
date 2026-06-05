import Link from 'next/link'
import { ArrowRight, TrendingUp, Target, Users, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import QuestionCard from '@/components/questions/QuestionCard'
import AdSlot from '@/components/common/AdSlot'
import UserAvatar from '@/components/profile/UserAvatar'
import { createClient } from '@/lib/supabase/server'
import { calculateCommunityProbability } from '@/lib/scoring'
import { APP_NAME } from '@/lib/constants'
import type { Question, LeaderboardEntry } from '@/types'

async function getFeaturedQuestions(): Promise<Question[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('questions')
    .select('*, category:categories(*)')
    .eq('status', 'open')
    .order('view_count', { ascending: false })
    .limit(4)
  return (data || []) as Question[]
}

async function getClosingSoonQuestions(): Promise<Question[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('questions')
    .select('*, category:categories(*)')
    .eq('status', 'open')
    .gte('close_at', new Date().toISOString())
    .order('close_at', { ascending: true })
    .limit(4)
  return (data || []) as Question[]
}

async function getRecentlyResolvedQuestions(): Promise<Question[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('questions')
    .select('*, category:categories(*)')
    .eq('status', 'resolved')
    .order('updated_at', { ascending: false })
    .limit(4)
  return (data || []) as Question[]
}

async function getTopLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_stats')
    .select('*, profiles(*)')
    .not('resolved_predictions', 'eq', 0)
    .order('accuracy_score', { ascending: false })
    .limit(5)
  if (!data) return []
  return data.map((row) => ({
    user_id: row.user_id,
    display_name: (row.profiles as { display_name: string })?.display_name || '사용자',
    avatar_url: (row.profiles as { avatar_url: string | null })?.avatar_url || null,
    total_predictions: row.total_predictions,
    resolved_predictions: row.resolved_predictions,
    accuracy_score: row.accuracy_score,
    average_brier_score: row.average_brier_score,
    rank: row.rank,
  }))
}

async function enrichWithCommunityProbability(questions: Question[]): Promise<Question[]> {
  if (questions.length === 0) return []
  const supabase = await createClient()
  const ids = questions.map((q) => q.id)
  const { data: predictions } = await supabase
    .from('predictions')
    .select('question_id, probability')
    .in('question_id', ids)

  const grouped: Record<string, number[]> = {}
  for (const p of predictions || []) {
    if (!grouped[p.question_id]) grouped[p.question_id] = []
    grouped[p.question_id].push(p.probability)
  }

  return questions.map((q) => ({
    ...q,
    community_probability: calculateCommunityProbability(grouped[q.id] || []),
    prediction_count: (grouped[q.id] || []).length,
  }))
}

export default async function HomePage() {
  const [popular, closingSoon, resolved, leaderboard] = await Promise.all([
    getFeaturedQuestions().then(enrichWithCommunityProbability),
    getClosingSoonQuestions().then(enrichWithCommunityProbability),
    getRecentlyResolvedQuestions().then(enrichWithCommunityProbability),
    getTopLeaderboard(),
  ])

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* 히어로 섹션 */}
      <section className="text-center py-12 space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
          <TrendingUp className="h-4 w-4" />
          {APP_NAME}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          돈을 걸지 않고,
          <br />
          미래를 예측하세요.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          수익이 아니라 정확도로 경쟁합니다.
          <br />
          집단지성으로 미래를 더 정확하게 예측해 보세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button size="lg" asChild>
            <Link href="/questions">
              예측 참여하기 <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">서비스 소개</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          모든 예측 참여는 무료입니다. 금전 베팅 없음.
        </p>
      </section>

      {/* 특징 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Target className="h-6 w-6 text-primary" />,
            title: '집단지성 확률',
            desc: '모든 참여자의 예측을 종합한 집단 확률을 확인하세요.',
          },
          {
            icon: <Trophy className="h-6 w-6 text-primary" />,
            title: '정확도 경쟁',
            desc: 'Brier Score 기반 공정한 정확도 점수로 랭킹을 다투세요.',
          },
          {
            icon: <Users className="h-6 w-6 text-primary" />,
            title: '무료 커뮤니티',
            desc: '분석 근거를 댓글로 공유하고 함께 토론하세요.',
          },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="pt-6 text-center space-y-2">
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <AdSlot className="w-full" />

      {/* 인기 예측 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">인기 예측</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/questions">전체 보기 →</Link>
          </Button>
        </div>
        <div className="space-y-3">
          {popular.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </section>

      {/* 마감 임박 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">⏰ 마감 임박</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/questions?sort=closing">전체 보기 →</Link>
          </Button>
        </div>
        <div className="space-y-3">
          {closingSoon.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </section>

      {/* 최근 확정 */}
      {resolved.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">✅ 최근 확정 결과</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/questions?status=resolved">전체 보기 →</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {resolved.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      )}

      {/* 상위 예측자 */}
      {leaderboard.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🏆 상위 예측자</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/leaderboard">전체 랭킹 →</Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {leaderboard.map((entry, idx) => (
                  <div key={entry.user_id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-sm font-bold text-muted-foreground w-5 text-center">
                      {idx + 1}
                    </span>
                    <UserAvatar
                      displayName={entry.display_name}
                      avatarUrl={entry.avatar_url}
                      size="sm"
                    />
                    <Link
                      href={`/users/${entry.user_id}`}
                      className="flex-1 font-medium text-sm hover:text-primary"
                    >
                      {entry.display_name}
                    </Link>
                    <span className="text-sm font-semibold text-primary">
                      {entry.accuracy_score !== null
                        ? `${entry.accuracy_score.toFixed(1)}점`
                        : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <AdSlot className="w-full" />
    </div>
  )
}
