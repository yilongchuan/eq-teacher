import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // 不检测URL中的会话，降低刷新频率
        flowType: 'pkce', // 使用更安全的PKCE流程
      },
      global: {
        fetch: (url, init) => {
          // 添加超时设置，防止长时间挂起
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
          
          return fetch(url, {
            ...init,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        }
      }
    }
  )

  // 获取当前会话状态，带错误处理
  let session = null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (!error) {
      session = data.session;
    } else {
      console.error('Auth session error:', error.message);
    }
  } catch (err) {
    console.error('Failed to get auth session:', err);
    // 认证失败时，继续处理请求，但视为未登录状态
  }

  // 需要认证的路径
  const authRequiredPaths = [
    '/play',
    '/profile',
    '/settings',
    '/app'
  ]

  // 不需要认证的路径（即使已登录也可以访问）
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/callback',
    '/api/auth/callback',
    '/pricing',
    '/about',
    '/tos',
    '/privacy'
  ]

  // API路径额外检查，允许某些API不需要认证
  const publicApiPaths = [
    '/api/scenarios',
    '/api/generate-initial-message',
    '/api/chat',
    '/api/eval'  // 添加评分API到公开路径
  ]

  const url = new URL(request.url)
  const isAuthRequiredPath = authRequiredPaths.some(path => url.pathname.startsWith(path))
  const isPublicPath = publicPaths.some(path => url.pathname === path || url.pathname.startsWith(path))
  const isApiPath = url.pathname.startsWith('/api')
  const isPublicApiPath = publicApiPaths.some(path => url.pathname.startsWith(path))
  const isAuthPath = url.pathname.startsWith('/auth')

  // 对于API路径，如果是公开API则不需要认证检查
  if (isApiPath && isPublicApiPath) {
    return response;
  }

  // 需要认证但没有登录，重定向到登录页
  if (isAuthRequiredPath && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // 已登录但访问登录/注册页，重定向到首页
  if (session && isAuthPath && !url.pathname.includes('/callback')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

// 配置哪些路径需要应用中间件
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Also exclude all files with extensions (e.g. .css, .js, .svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
} 