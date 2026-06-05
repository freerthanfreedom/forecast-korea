import QuestionCard from './QuestionCard'
import EmptyState from '@/components/common/EmptyState'
import type { Question } from '@/types'

interface QuestionListProps {
  questions: Question[]
}

export default function QuestionList({ questions }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <EmptyState
        title="예측이 없습니다"
        description="아직 등록된 예측 질문이 없습니다."
      />
    )
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  )
}
