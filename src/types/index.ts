export type UserRole = 'user' | 'moderator' | 'admin'
export type QuestionStatus = 'open' | 'closed' | 'resolved' | 'void'
export type Resolution = 'yes' | 'no' | 'void'

export interface Profile {
  id: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  display_order: number
}

export interface Question {
  id: string
  title: string
  slug: string
  description: string | null
  category_id: number | null
  status: QuestionStatus
  resolution: Resolution | null
  source_url: string | null
  resolution_criteria: string | null
  open_at: string
  close_at: string
  resolve_by: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  is_featured: boolean
  view_count: number
  suggested_by: string | null
  expert_pro: string | null
  expert_con: string | null
  expert_name: string | null
  expert_title: string | null
  // joined
  category?: Category
  profiles?: Profile
  community_probability?: number
  prediction_count?: number
}

export interface Prediction {
  id: string
  question_id: string
  user_id: string
  probability: number
  created_at: string
  updated_at: string
  is_final_before_close: boolean
  // joined
  profiles?: Profile
}

export interface PredictionHistory {
  id: string
  question_id: string
  user_id: string
  probability: number
  created_at: string
}

export interface Comment {
  id: string
  question_id: string
  user_id: string
  body: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  // joined
  profiles?: Profile
}

export interface Score {
  id: string
  user_id: string
  question_id: string
  probability: number
  brier_score: number | null
  score: number | null
  resolved_at: string
  // joined
  questions?: Question
}

export interface UserStats {
  user_id: string
  total_predictions: number
  resolved_predictions: number
  average_brier_score: number | null
  accuracy_score: number | null
  rank: number | null
  updated_at: string
  // joined
  profiles?: Profile
}

export interface LeaderboardEntry {
  user_id: string
  display_name: string
  avatar_url: string | null
  total_predictions: number
  resolved_predictions: number
  accuracy_score: number | null
  average_brier_score: number | null
  rank: number | null
}
