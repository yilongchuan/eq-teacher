import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);
    
    // 获取分页参数
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = page * limit;

    // 创建带认证的Supabase客户端
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
    );

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 先获取总数
    const { count: totalCount, error: countError } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) throw countError;

    // 获取分页数据
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        id, scenario_id, messages, turn_count, status, created_at, overall_score, objective_achievement_rate, feedback, improvement_suggestions, user_id,
        scenarios_dynamic (
          title,
          domain,
          character
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    // 处理每个会话，过滤掉系统消息
    const filteredSessions = sessions?.map(session => {
      if (session.messages && Array.isArray(session.messages)) {
        return {
          ...session,
          messages: session.messages.filter(
            (msg: any) => msg.role === 'user' || msg.role === 'assistant'
          )
        };
      }
      return session;
    }) || [];

    const hasMore = (sessions?.length || 0) === limit && (offset + limit) < (totalCount || 0);

    return NextResponse.json({
      sessions: filteredSessions,
      total: totalCount || 0,
      page,
      limit,
      hasMore,
      loaded: filteredSessions.length
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
} 