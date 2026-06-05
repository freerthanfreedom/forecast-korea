'use client'

import { useEffect, useState, useTransition } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UserAvatar from '@/components/profile/UserAvatar'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { formatDate } from '@/lib/utils'
import type { Profile } from '@/types'

export default function AdminUsersPage() {
  const { supabase } = useSupabase()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      setProfiles((data || []) as Profile[])
      setLoading(false)
    }
    fetch()
  }, [supabase])

  const handleRoleChange = (userId: string, role: string) => {
    startTransition(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
      if (!error) {
        setProfiles((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, role: role as Profile['role'] } : p))
        )
      }
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">유저 관리</h1>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유저</TableHead>
              <TableHead className="hidden sm:table-cell">가입일</TableHead>
              <TableHead>역할</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        displayName={profile.display_name}
                        avatarUrl={profile.avatar_url}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-sm">{profile.display_name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {profile.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {formatDate(profile.created_at)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={profile.role}
                      onValueChange={(v) => handleRoleChange(profile.id, v)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">일반</SelectItem>
                        <SelectItem value="moderator">모더레이터</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
