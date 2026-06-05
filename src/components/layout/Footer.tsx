import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { APP_NAME, FULL_DISCLAIMER } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              {APP_NAME}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              돈을 걸지 않고, 미래를 예측하세요.
              <br />
              수익이 아니라 정확도로 경쟁합니다.
            </p>
            <p className="text-xs text-muted-foreground bg-muted rounded p-2">{FULL_DISCLAIMER}</p>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="font-semibold text-sm mb-3">서비스</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/questions" className="hover:text-foreground transition-colors">
                  예측 목록
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-foreground transition-colors">
                  랭킹
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 고지 */}
          <div>
            <h3 className="font-semibold text-sm mb-3">법적 고지</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>© 2024 {APP_NAME}. 모든 예측 참여는 무료입니다.</p>
          <p>본 서비스는 도박, 베팅, 투자 서비스가 아닙니다.</p>
        </div>
      </div>
    </footer>
  )
}
