import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import UserAvatar from '@/components/profile/UserAvatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Profile, UserStats, Score } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('display_name').eq('id', id).single()
  return { title: data ? `${data.display_name}의 프로필` : '프로필' }
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [profileResult, statsResult, scoresResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('user_stats').select('*').eq('user_id', id).single(),
    supabase
      .from('scores')
      .select('*, questions(title, slug, resolution)')
      .eq('user_id', id)
      .order('resolved_at', { ascending: false })
      .limit(20),
  ])

  if (!profileResult.data) notFound()

  const profile = profileResult.data as Profile
  const stats = statsResult.data as UserStats | null
  const scores = (scoresResult.data || []) as Score[]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      {/* 프로필 헤더 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <UserAvatar
              displayName={profile.display_name}
              avatarUrl={profile.avatar_url}
              size="xl"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{profile.display_name}</h1>
                {profile.role !== 'user' && (
                  <Badge variant="secondary">
                    {profile.role === 'admin' ? '관리자' : '모더레이터'}
                  </Badge>
                )}
              </div>
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                가입일: {formatDate(profile.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통계 */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '총 예측', value: stats.total_predictions },
            { label: '완료', value: stats.resolved_predictions },
            {
              label: '정확도 점수',
              value: stats.accuracy_score !== null ? `${stats.accuracy_score.toFixed(1)}점` : '-',
            },
            {
              label: '랭킹',
              value: stats.rank !== null ? `#${stats.rank}` : '-',
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 예측 이력 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">예측 이력</CardTitle>
        </CardHeader>
        <CardContent>
          {scores.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              아직 완료된 예측이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {scores.map((score) => {
                const question = score.questions as {
                  title: string
                  slug: string
                  resolution: string
                } | null
                return (
                  <div key={score.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      {question && (
                        <Link
                          href={`/questions/${question.slug}`}
                          className="font-medium hover:text-primary line-clamp-1"
                        >
                          {question.title}
                        </Link>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        예측: {Math.round(score.probability)}% → 결과:{' '}
                        <span
                          className={
                            question?.resolution === 'yes'
                              ? 'text-green-600 font-medium'
                              : 'text-destructive font-medium'
                          }
                        >
                          {question?.resolution === 'yes' ? 'YES' : 'NO'}
                        </span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-semibold ${
                          (score.score ?? 0) >= 70 ? 'text-green-600' : 'text-muted-foreground'
                        }`}
                      >
                        {score.score !== null ? `${score.score}점` : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(score.resolved_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        예측점수는 현금, 상품, 쿠폰, 포인트, 가상자산으로 교환되지 않습니다.
      </p>
    </div>
  )
}
