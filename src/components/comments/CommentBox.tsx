'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/profile/UserAvatar'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { formatRelativeTime } from '@/lib/utils'
import type { Comment } from '@/types'

interface CommentBoxProps {
  questionId: string
  comments: Comment[]
}

export default function CommentBox({ questionId, comments }: CommentBoxProps) {
  const { user, supabase } = useSupabase()
  const router = useRouter()
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setError(null)
    startTransition(async () => {
      if (!user) {
        router.push('/login')
        return
      }
      const { error } = await supabase.from('comments').insert({
        question_id: questionId,
        user_id: user.id,
        body: body.trim(),
      })
      if (error) {
        setError('댓글 작성 중 오류가 발생했습니다.')
        return
      }
      setBody('')
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-base">댓글 {comments.length}개</h3>

      {/* 댓글 작성 폼 */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <UserAvatar
              displayName={user.user_metadata?.display_name || user.email || 'U'}
              avatarUrl={user.user_metadata?.avatar_url}
              size="sm"
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="분석 근거나 의견을 작성하세요..."
              rows={3}
              className="flex-1 text-sm"
              maxLength={1000}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isPending || !body.trim()}>
              {isPending ? '작성 중...' : '댓글 작성'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
          <Button size="sm" asChild>
            <a href="/login">로그인</a>
          </Button>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            아직 댓글이 없습니다. 첫 댓글을 작성해 보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <UserAvatar
                displayName={comment.profiles?.display_name || '사용자'}
                avatarUrl={comment.profiles?.avatar_url}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {comment.profiles?.display_name || '사용자'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                  {comment.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
