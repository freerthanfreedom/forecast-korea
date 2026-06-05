'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react'
import type { Question } from '@/types'

interface ResolutionPanelProps {
  question: Question
}

export default function ResolutionPanel({ question }: ResolutionPanelProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [selectedResolution, setSelectedResolution] = useState<'yes' | 'no' | 'void' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = () => {
    if (!selectedResolution) return
    setError(null)

    startTransition(async () => {
      const res = await fetch(`/api/questions/${question.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution: selectedResolution }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || '결과 확정 중 오류가 발생했습니다.')
        return
      }

      setOpen(false)
      router.refresh()
    })
  }

  if (question.status === 'resolved') {
    return (
      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm font-medium">
          결과 확정:{' '}
          <span
            className={
              question.resolution === 'yes'
                ? 'text-green-600'
                : question.resolution === 'no'
                  ? 'text-destructive'
                  : 'text-muted-foreground'
            }
          >
            {question.resolution === 'yes' ? 'YES' : question.resolution === 'no' ? 'NO' : '무효'}
          </span>
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border p-4 space-y-3">
        <h3 className="font-medium text-sm">결과 확정</h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => {
              setSelectedResolution('yes')
              setOpen(true)
            }}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            YES 확정
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive text-destructive hover:bg-red-50"
            onClick={() => {
              setSelectedResolution('no')
              setOpen(true)
            }}
          >
            <XCircle className="h-4 w-4 mr-1" />
            NO 확정
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-muted-foreground"
            onClick={() => {
              setSelectedResolution('void')
              setOpen(true)
            }}
          >
            <MinusCircle className="h-4 w-4 mr-1" />
            무효 처리
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>결과 확정</DialogTitle>
            <DialogDescription>
              이 작업은 되돌리기 어렵습니다. 모든 참여자의 점수가 계산됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              <span className="font-semibold">{question.title}</span>
            </p>
            <p className="text-sm mt-2">
              결과:{' '}
              <span
                className={`font-bold ${
                  selectedResolution === 'yes'
                    ? 'text-green-600'
                    : selectedResolution === 'no'
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                }`}
              >
                {selectedResolution === 'yes'
                  ? 'YES'
                  : selectedResolution === 'no'
                    ? 'NO'
                    : '무효'}
              </span>
              로 확정하시겠습니까?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? '처리 중...' : '확정'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
