import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import UserAvatar from '@/components/profile/UserAvatar'
import { Medal } from 'lucide-react'
import type { LeaderboardEntry } from '@/types'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <Medal className="h-5 w-5 text-yellow-500" />
  if (rank === 2)
    return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3)
    return <Medal className="h-5 w-5 text-amber-600" />
  return <span className="text-sm font-medium text-muted-foreground">{rank}</span>
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">순위</TableHead>
          <TableHead>예측자</TableHead>
          <TableHead className="text-right">예측 참여</TableHead>
          <TableHead className="text-right">완료</TableHead>
          <TableHead className="text-right">정확도 점수</TableHead>
          <TableHead className="text-right hidden sm:table-cell">Brier 점수</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry, idx) => {
          const rank = entry.rank ?? idx + 1
          return (
            <TableRow key={entry.user_id}>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <RankBadge rank={rank} />
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/users/${entry.user_id}`}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <UserAvatar
                    displayName={entry.display_name}
                    avatarUrl={entry.avatar_url}
                    size="sm"
                  />
                  <span className="font-medium text-sm">{entry.display_name}</span>
                </Link>
              </TableCell>
              <TableCell className="text-right text-sm">{entry.total_predictions}</TableCell>
              <TableCell className="text-right text-sm">{entry.resolved_predictions}</TableCell>
              <TableCell className="text-right">
                <span
                  className={`font-semibold text-sm ${
                    (entry.accuracy_score ?? 0) >= 70
                      ? 'text-green-600'
                      : (entry.accuracy_score ?? 0) >= 50
                        ? 'text-yellow-600'
                        : 'text-muted-foreground'
                  }`}
                >
                  {entry.accuracy_score !== null
                    ? `${entry.accuracy_score.toFixed(1)}점`
                    : '-'}
                </span>
              </TableCell>
              <TableCell className="text-right text-sm hidden sm:table-cell text-muted-foreground">
                {entry.average_brier_score !== null
                  ? entry.average_brier_score.toFixed(4)
                  : '-'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
