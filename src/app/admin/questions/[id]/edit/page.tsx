import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AdminQuestionForm from '@/components/admin/AdminQuestionForm'
import ResolutionPanel from '@/components/admin/ResolutionPanel'
import type { Category, Question } from '@/types'

export const metadata: Metadata = { title: '질문 수정' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEditQuestionPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [questionResult, categoriesResult] = await Promise.all([
    supabase.from('questions').select('*, category:categories(*)').eq('id', id).single(),
    supabase.from('categories').select('*').order('display_order', { ascending: true }),
  ])

  if (!questionResult.data) notFound()

  const question = questionResult.data as Question
  const categories = (categoriesResult.data || []) as Category[]

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold">질문 수정</h1>
      <ResolutionPanel question={question} />
      <AdminQuestionForm categories={categories} question={question} mode="edit" />
    </div>
  )
}
