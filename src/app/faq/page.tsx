import type { Metadata } from 'next'
import { APP_NAME, FULL_DISCLAIMER } from '@/lib/constants'

export const metadata: Metadata = {
  title: '자주 묻는 질문',
}

const faqs = [
  {
    q: '포어캐스트 코리아는 도박 사이트인가요?',
    a: '아닙니다. 본 서비스는 금전 베팅, 도박, 투자, 금융상품 거래, 가상자산 거래 서비스를 제공하지 않습니다. 모든 예측 참여는 완전히 무료이며, 어떠한 금전적 보상도 없습니다.',
  },
  {
    q: '예측점수는 현금으로 교환할 수 있나요?',
    a: '절대 불가합니다. 예측점수는 현금, 상품, 쿠폰, 포인트, 가상자산으로 교환되지 않습니다. 점수는 순수하게 예측 정확도를 나타내는 지표입니다.',
  },
  {
    q: '참여 비용이 있나요?',
    a: '없습니다. 모든 예측 참여는 무료입니다. 회원가입도 무료입니다.',
  },
  {
    q: 'Brier Score는 무엇인가요?',
    a: 'Brier Score는 확률 예측의 정확도를 측정하는 통계 지표입니다. 예측 확률(0~1)과 실제 결과(0 또는 1)의 차이를 제곱한 값입니다. 낮을수록 예측이 정확합니다. 저희 서비스에서는 이를 반전하여 0~100 점수로 표시합니다.',
  },
  {
    q: '예측 확률은 어떻게 입력하나요?',
    a: '질문 상세 페이지의 슬라이더를 이용해 1%~99% 사이의 확률을 입력할 수 있습니다. 로그인이 필요합니다.',
  },
  {
    q: '예측을 변경할 수 있나요?',
    a: '예측 마감 전까지 언제든지 예측 확률을 변경할 수 있습니다. 마감 이후에는 변경이 불가합니다.',
  },
  {
    q: '집단 예측 확률은 어떻게 계산되나요?',
    a: '해당 질문에 예측을 제출한 모든 활성 유저의 최신 예측 확률의 단순 평균으로 계산됩니다.',
  },
  {
    q: '결과는 누가 판정하나요?',
    a: '관리자 또는 모더레이터가 공식 출처(기사, 공식 발표 등)를 근거로 YES/NO를 판정합니다. 판정 기준은 각 질문의 "판정 기준" 항목에 명시되어 있습니다.',
  },
  {
    q: '암호화폐 관련 예측도 도박인가요?',
    a: '아닙니다. 암호화폐 가격 예측은 단순한 정보성 예측 게임이며, 실제 암호화폐 거래나 투자가 이루어지지 않습니다. 해당 예측 결과는 투자 조언이 아닙니다.',
  },
  {
    q: '댓글 작성 규칙이 있나요?',
    a: '분석 근거와 의견을 예의 바르게 공유해 주세요. 타인에 대한 비방, 욕설, 스팸, 허위정보 등은 금지됩니다. 위반 시 댓글이 삭제될 수 있습니다.',
  },
]

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">자주 묻는 질문</h1>
        <p className="text-muted-foreground text-sm">{APP_NAME}에 대한 자주 묻는 질문들입니다.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-lg p-4 space-y-2">
            <h2 className="font-semibold text-sm">Q. {faq.q}</h2>
            <p className="text-sm text-muted-foreground">A. {faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground">
        <p className="font-semibold mb-1">서비스 면책 고지</p>
        <p>{FULL_DISCLAIMER}</p>
      </div>
    </div>
  )
}
