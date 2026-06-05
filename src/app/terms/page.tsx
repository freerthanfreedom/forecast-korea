import type { Metadata } from 'next'
import { APP_NAME, FULL_DISCLAIMER } from '@/lib/constants'

export const metadata: Metadata = {
  title: '이용약관',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-6 prose prose-sm max-w-none">
      <h1 className="text-2xl font-bold">이용약관</h1>
      <p className="text-sm text-muted-foreground">최종 수정일: 2024년 1월 1일</p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 font-medium">
        {FULL_DISCLAIMER}
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">제1조 (목적)</h2>
        <p className="text-sm text-muted-foreground">
          본 약관은 {APP_NAME}(이하 &ldquo;서비스&rdquo;)의 이용조건 및 절차, 이용자와 서비스
          운영자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">제2조 (서비스의 성격)</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>① 본 서비스는 다음의 기능을 제공하는 무료 커뮤니티 플랫폼입니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>미래 사건에 대한 확률 예측 게임</li>
            <li>집단지성 기반 예측 확률 집계 및 표시</li>
            <li>Brier Score 기반 예측 정확도 점수 산정</li>
            <li>예측 관련 의견 및 분석 공유 커뮤니티</li>
          </ul>
          <p>② 본 서비스는 다음을 제공하지 않습니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>현금, 상품, 쿠폰, 포인트, 가상자산 등 어떠한 금전적 보상</li>
            <li>금전 베팅, 도박, 투자, 금융상품 거래, 가상자산 거래 기능</li>
            <li>투자 조언, 금융 상담, 법률 자문</li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">제3조 (예측점수에 관한 사항)</h2>
        <p className="text-sm text-muted-foreground">
          예측점수는 오직 예측 정확도를 나타내는 통계적 지표이며, 어떠한 경제적 가치도 갖지
          않습니다. 예측점수는 현금, 상품, 쿠폰, 포인트, 가상자산, 기타 어떠한 재화 또는
          용역으로도 교환되지 않습니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">제4조 (이용자의 의무)</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>타인의 명예를 훼손하거나 모욕하는 행위</li>
            <li>허위 정보를 작성하거나 유포하는 행위</li>
            <li>서비스 운영을 방해하는 행위</li>
            <li>타인의 개인정보를 무단으로 수집·이용하는 행위</li>
            <li>관련 법령을 위반하는 행위</li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">제5조 (면책조항)</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            ① 본 서비스의 예측 결과는 어떠한 경우에도 투자 조언, 금융 상담, 법률 자문으로
            해석되어서는 안 됩니다.
          </p>
          <p>
            ② 이용자가 서비스 내 정보를 기반으로 실제 투자, 베팅, 또는 기타 경제적 결정을 내린
            경우 발생하는 손실에 대해 운영자는 책임을 지지 않습니다.
          </p>
          <p>
            ③ 운영자는 서비스 내 예측 질문의 판정 결과에 대해 이의를 제기하는 경우 자체 기준에
            따라 재검토할 수 있으나, 그에 따른 어떠한 보상도 제공하지 않습니다.
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">제6조 (준거법 및 재판관할)</h2>
        <p className="text-sm text-muted-foreground">
          본 약관은 대한민국 법률에 따라 해석·적용되며, 서비스와 관련한 분쟁은 대한민국 법원을
          전속 관할 법원으로 합니다.
        </p>
      </section>
    </div>
  )
}
