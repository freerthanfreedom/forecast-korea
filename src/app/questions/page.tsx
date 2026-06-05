import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { calculateCommunityProbability } from '@/lib/scoring'
import QuestionList from '@/components/questions/QuestionList'
import CategoryTabs from '@/components/questions/CategoryTabs'
import AdSlot from '@/components/common/AdSlot'
import { QuestionCardSkeleton } from '@/components/common/LoadingSkeleton'
import type { Question, Category } from '@/types'
// Category is used for getCategories return type

export const metadata: Metadata = {
  title: '예측 목록',
  description: '현재 진행 중인 모든 예측 질문을 확인하세요.',
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    status?: string
    sort?: string
    page?: string
  }>
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
  return (data || []) as Category[]
}

async function getQuestions(params: {
  category?: string
  status?: string
  sort?: string
  page?: number
}): Promise<Question[]> {
  const supabase = await createClient()

  // 카테고리 슬러그 → ID 변환
  let categoryId: number | null = null
  if (params.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    categoryId = cat?.id ?? null
  }

  let query = supabase
    .from('questions')
    .select('*, category:categories(*)')

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  } else if (!params.status) {
    query = query.neq('status', 'void')
  }

  if (categoryId !== null) {
    query = query.eq('category_id', categoryId)
  }

  if (params.sort === 'closing') {
    query = query.order('close_at', { ascending: true })
  } else if (params.sort === 'new') {
    query = query.order('created_at', { ascending: false })
  } else {
    query = query.order('view_count', { ascending: false })
  }

  const page = params.page || 1
  const limit = 20
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data } = await query
  const questions = (data || []) as Question[]

  if (questions.length === 0) return []

  // 커뮤니티 확률 계산
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

export default async function QuestionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const [categories, questions] = await Promise.all([
    getCategories(),
    getQuestions({
      category: params.category,
      status: params.status,
      sort: params.sort,
      page: params.page ? parseInt(params.page) : 1,
    }),
  ])

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">예측 목록</h1>
        <p className="text-sm text-muted-foreground">
          집단지성으로 미래를 예측하세요. 모든 참여는 무료입니다.
        </p>
      </div>

      <Suspense fallback={null}>
        <CategoryTabs categories={categories} />
      </Suspense>

      <div className="flex gap-2 flex-wrap text-sm">
        {[
          { label: '인기순', sort: undefined },
          { label: '마감 임박', sort: 'closing' },
          { label: '최신순', sort: 'new' },
        ].map((item) => (
          <a
            key={item.label}
            href={`/questions?${params.category ? `category=${params.category}&` : ''}${
              item.sort ? `sort=${item.sort}` : ''
            }`}
            className={`px-3 py-1 rounded-full border text-xs transition-colors ${
              params.sort === item.sort ||
              (!params.sort && !item.sort)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary'
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <QuestionList questions={questions} />
      </Suspense>

      <AdSlot className="w-full mt-6" />
    </div>
  )
}
