import Link from 'next/link'
import { Eye, Clock, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import StatusBadge from './StatusBadge'
import ProbabilityBadge from './ProbabilityBadge'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import type { Question } from '@/types'

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const isClosed = question.status === 'closed' || question.status === 'resolved'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* 상태 & 카테고리 */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={question.status} resolution={question.resolution} />
              {question.category && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {question.category.name}
                </span>
              )}
            </div>

            {/* 제목 */}
            <Link
              href={`/questions/${question.slug}`}
              className="block text-sm sm:text-base font-semibold hover:text-primary transition-colors line-clamp-2 mb-3"
            >
              {question.title}
            </Link>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {isClosed ? '마감' : `마감 ${formatDate(question.close_at)}`}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {question.view_count.toLocaleString()}
              </span>
              {question.prediction_count !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {question.prediction_count}명 예측
                </span>
              )}
            </div>
          </div>

          {/* 확률 뱃지 */}
          {question.community_probability !== undefined && (
            <div className="flex-shrink-0 text-center">
              <ProbabilityBadge probability={question.community_probability} size="md" />
              <p className="text-xs text-muted-foreground mt-1">집단예측</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
