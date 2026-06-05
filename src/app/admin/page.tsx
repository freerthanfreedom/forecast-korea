import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '관리자 대시보드' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [questionsResult, usersResult, predictionsResult, scoresResult] = await Promise.all([
    supabase.from('questions').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('predictions').select('id', { count: 'exact', head: true }),
    supabase.from('scores').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: '총 질문', value: questionsResult.count ?? 0 },
    { label: '가입자 수', value: usersResult.count ?? 0 },
    { label: '총 예측', value: predictionsResult.count ?? 0 },
    { label: '완료된 점수', value: scoresResult.count ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">관리자 대시보드</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 pb-4 text-center">
              <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
