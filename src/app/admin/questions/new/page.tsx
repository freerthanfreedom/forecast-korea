import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AdminQuestionForm from '@/components/admin/AdminQuestionForm'
import type { Category } from '@/types'

export const metadata: Metadata = { title: '새 질문 생성' }

export default async function AdminNewQuestionPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
  const categories = (data || []) as Category[]

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-bold">새 질문 생성</h1>
      <AdminQuestionForm categories={categories} mode="create" />
    </div>
  )
}
