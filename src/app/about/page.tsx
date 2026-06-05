import type { Metadata } from 'next'
import { TrendingUp, Target, Trophy, Users, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { APP_NAME, FULL_DISCLAIMER } from '@/lib/constants'

export const metadata: Metadata = {
  title: '서비스 소개',
  description: `${APP_NAME}는 금전 베팅 없이 예측 정확도를 겨루는 무료 커뮤니티 서비스입니다.`,
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-10">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <TrendingUp className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">{APP_NAME}</h1>
        <p className="text-muted-foreground text-lg">
          돈을 걸지 않고, 미래를 예측하세요.
          <br />
          수익이 아니라 정확도로 경쟁합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: <Target className="h-6 w-6 text-primary" />,
            title: '정확도 경쟁',
            desc: 'Brier Score 기반 공정한 점수 시스템으로 예측 정확도를 측정합니다.',
          },
          {
            icon: <Users className="h-6 w-6 text-primary" />,
            title: '집단지성',
            desc: '모든 참여자의 예측을 집계해 집단 확률을 실시간으로 제공합니다.',
          },
          {
            icon: <Trophy className="h-6 w-6 text-primary" />,
            title: '랭킹 시스템',
            desc: '오랜 기간에 걸친 예측 정확도로 순위를 산정합니다.',
          },
          {
            icon: <Shield className="h-6 w-6 text-primary" />,
            title: '완전 무료',
            desc: '모든 예측 참여는 무료입니다. 어떤 금전적 거래도 없습니다.',
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="pt-5 space-y-2">
              {item.icon}
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">어떻게 작동하나요?</h2>
        <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
          <li>관심 있는 예측 질문을 선택합니다.</li>
          <li>YES 가능성을 0%~100% 슬라이더로 설정합니다.</li>
          <li>질문 결과가 확정되면 Brier Score로 점수를 계산합니다.</li>
          <li>많은 예측을 완료할수록 정확도 점수가 누적됩니다.</li>
          <li>댓글을 통해 분석 근거를 공유하고 토론하세요.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Brier Score란?</h2>
        <p className="text-sm text-muted-foreground">
          Brier Score는 예측 정확도를 측정하는 통계 지표입니다. 예측 확률과 실제 결과의 차이를
          제곱한 값으로, 낮을수록 예측이 정확합니다. 저희는 이를 반전시켜 0~100점 척도의 정확도
          점수로 표현합니다.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 text-sm font-mono">
          <p>Brier Score = (예측확률 - 실제결과)²</p>
          <p className="mt-1">정확도 점수 = (1 - Brier Score) × 100</p>
        </div>
      </section>

      <section className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">중요 안내</p>
        <p>{FULL_DISCLAIMER}</p>
      </section>
    </div>
  )
}
