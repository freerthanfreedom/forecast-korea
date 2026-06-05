import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { calculateBrierScore, calculateScore } from '@/lib/scoring'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const supabase = await createClient()

    // 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    // 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'moderator'].includes(profile.role)) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    const body = await request.json()
    const { resolution } = body as { resolution: 'yes' | 'no' | 'void' }

    if (!['yes', 'no', 'void'].includes(resolution)) {
      return NextResponse.json({ error: '잘못된 결과 값입니다.' }, { status: 400 })
    }

    const serviceClient = await createServiceClient()

    // 질문 상태 업데이트
    const { error: updateError } = await serviceClient
      .from('questions')
      .update({
        status: 'resolved',
        resolution,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // void가 아닌 경우 점수 계산
    if (resolution !== 'void') {
      // 해당 질문의 모든 예측 가져오기
      const { data: predictions } = await serviceClient
        .from('predictions')
        .select('user_id, probability')
        .eq('question_id', id)

      if (predictions && predictions.length > 0) {
        const scoreInserts = predictions.map((pred) => {
          const brierScore = calculateBrierScore(pred.probability, resolution)
          const score = calculateScore(brierScore)
          return {
            user_id: pred.user_id,
            question_id: id,
            probability: pred.probability,
            brier_score: Math.round(brierScore * 10000) / 10000,
            score,
            resolved_at: new Date().toISOString(),
          }
        })

        await serviceClient
          .from('scores')
          .upsert(scoreInserts, { onConflict: 'user_id,question_id' })

        // user_stats 업데이트
        for (const pred of predictions) {
          const { data: existingStats } = await serviceClient
            .from('user_stats')
            .select('*')
            .eq('user_id', pred.user_id)
            .single()

          if (existingStats) {
            const newResolved = existingStats.resolved_predictions + 1
            const brierScore = calculateBrierScore(pred.probability, resolution)
            const newAvgBrier = existingStats.average_brier_score
              ? (existingStats.average_brier_score * existingStats.resolved_predictions +
                  brierScore) /
                newResolved
              : brierScore

            await serviceClient
              .from('user_stats')
              .update({
                resolved_predictions: newResolved,
                average_brier_score: Math.round(newAvgBrier * 10000) / 10000,
                accuracy_score: Math.round((1 - newAvgBrier) * 100 * 100) / 100,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', pred.user_id)
          }
        }

        // 랭킹 재계산
        const { data: allStats } = await serviceClient
          .from('user_stats')
          .select('user_id, accuracy_score')
          .not('accuracy_score', 'is', null)
          .order('accuracy_score', { ascending: false })

        if (allStats) {
          for (let i = 0; i < allStats.length; i++) {
            await serviceClient
              .from('user_stats')
              .update({ rank: i + 1 })
              .eq('user_id', allStats[i].user_id)
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resolve error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
