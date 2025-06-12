import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 创建服务器端Supabase客户端
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// 创建常规Supabase客户端（不用于认证流程）
export const supabase = createClient(supabaseUrl, supabaseKey)

// 类型定义
export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          scenario_id: string
          messages: any[]
          turn_count: number
          status: string
          created_at: string
          updated_at: string
          user_id: string | null
          overall_score: number | null
          objective_achievement_rate: number | null
          feedback: string[] | null
          improvement_suggestions: string[] | null
        }
        Insert: {
          id: string
          scenario_id: string
          messages: any[]
          turn_count: number
          status: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          overall_score?: number | null
          objective_achievement_rate?: number | null
          feedback?: string[] | null
          improvement_suggestions?: string[] | null
        }
        Update: {
          id?: string
          scenario_id?: string
          messages?: any[]
          turn_count?: number
          status?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          overall_score?: number | null
          objective_achievement_rate?: number | null
          feedback?: string[] | null
          improvement_suggestions?: string[] | null
        }
      }
      scenarios_dynamic: {
        Row: {
          id: string
          title: string
          domain: string
          difficulty: number
          system_prompt: string
          rubric: any[]
          created_at: string
          updated_at: string
          character: any | null
          scenario_context: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 