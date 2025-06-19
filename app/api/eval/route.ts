import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import OpenAI from 'openai';
import { NextResponse } from 'next/server'

// 初始化OpenAI客户端，添加超时配置
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 增加到60秒超时
  defaultHeaders: {
    "HTTP-Referer": "https://eqteacher.com",
    "X-Title": "EQteacher"
  }
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
      return JSON.parse(jsonMatch[1]);
    }
    
    // 尝试查找第一个 { 到最后一个 } 之间的内容
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonStr = text.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonStr);
    }
    
    throw new Error('Unable to extract valid JSON from response');
  }
}

export async function POST(req: Request) {
  try {
    console.log('🔍 开始处理评估请求');
    const body = await req.json();
    const sessionId = body.sessionId;

    if (!sessionId) {
      console.error('❌ 缺少SessionID');
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log('🔄 评估会话:', sessionId, '类型:', typeof sessionId, '长度:', sessionId.length);
    console.log('🔧 环境信息 - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔧 环境信息 - OpenAI API Key长度:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : '未设置');
    
    // 去除sessionId可能的非法字符和空格
    const cleanSessionId = sessionId.trim();
    
    // 创建带认证的 Supabase 客户端，确保通过 RLS
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

    // 先检查会话是否存在
    const { data: sessionExists, error: existsError } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', cleanSessionId)
      .maybeSingle();
      
    console.log('🔄 会话存在检查结果:', sessionExists ? '存在' : '不存在', '错误:', existsError ? existsError.message : '无');
      
    if (existsError) {
      console.error('Error checking session existence:', existsError);
      return NextResponse.json(
        { error: 'Error checking session', details: existsError.message },
        { status: 500 }
      );
    }
    
    if (!sessionExists) {
      console.error('Session does not exist:', cleanSessionId);
      // 返回404状态但附带默认评估结果
      return NextResponse.json(
        { 
          error: 'Session not found', 
          details: 'No session with this ID exists',
          evaluation: {
            overall_score: 65,
            objective_achievement_rate: 60,
            feedback: "无法找到该会话记录，可能已被删除或ID无效。系统已生成默认评估结果。",
            improvement_suggestions: [
              "确保使用有效的会话ID",
              "尝试创建新的对话进行练习",
              "检查您的会话历史记录"
            ],
            strengths: ["完成评估请求"],
            areas_for_improvement: ["会话记录管理"]
          }
        },
        { status: 200 } // 改为200状态码，确保前端能正确处理结果
      );
    }
    
    // 分步查询，先获取会话基本信息
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', cleanSessionId)
      .maybeSingle();

    if (sessionError) {
      console.error('Session query error:', sessionError);
      return NextResponse.json(
        { error: 'Session not found', details: sessionError.message },
        { status: 404 }
      );
    }

    if (!session) {
      console.error('Session not found for ID:', cleanSessionId);
      // 返回200状态但附带默认评估结果
      return NextResponse.json(
        { 
          error: 'Session not found',
          evaluation: {
            overall_score: 65,
            objective_achievement_rate: 60,
            feedback: "无法找到该会话记录，可能已被删除或ID无效。系统已生成默认评估结果。",
            improvement_suggestions: [
              "确保使用有效的会话ID",
              "尝试创建新的对话进行练习",
              "检查您的会话历史记录"
            ],
            strengths: ["完成评估请求"],
            areas_for_improvement: ["会话记录管理"]
          }
        },
        { status: 200 } // 使用200状态码，确保前端能正确处理结果
      );
    }
    
    console.log('Session retrieved successfully:', session.id);
    
    // 然后获取关联的场景信息
    const { data: scenario, error: scenarioError } = await supabase
      .from('scenarios_dynamic')
      .select('objective, rubric, title, character')
      .eq('id', session.scenario_id)
      .maybeSingle();
      
    if (scenarioError) {
      console.error('Scenario query error:', scenarioError);
      // 不中断流程，尝试使用默认评估
    }
    
    const scenarioData = scenario || {
      objective: '情商对话练习',
      rubric: [
        { criterion: '倾听能力', weight: 25 },
        { criterion: '情绪认知', weight: 25 },
        { criterion: '沟通清晰度', weight: 25 },
        { criterion: '解决问题能力', weight: 25 }
      ],
      title: '情商对话',
      character: { name: 'AI助手', role: '对话伙伴', challenge: '测试用户的情商能力' }
    };
    
    // 构建评分prompt
    console.log('📝 构建评分Prompt');
    const evaluationPrompt = `你是一个专业的情商和沟通技巧评估师。请对以下对话进行评分和分析。

场景目标：${scenarioData.objective}
角色信息：${scenarioData.character?.name} - ${scenarioData.character?.role}
角色挑战：${scenarioData.character?.challenge}

对话记录：
${session.messages.filter((msg: any) => msg.role !== 'system').map((msg: any) => 
  `${msg.role === 'user' ? '用户' : scenarioData.character?.name}: ${msg.content}`
).join('\n')}

评分标准：
${scenarioData.rubric.map((item: any, index: number) => 
  `${index + 1}. ${item.criterion || item.criteria} (权重: ${item.weight})`
).join('\n')}

请返回JSON格式的评估结果：
{
  "objective_achievement_rate": 目标达成率(0-100),
  "overall_score": 总体评分(0-100),
  "detailed_scores": {
    "标准1": 分数(0-100),
    "标准2": 分数(0-100),
    ...
  },
  "feedback": "总体评价和表现分析",
  "improvement_suggestions": ["改进建议1", "改进建议2", "改进建议3"],
  "strengths": ["优点1", "优点2"],
  "areas_for_improvement": ["需要改进的地方1", "需要改进的地方2"]
}

评分要求：
1. 客观公正，基于用户的实际表现
2. 重点关注情商技巧的运用
3. 考虑沟通目标的达成情况
4. 提供具体、可行的改进建议
5. 用中文回复`;

    try {
      // 使用OpenAI SDK调用OpenRouter进行评估，添加超时控制
      console.log('🚀 开始调用OpenRouter API评估对话');
      const completionPromise = openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: 'user',
            content: `请评估以下对话的表现：

场景目标：${scenarioData.objective}
角色信息：${scenarioData.character?.name} - ${scenarioData.character?.role}
角色挑战：${scenarioData.character?.challenge}

对话记录：
${session.messages.filter((msg: any) => msg.role !== 'system').map((msg: any) => 
  `${msg.role === 'user' ? '用户' : scenarioData.character?.name}: ${msg.content}`
).join('\n')}

评分标准：
${scenarioData.rubric.map((item: any, index: number) => 
  `${index + 1}. ${item.criterion || item.criteria} (权重: ${item.weight})`
).join('\n')}

请返回JSON格式的评估结果：
{
  "objective_achievement_rate": 目标达成率(0-100),
  "overall_score": 总体评分(0-100),
  "detailed_scores": {
    "标准1": 分数(0-100),
    "标准2": 分数(0-100)
  },
  "feedback": "总体评价和表现分析",
  "improvement_suggestions": ["改进建议1", "改进建议2"],
  "strengths": ["优点1", "优点2"],
  "areas_for_improvement": ["需要改进的地方1", "需要改进的地方2"]
}

要求：客观公正评分，重点关注情商技巧运用，提供具体可行的改进建议。只返回JSON，不要其他文字。`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });
      
      // 添加30秒超时
      console.log('⏱️ 设置30秒超时');
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Evaluation request timed out')), 30000);
      });
      
      // 竞争Promise，哪个先完成就用哪个结果
      console.log('⏳ 等待评估结果...');
      const completion = await Promise.race([completionPromise, timeoutPromise]) as OpenAI.Chat.Completions.ChatCompletion;
      console.log('✅ API调用成功');

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        console.error('❌ 评估响应内容为空');
        throw new Error('No content in evaluation response');
      }

      console.log('📊 原始评估响应:', responseContent.substring(0, 100) + '...');
      // 因为使用了 response_format: { type: "json_object" }，应该直接是JSON
      let evaluationResult;
      try {
        evaluationResult = JSON.parse(responseContent);
        console.log('✅ JSON解析成功');
      } catch (parseError) {
        console.error('❌ JSON解析失败:', parseError);
        console.log('📄 完整响应内容:', responseContent);
        throw new Error('Failed to parse evaluation result as JSON');
      }

      // 更新会话记录，先尝试完整更新，如果字段不存在则回退到基本更新
      console.log('💾 准备更新数据库');
      let updateData: any = {
        status: 'completed'
      };

      // 如果有评分数据，尝试保存评分字段
      if (evaluationResult.overall_score) {
        updateData = {
          ...updateData,
          overall_score: evaluationResult.overall_score,
          objective_achievement_rate: evaluationResult.objective_achievement_rate,
          feedback: evaluationResult.feedback,
          improvement_suggestions: evaluationResult.improvement_suggestions,
          evaluated_at: new Date().toISOString()
        };
        
        // 如果有目标信息，也尝试保存
        if (scenarioData.objective) {
          updateData.objective = scenarioData.objective;
        }
        
        // 如果有详细分数，也尝试保存
        if (evaluationResult.detailed_scores) {
          updateData.detailed_scores = evaluationResult.detailed_scores;
        }
      }

      const { error: updateError } = await supabase
        .from('sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (updateError) {
        console.error('❌ 更新会话失败:', updateError);
        console.error('💾 尝试更新的数据:', JSON.stringify(updateData));
        
        // 记录错误但不中断流程，仍然返回评估结果给前端
        console.warn('⚠️ 无法保存评估结果到数据库，但将返回结果给客户端');
      } else {
        console.log('✅ 评估结果已成功保存到数据库');
      }

      console.log('🏁 评估完成，正在返回结果');

      return NextResponse.json({
        success: true,
        evaluation: evaluationResult
      });
    } catch (error) {
      console.error('❌ OpenRouter API错误:', error);
      
      // 生成默认评估结果
      const defaultEvaluation = {
        success: false,
        overall_score: 75,
        objective_achievement_rate: 70,
        detailed_scores: {
          "倾听能力": 75,
          "情绪认知": 70,
          "沟通清晰度": 80,
          "解决问题能力": 75
        },
        feedback: "由于评估系统暂时不可用，系统生成了默认评估。在你的对话中展现出了基本的情商能力，继续练习可以进一步提升你的沟通技巧。",
        improvement_suggestions: [
          "尝试更多倾听和理解对方需求",
          "注意识别情绪变化并做出回应",
          "使用开放性问题促进对话深入"
        ],
        strengths: ["基本沟通能力", "愿意参与对话"],
        areas_for_improvement: ["深入理解他人情绪", "提高共情表达"]
      };
      
      // 返回错误响应和默认评估
      return NextResponse.json({
        success: false,
        error: true,
        message: error instanceof Error ? error.message : 'Unknown error',
        evaluation: defaultEvaluation
      });
    }
  } catch (error: any) {
    console.error('❌ 评估会话总体错误:', error);
    // 确保即使在500错误状态下，仍然返回带有evaluation字段的响应
    const defaultEvaluation = {
      overall_score: 70,
      objective_achievement_rate: 65,
      feedback: "由于技术原因无法获取详细评估，但你已完成情商对话练习！",
      improvement_suggestions: ["继续练习不同情境下的沟通技巧", "关注对方情绪和需求"],
      strengths: ["完成对话", "参与练习"],
      areas_for_improvement: ["需要更多练习"]
    };
    
    return NextResponse.json(
      { 
        success: false,
        error: true, 
        message: error instanceof Error ? error.message : 'Failed to evaluate session',
        evaluation: defaultEvaluation
      },
      { status: 200 } // 改为200状态码，确保前端能正确处理结果
    );
  }
} 