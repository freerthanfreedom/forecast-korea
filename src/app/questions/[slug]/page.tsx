import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ExternalLink, Calendar, Users, Eye, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { calculateCommunityProbability } from '@/lib/scoring'
import { formatDate, formatDateTime } from '@/lib/utils'
import { DISCLAIMER, SITE_URL } from '@/lib/constants'
import ProbabilityBadge from '@/components/questions/ProbabilityBadge'
import StatusBadge from '@/components/questions/StatusBadge'
import PredictionSlider from '@/components/prediction/PredictionSlider'
import ForecastChart from '@/components/prediction/ForecastChart'
import CommentBox from '@/components/comments/CommentBox'
import AdSlot from '@/components/common/AdSlot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Question, Comment, PredictionHistory } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getQuestion(slug: string): Promise<Question | null> {
  const supabase = await createClient()

  // 조회수 증가
  const { data } = await supabase
    .from('questions')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single()

  if (!data) return null

  await supabase
    .from('questions')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id)

  return data as Question
}

async function getCommunityData(questionId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('predictions')
    .select('probability')
    .eq('question_id', questionId)
  return (data || []).map((p) => p.probability)
}

async function getPredictionHistory(questionId: string): Promise<PredictionHistory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('prediction_history')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: true })
    .limit(200)
  return (data || []) as PredictionHistory[]
}

async function getComments(questionId: string): Promise<Comment[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('question_id', questionId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
  return (data || []) as Comment[]
}

async function getUserPrediction(questionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('predictions')
    .select('probability')
    .eq('question_id', questionId)
    .eq('user_id', user.id)
    .single()

  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const question = await getQuestion(slug)
  if (!question) return { title: '질문을 찾을 수 없습니다' }

  return {
    title: question.title,
    description: question.description || `${question.title} - 집단지성 예측에 참여하세요.`,
    openGraph: {
      title: question.title,
      description: question.description || question.title,
      url: `${SITE_URL}/questions/${slug}`,
    },
  }
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { slug } = await params
  const question = await getQuestion(slug)
  if (!question) notFound()

  const [probabilities, history, comments, userPrediction] = await Promise.all([
    getCommunityData(question.id),
    getPredictionHistory(question.id),
    getComments(question.id),
    getUserPrediction(question.id),
  ])

  const communityProbability = calculateCommunityProbability(probabilities)

  // 집단예측 시계열 (prediction_history 기반 일별 평균)
  const dailyGrouped: Record<string, number[]> = {}
  for (const h of history) {
    const day = h.created_at.slice(0, 10)
    if (!dailyGrouped[day]) dailyGrouped[day] = []
    dailyGrouped[day].push(h.probability)
  }
  const communityChartData = Object.entries(dailyGrouped).map(([date, probs]) => ({
    date,
    probability: calculateCommunityProbability(probs),
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 헤더 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={question.status} resolution={question.resolution} />
              {question.category && (
                <Badge variant="outline">{(question.category as { name: string }).name}</Badge>
              )}
              {question.is_featured && (
                <Badge variant="secondary">주요 예측</Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold leading-snug">{question.title}</h1>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                마감: {formatDateTime(question.close_at)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {probabilities.length}명 참여
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {question.view_count.toLocaleString()} 조회
              </span>
            </div>
          </div>

          {/* 집단 예측 확률 */}
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">집단 예측 확률</p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-5xl font-bold ${
                        communityProbability >= 70
                          ? 'text-green-600'
                          : communityProbability >= 40
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      {Math.round(communityProbability)}%
                    </span>
                    <span className="text-sm text-muted-foreground">YES 가능성</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {probabilities.length}명 참여 기준
                  </p>
                </div>
                {question.resolution && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">확정 결과</p>
                    <span
                      className={`text-2xl font-bold ${
                        question.resolution === 'yes'
                          ? 'text-green-600'
                          : question.resolution === 'no'
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {question.resolution === 'yes'
                        ? 'YES'
                        : question.resolution === 'no'
                          ? 'NO'
                          : '무효'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 예측 추이 차트 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">예측 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <ForecastChart data={[]} communityData={communityChartData} />
            </CardContent>
          </Card>

          {/* 설명 */}
          {question.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">질문 설명</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{question.description}</p>
              </CardContent>
            </Card>
          )}

          {/* 판정 기준 */}
          {question.resolution_criteria && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">판정 기준</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {question.resolution_criteria}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 출처 */}
          {question.source_url && (
            <div className="flex items-center gap-1 text-sm">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">출처:</span>
              <Link
                href={question.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {question.source_url}
              </Link>
            </div>
          )}

          {/* 면책 문구 */}
          <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
          </div>

          <AdSlot className="w-full" />

          {/* 댓글 */}
          <Card>
            <CardContent className="pt-6">
              <CommentBox questionId={question.id} comments={comments} />
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-4">
          {/* 예측 슬라이더 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">내 예측</CardTitle>
            </CardHeader>
            <CardContent>
              <PredictionSlider
                questionId={question.id}
                questionStatus={question.status}
                initialProbability={userPrediction?.probability ?? 50}
              />
            </CardContent>
          </Card>

          {/* 일정 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">일정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">시작</span>
                <span>{formatDate(question.open_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">예측 마감</span>
                <span>{formatDate(question.close_at)}</span>
              </div>
              {question.resolve_by && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">결과 확정 예정</span>
                  <span>{formatDate(question.resolve_by)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <AdSlot />
        </div>
      </div>
    </div>
  )
}
