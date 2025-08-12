import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化OpenAI客户端
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { scenario } = await req.json();

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario is required' },
        { status: 400 }
      );
    }

    if (!scenario.system_prompt || !scenario.title || !scenario.domain) {
      console.error('Invalid scenario data:', scenario);
      return NextResponse.json(
        { error: 'Invalid scenario data' },
        { status: 400 }
      );
    }

    console.log('Generating initial message for scenario:', scenario.title);

    try {
      // 使用OpenAI SDK调用OpenRouter生成个性化的开场白
      const completion = await openai.chat.completions.create({
        model: "anthropic/claude-3.5-haiku",
        messages: [
          {
            role: 'system',
            content: `你现在要开始一个情商训练对话场景。

场景信息：
- 场景标题：${scenario.title}
- 场景背景：${scenario.scenario_context || scenario.title}

你的角色设定：
- 姓名：${scenario.character?.name || '未知'}
- 身份：${scenario.character?.role || '未知'}
- 性格：${scenario.character?.personality || '友好'}
- 背景：${scenario.character?.background || '无特殊背景'}
- 沟通难点：${scenario.character?.challenge || '无特殊挑战'}

开场指令：
1. 直接表达你的角色情绪、立场或问题
2. 不要在开头添加角色名称和冒号，直接说话
3. 不要问用户"可不可以"、"能否"、"愿意吗"等征求意见的话
4. 要展现角色的性格特点和挑战性
5. 创造一个需要用户运用情商技巧的情境
6. 语言要自然、真实，符合角色身份
7. 控制在50字以内
8. 用中文回复

示例开场（不要照抄）：
- 固执同事的开场白："我觉得我们的做法没问题，为什么要改？这样做了十年都很好。"
- 正确格式："我觉得我们的做法没问题，为什么要改？这样做了十年都很好。"
- 错误格式："李明：我觉得我们的做法没问题，为什么要改？"

现在请以你的角色身份，根据场景背景，直接表达角色的情绪和立场，记住不要加名字前缀。`
          },
          {
            role: 'user',
            content: '请开始对话。'
          }
        ],
        temperature: 0.7,
        max_tokens: 200, // Haiku更高效，适当增加token限制
      }, {
        headers: {
          "HTTP-Referer": "https://eqteacher.com",
          "X-Title": "EQteacher"
        }
      });

      const message = completion.choices?.[0]?.message?.content;

      if (!message) {
        console.error('No message in OpenRouter response:', completion);
        throw new Error('Invalid response from OpenRouter API');
      }

      console.log('Generated initial message:', message);
      return NextResponse.json({ message });
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw new Error('Failed to generate initial message');
    }
  } catch (error) {
    console.error('Error generating initial message:', error);
    return NextResponse.json(
      { error: 'Failed to generate initial message' },
      { status: 500 }
    );
  }
} 