export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '포어캐스트 코리아'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forecast-korea.vercel.app'

export const DISCLAIMER = '이 예측은 금전 베팅이나 투자 조언이 아닙니다.'
export const FULL_DISCLAIMER =
  '본 서비스는 금전 베팅, 도박, 투자, 금융상품 거래, 가상자산 거래 서비스를 제공하지 않습니다. 예측점수는 현금, 상품, 쿠폰, 포인트, 가상자산으로 교환되지 않습니다. 모든 예측 참여는 무료입니다.'

export const QUESTION_STATUS_LABELS: Record<string, string> = {
  open: '예측 진행중',
  closed: '예측 마감',
  resolved: '결과 확정',
  void: '무효',
}

export const RESOLUTION_LABELS: Record<string, string> = {
  yes: 'YES',
  no: 'NO',
  void: '무효',
}

export const ITEMS_PER_PAGE = 20
export const COMMENTS_PER_PAGE = 20
export const LEADERBOARD_PER_PAGE = 50
