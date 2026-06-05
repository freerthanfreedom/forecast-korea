import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { ko } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'yyyy년 MM월 dd일', { locale: ko })
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'MM/dd', { locale: ko })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko })
}

export function isExpired(date: string | Date): boolean {
  return isPast(new Date(date))
}

export function formatProbability(probability: number): string {
  return `${Math.round(probability)}%`
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getProbabilityColor(probability: number): string {
  if (probability >= 70) return 'text-green-600'
  if (probability >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

export function getProbabilityBgColor(probability: number): string {
  if (probability >= 70) return 'bg-green-100 text-green-800'
  if (probability >= 40) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
