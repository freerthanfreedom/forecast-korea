import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: '개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <p className="text-sm text-muted-foreground">최종 수정일: 2024년 1월 1일</p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">1. 수집하는 개인정보</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{APP_NAME}은 다음의 개인정보를 수집합니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>이메일 주소 (회원가입 시)</li>
            <li>닉네임 (회원가입 시, 사용자 제공)</li>
            <li>프로필 사진 URL (선택, 사용자 제공)</li>
            <li>서비스 이용 기록 (예측 참여, 댓글 작성)</li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2. 개인정보의 이용 목적</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>회원 인증 및 서비스 제공</li>
            <li>예측 참여 기록 관리 및 점수 산정</li>
            <li>서비스 개선 및 통계 분석</li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">3. 개인정보의 보유 및 이용기간</h2>
        <p className="text-sm text-muted-foreground">
          회원 탈퇴 시까지 보유합니다. 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당
          기간 동안 보관됩니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">4. 제3자 제공</h2>
        <p className="text-sm text-muted-foreground">
          이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의한 경우 또는 이용자의
          동의가 있는 경우에는 예외로 합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">5. 기술적 보안 조치</h2>
        <p className="text-sm text-muted-foreground">
          Supabase Auth를 통한 안전한 인증 시스템을 사용하며, 비밀번호는 암호화되어 저장됩니다.
          Row Level Security를 통해 사용자 데이터를 보호합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">6. 이용자의 권리</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>이용자는 다음의 권리를 행사할 수 있습니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>개인정보 조회 및 수정</li>
            <li>회원 탈퇴 및 개인정보 삭제</li>
            <li>개인정보 처리에 대한 동의 철회</li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">7. 쿠키 및 분석</h2>
        <p className="text-sm text-muted-foreground">
          서비스 이용 편의를 위해 쿠키를 사용합니다. 또한 Google AdSense를 통한 광고가 표시될 수
          있으며, 이에 따라 쿠키가 사용될 수 있습니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">8. 문의</h2>
        <p className="text-sm text-muted-foreground">
          개인정보 처리에 관한 문의는 서비스 내 커뮤니티를 통해 연락해 주시기 바랍니다.
        </p>
      </section>
    </div>
  )
}
