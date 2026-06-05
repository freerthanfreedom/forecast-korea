'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { APP_NAME, FULL_DISCLAIMER } from '@/lib/constants'

export default function SignupPage() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
        },
      })
      if (error) {
        if (error.message.includes('already registered')) {
          setError('이미 사용 중인 이메일입니다.')
        } else {
          setError(error.message)
        }
        return
      }
      setSuccess(true)
    })
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="pt-8 pb-8 space-y-3">
            <div className="text-4xl">📧</div>
            <h2 className="text-xl font-bold">이메일을 확인하세요</h2>
            <p className="text-sm text-muted-foreground">
              {email}으로 인증 이메일을 보냈습니다.
              <br />
              링크를 클릭하면 가입이 완료됩니다.
            </p>
            <Button asChild className="w-full mt-4">
              <Link href="/login">로그인 페이지로</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{APP_NAME} 회원가입</CardTitle>
          <CardDescription>무료로 시작하세요. 예측 참여는 모두 무료입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="displayName">닉네임</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="예측자닉네임"
                required
                minLength={2}
                maxLength={20}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상"
                required
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="bg-muted/50 rounded p-2.5 text-xs text-muted-foreground">
              {FULL_DISCLAIMER}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? '가입 중...' : '무료 회원가입'}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
