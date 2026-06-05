'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { generateSlug } from '@/lib/utils'
import type { Category, Question } from '@/types'

interface AdminQuestionFormProps {
  categories: Category[]
  question?: Question
  mode: 'create' | 'edit'
}

export default function AdminQuestionForm({
  categories,
  question,
  mode,
}: AdminQuestionFormProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: question?.title || '',
    slug: question?.slug || '',
    description: question?.description || '',
    category_id: question?.category_id?.toString() || '',
    source_url: question?.source_url || '',
    resolution_criteria: question?.resolution_criteria || '',
    close_at: question?.close_at
      ? new Date(question.close_at).toISOString().slice(0, 16)
      : '',
    resolve_by: question?.resolve_by
      ? new Date(question.resolve_by).toISOString().slice(0, 16)
      : '',
    is_featured: question?.is_featured || false,
    status: question?.status || 'open',
  })

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: mode === 'create' ? generateSlug(value) : prev.slug,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.title || !form.slug || !form.close_at) {
      setError('제목, 슬러그, 마감일은 필수 항목입니다.')
      return
    }

    startTransition(async () => {
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        source_url: form.source_url || null,
        resolution_criteria: form.resolution_criteria || null,
        close_at: new Date(form.close_at).toISOString(),
        resolve_by: form.resolve_by ? new Date(form.resolve_by).toISOString() : null,
        is_featured: form.is_featured,
        status: form.status,
      }

      if (mode === 'create') {
        const { error } = await supabase.from('questions').insert(payload)
        if (error) {
          setError(error.message)
          return
        }
      } else if (question) {
        const { error } = await supabase
          .from('questions')
          .update(payload)
          .eq('id', question.id)
        if (error) {
          setError(error.message)
          return
        }
      }

      router.push('/admin/questions')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="예: 2026년 안에 GPT-5가 출시될까?"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">슬러그 *</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="url-friendly-slug"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="질문에 대한 상세 설명..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>카테고리</Label>
          <Select
            value={form.category_id}
            onValueChange={(v) => setForm((p) => ({ ...p, category_id: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>상태</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">예측 진행중</SelectItem>
              <SelectItem value="closed">예측 마감</SelectItem>
              <SelectItem value="resolved">결과 확정</SelectItem>
              <SelectItem value="void">무효</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="source_url">출처 URL</Label>
        <Input
          id="source_url"
          type="url"
          value={form.source_url}
          onChange={(e) => setForm((p) => ({ ...p, source_url: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="resolution_criteria">판정 기준</Label>
        <Textarea
          id="resolution_criteria"
          value={form.resolution_criteria}
          onChange={(e) => setForm((p) => ({ ...p, resolution_criteria: e.target.value }))}
          placeholder="어떤 조건에서 YES/NO로 판정되는지..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="close_at">예측 마감일 *</Label>
          <Input
            id="close_at"
            type="datetime-local"
            value={form.close_at}
            onChange={(e) => setForm((p) => ({ ...p, close_at: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="resolve_by">결과 확정 예정일</Label>
          <Input
            id="resolve_by"
            type="datetime-local"
            value={form.resolve_by}
            onChange={(e) => setForm((p) => ({ ...p, resolve_by: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_featured"
          type="checkbox"
          checked={form.is_featured}
          onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
          className="h-4 w-4"
        />
        <Label htmlFor="is_featured">주요 예측으로 설정</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : mode === 'create' ? '질문 생성' : '수정 완료'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  )
}
