import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'

export async function POST(request: Request) {
  const { email, password, provider } = await request.json()
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  try {
    // 根据提供的登录方式处理登录
    if (provider) {
      // OAuth登录 (Google, GitHub)
      const redirectUrl = new URL('/api/auth/callback', request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
      
      let { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google' | 'github',
        options: {
          redirectTo: redirectUrl.toString(),
        },
      })

      if (error) throw error

      return NextResponse.json({ url: data.url })
    } else if (email && password) {
      // 邮箱密码登录
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '无效的登录信息' }, { status: 400 })
    }
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
} 