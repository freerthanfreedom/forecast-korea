'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Category } from '@/types'

interface CategoryTabsProps {
  categories: Category[]
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    params.delete('page')
    router.push(`/questions?${params.toString()}`)
  }

  return (
    <div className="overflow-x-auto">
      <Tabs value={currentCategory} onValueChange={handleChange}>
        <TabsList className="flex w-max gap-1">
          <TabsTrigger value="all">전체</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat.slug} value={cat.slug}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
