export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          bio: string | null
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          bio?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          bio?: string | null
          avatar_url?: string | null
          role?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          display_order: number
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          display_order?: number
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          display_order?: number
        }
      }
      questions: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          category_id: number | null
          status: string
          resolution: string | null
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
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          category_id?: number | null
          status?: string
          resolution?: string | null
          source_url?: string | null
          resolution_criteria?: string | null
          open_at?: string
          close_at: string
          resolve_by?: string | null
          created_by?: string | null
          is_featured?: boolean
          view_count?: number
          suggested_by?: string | null
        }
        Update: {
          title?: string
          slug?: string
          description?: string | null
          category_id?: number | null
          status?: string
          resolution?: string | null
          source_url?: string | null
          resolution_criteria?: string | null
          close_at?: string
          resolve_by?: string | null
          is_featured?: boolean
          view_count?: number
          updated_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          question_id: string
          user_id: string
          probability: number
          created_at: string
          updated_at: string
          is_final_before_close: boolean
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          probability: number
          is_final_before_close?: boolean
        }
        Update: {
          probability?: number
          updated_at?: string
          is_final_before_close?: boolean
        }
      }
      prediction_history: {
        Row: {
          id: string
          question_id: string
          user_id: string
          probability: number
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          probability: number
          created_at?: string
        }
        Update: Record<string, never>
      }
      comments: {
        Row: {
          id: string
          question_id: string
          user_id: string
          body: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          body: string
        }
        Update: {
          body?: string
          deleted_at?: string | null
          updated_at?: string
        }
      }
      scores: {
        Row: {
          id: string
          user_id: string
          question_id: string
          probability: number
          brier_score: number | null
          score: number | null
          resolved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          probability: number
          brier_score?: number | null
          score?: number | null
          resolved_at?: string
        }
        Update: {
          brier_score?: number | null
          score?: number | null
        }
      }
      user_stats: {
        Row: {
          user_id: string
          total_predictions: number
          resolved_predictions: number
          average_brier_score: number | null
          accuracy_score: number | null
          rank: number | null
          updated_at: string
        }
        Insert: {
          user_id: string
          total_predictions?: number
          resolved_predictions?: number
          average_brier_score?: number | null
          accuracy_score?: number | null
          rank?: number | null
        }
        Update: {
          total_predictions?: number
          resolved_predictions?: number
          average_brier_score?: number | null
          accuracy_score?: number | null
          rank?: number | null
          updated_at?: string
        }
      }
    }
  }
}
