/**
 * 스코어링 유틸리티
 * Brier Score 기반 예측 정확도 계산
 * - YES 확정: brier = (p - 1)^2, p는 0~1
 * - NO 확정: brier = (p - 0)^2
 * - score = round((1 - brier) * 100)
 */

/**
 * Brier Score 계산
 * @param probability - 예측 확률 (0~100)
 * @param resolution - 결과 ('yes' | 'no')
 * @returns Brier Score (0~1, 낮을수록 정확)
 */
export function calculateBrierScore(
  probability: number,
  resolution: 'yes' | 'no'
): number {
  const p = probability / 100 // 0~1로 변환
  const outcome = resolution === 'yes' ? 1 : 0
  return Math.pow(p - outcome, 2)
}

/**
 * 예측점수 계산 (0~100)
 * @param brierScore - Brier Score (0~1)
 * @returns 예측점수 (0~100, 높을수록 정확)
 */
export function calculateScore(brierScore: number): number {
  return Math.round((1 - brierScore) * 100)
}

/**
 * 집단 예측 확률 계산 (단순 평균)
 * @param probabilities - 예측 확률 배열 (0~100)
 * @returns 평균 확률 (0~100)
 */
export function calculateCommunityProbability(probabilities: number[]): number {
  if (probabilities.length === 0) return 50
  const sum = probabilities.reduce((acc, p) => acc + p, 0)
  return Math.round((sum / probabilities.length) * 10) / 10
}

/**
 * 가중 평균 집단 예측 확률 계산
 * (resolved_predictions 수에 비례한 가중치 적용 가능)
 * @param entries - { probability, weight } 배열
 * @returns 가중 평균 확률 (0~100)
 */
export function calculateWeightedCommunityProbability(
  entries: { probability: number; weight: number }[]
): number {
  if (entries.length === 0) return 50
  const totalWeight = entries.reduce((acc, e) => acc + e.weight, 0)
  if (totalWeight === 0) return 50
  const weightedSum = entries.reduce((acc, e) => acc + e.probability * e.weight, 0)
  return Math.round((weightedSum / totalWeight) * 10) / 10
}

/**
 * 평균 Brier Score에서 정확도 점수 계산
 * @param averageBrierScore - 평균 Brier Score
 * @returns 정확도 점수 (0~100)
 */
export function calculateAccuracyScore(averageBrierScore: number): number {
  return Math.round((1 - averageBrierScore) * 100 * 100) / 100
}
