import { cn } from '@/lib/utils'

interface ProbabilityBadgeProps {
  probability: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ProbabilityBadge({
  probability,
  size = 'md',
  className,
}: ProbabilityBadgeProps) {
  const rounded = Math.round(probability)

  const colorClass =
    rounded >= 70
      ? 'bg-green-100 text-green-800 border-green-200'
      : rounded >= 40
        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
        : 'bg-red-100 text-red-800 border-red-200'

  const sizeClass =
    size === 'sm'
      ? 'text-xs px-2 py-0.5'
      : size === 'lg'
        ? 'text-2xl px-4 py-2 font-bold'
        : 'text-sm px-2.5 py-1 font-semibold'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        colorClass,
        sizeClass,
        className
      )}
    >
      {rounded}%
    </span>
  )
}
