# 포어캐스트 코리아

한국어 기반 무료 예측 커뮤니티 웹사이트 MVP

## 소개

포어캐스트 코리아는 사용자들이 미래 사건에 대한 확률 예측을 공유하고 집단지성을 통해 정확도를 겨루는 무료 커뮤니티 서비스입니다.

- 모든 예측 참여는 **무료**입니다
- 금전 베팅, 도박, 투자, 금융상품 거래 기능 없음
- 예측점수는 현금, 상품, 쿠폰, 포인트, 가상자산으로 교환되지 않음

## 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth + PostgreSQL)
- **Charts**: Recharts
- **Deployment**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 Supabase 프로젝트 정보를 입력합니다.

### 3. Supabase 설정

Supabase 대시보드의 SQL Editor에서 순서대로 실행:

```bash
supabase/schema.sql   # 테이블 생성
supabase/rls.sql      # Row Level Security 정책
supabase/seed.sql     # 초기 데이터
```

### 4. 개발 서버 실행

```bash
npm run dev
```

## 파일 구조

```
src/
├── app/              # Next.js App Router 페이지
├── components/       # React 컴포넌트
├── lib/              # 유틸리티, Supabase 클라이언트
└── types/            # TypeScript 타입 정의
supabase/
├── schema.sql        # DB 스키마
├── rls.sql           # RLS 정책
└── seed.sql          # 시드 데이터
```

## 주의사항

본 서비스는 금전 베팅, 도박, 투자, 금융상품 거래, 가상자산 거래 서비스를 제공하지 않습니다. 예측점수는 현금, 상품, 쿠폰, 포인트, 가상자산으로 교환되지 않으며, 모든 예측 참여는 무료입니다.
