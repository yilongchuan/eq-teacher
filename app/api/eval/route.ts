import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 创建Supabase客户端，添加重试和超时选项
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // API请求不需要持久化会话
      autoRefreshToken: false, 
    },
    global: {
      fetch: (...args) => fetch(...args),
      headers: {
        'X-API-Request': 'true',
      },
    },
    db: {
      schema: 'public',
    },
  }
);

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
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // 获取会话和场景信息
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        *,
        scenarios_dynamic (
          objective,
          rubric,
          title,
          character
        )
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const scenario = session.scenarios_dynamic;
    
    // 构建评分prompt
    const evaluationPrompt = `你是一个专业的情商和沟通技巧评估师。请对以下对话进行评分和分析。

场景目标：${scenario.objective}
角色信息：${scenario.character?.name} - ${scenario.character?.role}
角色挑战：${scenario.character?.challenge}

对话记录：
${session.messages.filter((msg: any) => msg.role !== 'system').map((msg: any) => 
  `${msg.role === 'user' ? '用户' : scenario.character?.name}: ${msg.content}`
).join('\n')}

评分标准：
${scenario.rubric.map((item: any, index: number) => 
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
      const completionPromise = openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: 'user',
            content: `请评估以下对话的表现：

场景目标：${scenario.objective}
角色信息：${scenario.character?.name} - ${scenario.character?.role}
角色挑战：${scenario.character?.challenge}

对话记录：
${session.messages.filter((msg: any) => msg.role !== 'system').map((msg: any) => 
  `${msg.role === 'user' ? '用户' : scenario.character?.name}: ${msg.content}`
).join('\n')}

评分标准：
${scenario.rubric.map((item: any, index: number) => 
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
      }, {
        headers: {
          "HTTP-Referer": "https://eqteacher.com",
          "X-Title": "EQteacher"
        }
      });
      
      // 添加15秒超时
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Evaluation request timed out')), 15000);
      });
      
      // 竞争Promise，哪个先完成就用哪个结果
      const completion = await Promise.race([completionPromise, timeoutPromise]) as OpenAI.Chat.Completions.ChatCompletion;

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        throw new Error('No content in evaluation response');
      }

      console.log('Raw evaluation response:', responseContent);
      // 因为使用了 response_format: { type: "json_object" }，应该直接是JSON
      const evaluationResult = JSON.parse(responseContent);

      // 更新会话记录，先尝试完整更新，如果字段不存在则回退到基本更新
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
        if (scenario.objective) {
          updateData.objective = scenario.objective;
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
        console.error('Failed to update session:', updateError);
        console.error('Update data:', {
          objective: scenario.objective,
          objective_achievement_rate: evaluationResult.objective_achievement_rate,
          overall_score: evaluationResult.overall_score,
          detailed_scores: evaluationResult.detailed_scores,
          feedback: evaluationResult.feedback,
          improvement_suggestions: evaluationResult.improvement_suggestions
        });
        
        // 记录错误但不中断流程，仍然返回评估结果给前端
        console.warn('Could not save evaluation to database, but will return results to client');
      }

      console.log('Evaluation updated successfully for session:', sessionId);

      return NextResponse.json({
        success: true,
        evaluation: evaluationResult
      });
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      
      // 返回错误响应而不是抛出异常，让前端能够正确处理
      return NextResponse.json({
        success: false,
        error: 'Failed to evaluate session',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error evaluating session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to evaluate session' },
      { status: 500 }
    );
  }
} 