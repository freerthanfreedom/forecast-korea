'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { formatProbability } from '@/lib/utils'
import { DISCLAIMER } from '@/lib/constants'

interface PredictionSliderProps {
  questionId: string
  questionStatus: string
  initialProbability?: number
}

export default function PredictionSlider({
  questionId,
  questionStatus,
  initialProbability = 50,
}: PredictionSliderProps) {
  const { user, supabase } = useSupabase()
  const router = useRouter()
  const [value, setValue] = useState<number>(initialProbability)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isOpen = questionStatus === 'open'

  const handleSubmit = () => {
    if (!user) {
      router.push('/login')
      return
    }

    setMessage(null)
    setError(null)

    startTransition(async () => {
      try {
        // upsert prediction
        const { error: upsertError } = await supabase
          .from('predictions')
          .upsert(
            {
              question_id: questionId,
              user_id: user.id,
              probability: value,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'question_id,user_id' }
          )

        if (upsertError) throw upsertError

        // insert history
        await supabase.from('prediction_history').insert({
          question_id: questionId,
          user_id: user.id,
          probability: value,
        })

        setMessage('예측이 저장되었습니다!')
        router.refresh()
      } catch (err) {
        setError('예측 저장 중 오류가 발생했습니다.')
        console.error(err)
      }
    })
  }

  if (!isOpen) {
    return (
      <div className="bg-muted/50 rounded-lg p-4 text-center text-sm text-muted-foreground">
        이 예측은 마감되었습니다.
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <p className="text-sm text-blue-800 mb-3">예측에 참여하려면 로그인이 필요합니다.</p>
        <Button size="sm" asChild>
          <a href="/login">로그인</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">내 예측 확률</span>
          <span
            className={`text-2xl font-bold ${
              value >= 70 ? 'text-green-600' : value >= 40 ? 'text-yellow-600' : 'text-red-600'
            }`}
          >
            {formatProbability(value)}
          </span>
        </div>
        <Slider
          min={1}
          max={99}
          step={1}
          value={[value]}
          onValueChange={([v]) => setValue(v)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>아니오 (0%)</span>
          <span>예 (100%)</span>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className="w-full">
        {isPending ? '저장 중...' : '예측 저장'}
      </Button>

      {message && (
        <p className="text-sm text-green-600 text-center">{message}</p>
      )}
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <p className="text-xs text-muted-foreground text-center">{DISCLAIMER}</p>
    </div>
  )
}
