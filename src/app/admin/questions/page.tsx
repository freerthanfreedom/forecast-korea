import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import StatusBadge from '@/components/questions/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Plus, Edit } from 'lucide-react'
import type { Question } from '@/types'

export const metadata: Metadata = { title: '질문 관리' }

export default async function AdminQuestionsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('questions')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  const questions = (data || []) as Question[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">질문 관리</h1>
        <Button size="sm" asChild>
          <Link href="/admin/questions/new">
            <Plus className="h-4 w-4 mr-1" />
            새 질문
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead className="hidden sm:table-cell">카테고리</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="hidden md:table-cell">마감일</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium max-w-xs">
                  <Link href={`/questions/${q.slug}`} className="hover:text-primary line-clamp-1">
                    {q.title}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {q.category ? (q.category as { name: string }).name : '-'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={q.status} resolution={q.resolution} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {formatDate(q.close_at)}
                </TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" asChild>
                    <Link href={`/admin/questions/${q.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
