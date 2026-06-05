import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { APP_NAME, SITE_URL } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    '돈을 걸지 않고 미래를 예측하세요. 수익이 아니라 정확도로 경쟁하는 한국어 집단지성 예측 커뮤니티.',
  keywords: ['예측', '집단지성', '확률', '정확도', '미래예측', '커뮤니티'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: APP_NAME,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SupabaseProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  )
}
