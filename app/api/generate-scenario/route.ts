import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import OpenAI from 'openai';

// 检查环境变量
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
}

// 在请求生命周期内按用户 Cookie 创建 Supabase 客户端
async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// 初始化OpenAI客户端
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

// 辅助函数：从响应中提取JSON
function extractJSON(text: string): any {
  try {
    // 首先尝试直接解析
    return JSON.parse(text);
  } catch {
    // 如果直接解析失败，尝试提取markdown中的JSON
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // 尝试修复常见的JSON格式错误
        let fixedJson = jsonMatch[1];
        // 修复缺少逗号的问题
        fixedJson = fixedJson.replace(/"\s*\n\s*"/g, '",\n  "');
        // 修复字符串中的引号问题
        fixedJson = fixedJson.replace(/"\s*([^",:}\]]+)\s*"/g, '"$1"');
        return JSON.parse(fixedJson);
      }
    }
    
    // 尝试查找第一个 { 到最后一个 } 之间的内容
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      let jsonStr = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonStr);
      } catch {
        // 尝试修复常见的JSON格式错误
        // 修复缺少逗号的问题
        jsonStr = jsonStr.replace(/"\s*\n\s*"/g, '",\n  "');
        // 修复字符串末尾缺少逗号的问题
        jsonStr = jsonStr.replace(/(["}])\s*\n\s*"([^"]+)":/g, '$1,\n  "$2":');
        return JSON.parse(jsonStr);
      }
    }
    
    throw new Error('Unable to extract valid JSON from response');
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseClient();

    // 获取当前用户（可匿名）
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // 先解析请求参数，获取要生成的场景类型
    const { skill, difficulty: difficultyStr = 'beginner', domain = 'workplace' } = await req.json();

    // 收集相同域名(domain)下最近10条场景关键词（标题/objective 截取10字内）
    let bannedKeywords: string[] = [];
    if (userId) {
      const { data: recent, error: recentErr } = await supabase
        .from('sessions')
        .select('objective, scenarios_dynamic(title, domain)')
        .eq('user_id', userId)
        .eq('scenarios_dynamic.domain', domain)  // 只查询相同场景类型的历史记录
        .order('created_at', { ascending: false })
        .limit(10);

      if (!recentErr && recent) {
        const set = new Set<string>();
        for (const row of recent) {
          const kwRow: any = row as any;
          const kw = (kwRow.objective || kwRow.scenarios_dynamic?.title || '') as string;
          if (kw) set.add(kw.slice(0, 10));
        }
        bannedKeywords = Array.from(set);
      }
    }

    const forbidden = bannedKeywords.length ? bannedKeywords.join('、') : '（无）';
    
    console.log(`[去重机制] 域名: ${domain}, 找到 ${bannedKeywords.length} 条该域名下的历史关键词:`, bannedKeywords);
    
    // 将难度字符串转换为数字
    const difficultyMap: { [key: string]: number } = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    const difficulty = difficultyMap[difficultyStr] || 1;

    // 检查环境变量
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Using OpenRouter API Key:', process.env.OPENAI_API_KEY.substring(0, 10) + '...');

    // 风格提示映射
    const domainStyle: Record<string,string> = {
      workplace: '商务正式口吻',
      social: '轻松随意口吻，像朋友闲聊',
      networking: '礼貌而积极的商务社交语气',
      dating: '浪漫、亲密的语气，关注情感细节',
      family: '温暖关怀的家庭语气',
      travel: '轻松探索氛围'
    };

    const styleHint = domainStyle[domain] || '自然友好口吻';

    try {
      // 使用OpenAI SDK调用OpenRouter生成场景
      const completion = await openai.chat.completions.create({
        model: "anthropic/claude-3.5-haiku",
        messages: [
          {
            role: 'user',
            content: `请为${domain}领域生成一个全新的情商训练场景（难度等级：${difficulty}/3，重点技能：${skill || '综合沟通能力'}）。

已有场景关键词（禁止重复或高度相似，阈值30）：${forbidden}

返回格式必须是有效的JSON，结构如下：
{
  "title": "场景标题",
  "objective": "沟通目标",
  "character": {
    "name": "角色姓名",
    "role": "角色身份",
    "personality": "角色性格特点（要有挑战性）",
    "avatar": "🔥",
    "background": "角色背景",
    "challenge": "沟通难点"
  },
  "scenario_context": "场景背景描述（第二人称视角）",
  "system_prompt": "给AI的角色扮演指令",
  "rubric": [
    {"criteria": "评分标准1", "weight": 0.4},
    {"criteria": "评分标准2", "weight": 0.3},
    {"criteria": "评分标准3", "weight": 0.3}
  ]
}

要求：
- 标题、角色姓名、背景不得与禁止列表关键词重复或相似度 >30。
- 角色姓名不要使用"李明"或常见中文教科书姓名，可自拟。
- 对话整体写作风格：${styleHint}，避免使用企业管理或团队反馈术语。
- 角色要有挑战性（固执、敏感、生气、不耐烦等）
- 创造需要运用情商技巧的冲突情境
- **scenario_context必须用第二人称"你"开头，如"你和XXX是情侣关系，你们..."或"你是XXX的同事，今天..."，让用户有代入感**
- 所有内容用中文
- 只返回JSON，不要任何其他文字`
          }
        ],
        temperature: 0.7,
        max_tokens: 800, // Haiku更高效，适当减少token限制
        response_format: { type: "json_object" }
      }, {
        headers: {
          "HTTP-Referer": "https://eqteacher.com",
          "X-Title": "EQteacher"
        }
      });

      console.log('OpenRouter API Response received');

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from OpenRouter API');
      }

      const responseText = completion.choices[0].message.content;
      console.log('Raw response text:', responseText);
      
      // 因为使用了 response_format: { type: "json_object" }，应该直接是JSON
      const content = JSON.parse(responseText);
      console.log('Parsed Content:', content);

      // 创建场景记录
      const scenario = {
        id: `dyn_${nanoid()}`,
        title: content.title,
        domain,
        difficulty,
        objective: content.objective,
        character: content.character,
        scenario_context: content.scenario_context,
        system_prompt: content.system_prompt,
        rubric: content.rubric,
        play_count: 0,
        usefulness_average: 0
      };

      console.log('Attempting to insert scenario:', scenario);

      const { data: insertData, error: insertError } = await supabase
        .from('scenarios_dynamic')
        .insert(scenario)
        .select();

      if (insertError) {
        console.error('Supabase Insert Error:', insertError);
        throw new Error(`Failed to insert scenario: ${insertError.message}`);
      }

      console.log('Successfully inserted scenario:', insertData);

      // 返回完整的场景信息
      return NextResponse.json({ 
        scenarioId: scenario.id,
        ...scenario
      });
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw new Error(`OpenRouter API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error generating scenario:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate scenario' },
      { status: 500 }
    );
  }
} 