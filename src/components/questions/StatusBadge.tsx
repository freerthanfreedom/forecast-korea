import { Badge } from '@/components/ui/badge'
import type { QuestionStatus, Resolution } from '@/types'

interface StatusBadgeProps {
  status: QuestionStatus
  resolution?: Resolution | null
}

export default function StatusBadge({ status, resolution }: StatusBadgeProps) {
  if (status === 'resolved') {
    if (resolution === 'yes') {
      return <Badge variant="success">YES 확정</Badge>
    }
    if (resolution === 'no') {
      return <Badge variant="destructive">NO 확정</Badge>
    }
    if (resolution === 'void') {
      return <Badge variant="muted">무효</Badge>
    }
    return <Badge variant="info">결과 확정</Badge>
  }
  if (status === 'open') {
    return <Badge variant="info">예측 진행중</Badge>
  }
  if (status === 'closed') {
    return <Badge variant="warning">예측 마감</Badge>
  }
  if (status === 'void') {
    return <Badge variant="muted">무효</Badge>
  }
  return null
}
