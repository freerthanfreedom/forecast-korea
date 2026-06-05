import { Scale, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ExpertPanelProps {
  expertPro: string
  expertCon: string
  expertName?: string | null
  expertTitle?: string | null
}

export default function ExpertPanel({
  expertPro,
  expertCon,
  expertName,
  expertTitle,
}: ExpertPanelProps) {
  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Scale className="h-5 w-5 text-purple-600" />
          <span>⚖️ 전문가 판정</span>
          {expertName && (
            <span className="ml-auto text-xs font-normal text-muted-foreground bg-white border rounded-full px-2.5 py-0.5">
              {expertName}
              {expertTitle && ` · ${expertTitle}`}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 찬성측 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                YES 측
              </span>
            </div>
            <p className="text-sm text-green-900 leading-relaxed">{expertPro}</p>
          </div>
          {/* 반대측 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                NO 측
              </span>
            </div>
            <p className="text-sm text-red-900 leading-relaxed">{expertCon}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          전문가 의견은 참고용이며 투자·법률·의료 조언이 아닙니다.
        </p>
      </CardContent>
    </Card>
  )
}
