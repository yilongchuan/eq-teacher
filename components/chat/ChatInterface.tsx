'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isThinking?: boolean;
}

interface Scenario {
  id: string;
  title: string;
  domain: string;
  difficulty: number;
  character: {
    name: string;
    role: string;
    personality: string;
    avatar: string;
    background: string;
  };
  scenario_context: string;
  system_prompt: string;
  rubric: any[];
}

interface ChatInterfaceProps {
  scenarioId: string;
  sessionId?: string | null;
  onComplete?: () => void;
}

export function ChatInterface({ scenarioId, sessionId, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [maxTurns] = useState(3);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取场景信息并初始化对话（带 localStorage 去重）
  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      // 1. 若 props.sessionId 直接传入，优先使用
      if (sessionId) {
        await fetchSession(sessionId);
        return;
      }

      // 2. 检查本地是否缓存了未完成的 sessionId
      const storedId = typeof window !== 'undefined'
        ? localStorage.getItem(`session_${scenarioId}`)
        : null;

      if (storedId && storedId !== 'PENDING') {
        await fetchSession(storedId);
        return;
      }

      if (storedId === 'PENDING') {
        // 另一个挂载正在创建，会在完成后更新 localStorage；此处先等待用户刷新
        console.log('Session creation in progress, skipping duplicate initialization');
        return;
      }

      // 3. 创建全新会话（加 PENDING 标记防止并发重复创建）
      if (scenarioId) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(`session_${scenarioId}`, 'PENDING');
        }
        await initializeScenario();
      }
    };

    if (isActive) initialize();

    return () => { isActive = false; };
  }, [sessionId, scenarioId]);

  const fetchSession = async (sessionId: string) => {
    try {
      setIsInitializing(true);
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch session');
      const sessionData = await response.json();
      
      // 过滤掉可能的系统消息，确保只显示用户和助手的消息
      const filteredMessages = (sessionData.messages || []).filter(
        (msg: Message) => msg.role === 'user' || msg.role === 'assistant'
      );
      setMessages(filteredMessages);
      setCurrentTurn(sessionData.turn_count || 0);
      setCurrentSessionId(sessionId);
      
      // 如果会话已完成且有评分信息，设置评分
      if (sessionData.status === 'completed' && sessionData.overall_score) {
        setEvaluation({
          overall_score: sessionData.overall_score,
          objective_achievement_rate: sessionData.objective_achievement_rate,
          feedback: sessionData.feedback,
          improvement_suggestions: sessionData.improvement_suggestions
        });
      }
      
      // 尝试获取场景信息
      if (sessionData.scenario_id) {
        const scenarioResponse = await fetch(`/api/scenarios/${sessionData.scenario_id}`);
        if (scenarioResponse.ok) {
          const scenarioData = await scenarioResponse.json();
          setScenario(scenarioData);
        }
      }

      // 写入缓存，防止重复创建
      if (typeof window !== 'undefined') {
        localStorage.setItem(`session_${scenarioId}`, sessionId);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const initializeScenario = async () => {
    try {
      setIsInitializing(true);
      console.log('Initializing scenario with ID:', scenarioId);
      
      // 获取场景信息
      const response = await fetch(`/api/scenarios/${scenarioId}`);
      if (!response.ok) {
        console.error('Failed to fetch scenario, status:', response.status);
        throw new Error('Failed to fetch scenario');
      }
      
      const scenarioData = await response.json();
      console.log('Fetched scenario data:', scenarioData);
      
      if (!scenarioData || !scenarioData.system_prompt) {
        console.error('Invalid scenario data:', scenarioData);
        throw new Error('Invalid scenario data');
      }
      
      // 如果数据库中没有角色信息，使用默认值
      if (!scenarioData.character) {
        scenarioData.character = {
          name: getDefaultCharacterName(scenarioData.domain),
          role: getDefaultCharacterRole(scenarioData.domain),
          personality: '友好',
          avatar: getDefaultCharacterAvatar(scenarioData.domain),
          background: ''
        };
      }
      
      if (!scenarioData.scenario_context) {
        scenarioData.scenario_context = scenarioData.title;
      }
      
      setScenario(scenarioData);

      // AI主动发起对话并创建会话
      const initialMessage = await generateInitialMessage(scenarioData);
      console.log('Generated initial message:', initialMessage);
      
      // 创建会话
      console.log('🚀 创建新会话: scenarioId =', scenarioId);
      const sessionResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId,
          message: '开始对话', // 使用一个占位符消息
          isInitializing: true, // 标记这是初始化调用
          initialMessage: initialMessage // 传递生成的初始消息
        }),
      });

      if (!sessionResponse.ok) {
        console.error('❌ 创建会话失败:', await sessionResponse.text());
        throw new Error('Failed to create session');
      }

      const sessionData = await sessionResponse.json();
      if (!sessionData.sessionId) {
        console.error('❌ 会话创建响应中缺少sessionId:', sessionData);
        throw new Error('Invalid session data - missing sessionId');
      }
      
      console.log('✅ 会话创建成功, ID:', sessionData.sessionId);
      setCurrentSessionId(sessionData.sessionId);
      
      // 设置消息：AI的开场白 (确保只有助手消息，没有系统消息)
      setMessages([{ role: 'assistant', content: initialMessage }]);
      
      // 确保消息已经正确设置
      console.log('Initial message set:', initialMessage);
      // AI的开场白不算轮次，从0开始
      setCurrentTurn(0);

      // 写入缓存，防止重复创建
      if (typeof window !== 'undefined') {
        localStorage.setItem(`session_${scenarioId}`, sessionData.sessionId);
      }
    } catch (error) {
      console.error('Error initializing scenario:', error);
      // 如果初始化失败，使用默认消息
      if (scenarioId) {
        const defaultScenario = {
          id: scenarioId,
          title: '情商对话练习',
          domain: 'general',
          difficulty: 1,
          character: {
            name: 'AI助手',
            role: '对话伙伴',
            personality: '友好',
            avatar: '🤖',
            background: ''
          },
          scenario_context: '这是一个情商对话练习场景',
          system_prompt: '你是一个情商对话练习的AI助手。',
          rubric: []
        };
        setScenario(defaultScenario);
        setMessages([{ role: 'assistant', content: '你好！欢迎来到情商对话练习。让我们开始吧！' }]);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const getDefaultCharacterName = (domain: string) => {
    const nameMap: { [key: string]: string } = {
      'family': '妈妈',
      'workplace': '同事',
      'friendship': '朋友',
      'romantic': '恋人',
      'social': '新朋友'
    };
    return nameMap[domain] || 'AI助手';
  };

  const getDefaultCharacterRole = (domain: string) => {
    const roleMap: { [key: string]: string } = {
      'family': '家庭成员',
      'workplace': '工作伙伴',
      'friendship': '好朋友',
      'romantic': '恋爱对象',
      'social': '社交伙伴'
    };
    return roleMap[domain] || '对话伙伴';
  };

  const getDefaultCharacterAvatar = (domain: string) => {
    const avatarMap: { [key: string]: string } = {
      'family': '👩‍👧‍👦',
      'workplace': '👨‍💼',
      'friendship': '👥',
      'romantic': '💕',
      'social': '🎉'
    };
    return avatarMap[domain] || '🤖';
  };

  // 移除可能存在的名字前缀（例如 "李明："）
  const removeNamePrefix = (message: string, characterName?: string) => {
    // 如果有明确的角色名
    if (characterName) {
      const prefixPattern = new RegExp(`^${characterName}[：:][""]?\\s*`);
      return message.replace(prefixPattern, '');
    }
    
    // 通用的名字前缀模式（任何名字后跟冒号或引号）
    return message.replace(/^[^：:："]*[：:："]\s*/g, '');
  };

  const generateInitialMessage = async (scenarioData: Scenario) => {
    try {
      const response = await fetch('/api/generate-initial-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioData }),
      });
      if (!response.ok) throw new Error('Failed to generate initial message');
      const data = await response.json();
      
      // 移除可能的名字前缀
      const cleanedMessage = removeNamePrefix(data.message, scenarioData.character?.name);
      console.log('Cleaned initial message:', cleanedMessage);
      return cleanedMessage;
    } catch (error) {
      console.error('Error generating initial message:', error);
      // 回退到默认消息
      return getDefaultInitialMessage(scenarioData);
    }
  };

  const getDefaultInitialMessage = (scenarioData: Scenario) => {
    // 根据场景类型生成默认的开场白
    switch (scenarioData.domain) {
      case 'family':
        return "大家好！今天的晚餐真丰盛呢。我想我们可以聊聊最近都在忙什么，分享一下彼此的生活。妈妈，您今天工作怎么样？";
      case 'workplace':
        return "你好！很高兴见到你。我想我们可以开始今天的讨论了。关于这个项目，你有什么想法吗？";
      case 'friendship':
        return "嗨！好久不见了！最近过得怎么样？我们找个地方坐下来好好聊聊吧。";
      case 'romantic':
        return "你好，很高兴能和你在这里见面。这个地方真不错，你觉得呢？";
      case 'social':
        return "你好！我注意到你也在这里，介意我过来和你聊聊吗？";
      default:
        return "你好！很高兴认识你。我们开始对话吧！";
    }
  };

  const getDomainName = (domain: string) => {
    const domainMap: { [key: string]: string } = {
      'workplace': '职场沟通',
      'family': '家庭关系',
      'friendship': '朋友交往',
      'romantic': '恋爱关系',
      'social': '社交场合'
    };
    return domainMap[domain] || '情商训练';
  };

  const getDifficultyName = (difficulty: number) => {
    const difficultyMap: { [key: number]: string } = {
      1: '初级',
      2: '中级',
      3: '高级'
    };
    return difficultyMap[difficulty] || '未知';
  };

  const getCharacterInfo = (scenario: Scenario | null) => {
    if (!scenario || !scenario.character) {
      return {
        name: 'AI助手',
        role: '对话伙伴',
        avatar: '🤖'
      };
    }
    return scenario.character;
  };

  // 带重试功能的API调用
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 2, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (retries <= 0) throw error;
      console.log(`请求失败，${delay}ms后重试，剩余重试次数: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
  };

  const evaluateSession = async (sessionId: string) => {
    // 重新开始评估前，清空错误
    setEvaluationError(null);
    try {
      console.log('🔄 开始评估会话:', sessionId);
      setIsEvaluating(true);
      
      // 检查sessionId是否有效
      if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
        console.error('❌ 会话ID无效:', sessionId);
        setEvaluation(null);
        setEvaluationError('会话ID无效，无法进行评分');
        return;
      }
      
      // 确保sessionId是干净的
      const cleanSessionId = sessionId.trim();
      
      // 使用带重试功能的fetch
      console.log('🚀 发送评估请求...会话ID:', cleanSessionId);
      const response = await fetchWithRetry('/api/eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: cleanSessionId }),
      }, 2, 1500); // 2次重试，初始延迟1.5秒
      
      console.log('📥 收到API响应, 状态:', response.status);
      
      // 如果是404错误，说明会话不存在
      if (response.status === 404) {
        console.error('❌ 会话不存在:', sessionId);
        setEvaluation(null);
        setEvaluationError('未找到会话记录，无法评分');
        return;
      }
      
      // 安全解析响应数据
      let data = {};
      try {
        data = await response.json();
        console.log('📦 API响应数据:', data);
      } catch (parseError) {
        console.error('❌ JSON解析错误:', parseError);
        setEvaluation(null);
        setEvaluationError('评分数据格式异常，稍后重试');
        return;
      }
      
      if (!response.ok) {
        console.error('❌ 评估错误响应:', data);
        setEvaluation(null);
        setEvaluationError('评分接口返回错误，请稍后重试');
        return;
      }
      
      // 检查数据格式，确保有evaluation字段
      if (!data || typeof data !== 'object' || !('evaluation' in data) || !data.evaluation) {
        console.error('❌ 无效的评估数据格式:', data);
        setEvaluation(null);
        setEvaluationError('评分数据格式异常，稍后重试');
        return;
      }
      
      // 正常情况，设置API返回的评估结果
      console.log('✅ 成功获取评估结果');
      setEvaluation(data.evaluation);
      setEvaluationError(null);

      // 评分成功后可视为会话结束，清理缓存，防止再次进入相同 session
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`session_${scenarioId}`);
      }
    } catch (error) {
      console.error('❌ 评估过程出错:', error);
      setEvaluation(null);
      setEvaluationError('评分过程中出现异常，请稍后再试');
    } finally {
      console.log('🏁 评估过程结束');
      setIsEvaluating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // 确保有sessionId，如果没有则不能发送消息
    if (!currentSessionId) {
      console.error('No session ID available');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // 添加用户消息到界面
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    // 添加AI思考中的占位消息
    const thinkingMessage = { role: 'assistant' as const, content: '思考中...', isThinking: true };
    setMessages([...newMessages, thinkingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId,
          message: userMessage,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      // 替换思考中消息为真实AI回复
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      
      // 确保所有消息都被正确过滤，防止系统消息显示
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.role === 'user' || msg.role === 'assistant')
      );
      
      // 更新轮次
      const newTurn = currentTurn + 1;
      setCurrentTurn(newTurn);
      
          // 检查是否达到最大轮次
    if (newTurn >= maxTurns) {
      // 开始评估，设置更长的延迟，确保数据已经完全保存
      setTimeout(() => {
        // 调试：记录当前会话ID
        console.log('🔍 准备评估会话ID:', currentSessionId, '类型:', typeof currentSessionId);
        
        // 检查会话ID是否有效
        if (!currentSessionId) {
          console.error('❌ 无效的会话ID，无法评估');
          setEvaluation({
            overall_score: 70,
            objective_achievement_rate: 65,
            feedback: "由于会话ID无效，无法进行详细评估。但您已完成对话练习！",
            improvement_suggestions: [
              "尝试开始一个新的对话练习", 
              "确保会话完整进行"
            ]
          });
          return;
        }
        
        evaluateSession(currentSessionId);
      }, 1500);
      
      // 设置30秒后的兜底评估结果，以防评估API长时间未响应
      setTimeout(() => {
        if (isEvaluating) {
          console.log('评估超时，显示默认结果');
          setIsEvaluating(false);
          setEvaluation({
            overall_score: 65,
            objective_achievement_rate: 60,
            feedback: "您已完成对话练习！在这次练习中，您展现了基本的沟通技巧。继续练习可以进一步提升您的情商表现。",
            improvement_suggestions: [
              "尝试更多地站在对方角度思考问题",
              "使用开放性问题鼓励对方表达想法",
              "注意倾听并表达理解对方的情感需求"
            ]
          });
        }
      }, 30000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // 移除思考中消息和用户消息，因为发送失败
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  // 滚动控制 - 处理滚动到底部和初始加载滚动位置
  useEffect(() => {
    // 自动滚动到底部
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, evaluation, isEvaluating]);
  
  // 改进的滚动控制逻辑
  useEffect(() => {
    // 在以下情况触发滚动到顶部：初始加载完成、切换到历史记录、评估完成
    if (
      (!isInitializing && messages.length > 0) || 
      evaluation || 
      (currentTurn >= maxTurns && !isEvaluating)
    ) {
      const container = document.getElementById('chat-messages-container');
      if (container) {
        // 多次尝试滚动，确保在各种情况下都能正确滚动
        const scrollToTop = () => {
          container.scrollTop = 0;
          console.log("尝试滚动到顶部");
        };
        
        // 立即滚动一次
        scrollToTop();
        
        // 然后在短时间内多次尝试滚动，确保DOM完全渲染后能滚动成功
        setTimeout(scrollToTop, 100);
        setTimeout(scrollToTop, 500);
        setTimeout(scrollToTop, 1000);
      }
    }
  }, [isInitializing, evaluation, currentTurn, maxTurns, isEvaluating, messages.length]);

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* 场景信息区域 */}
      {scenario && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getCharacterInfo(scenario).avatar}</div>
              <div>
                <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {getDomainName(scenario.domain)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {getDifficultyName(scenario.difficulty)}
                  </span>
                  <span className="text-gray-500">
                    角色：{getCharacterInfo(scenario).name} ({getCharacterInfo(scenario).role})
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                第 {Math.min(currentTurn, maxTurns)} / {maxTurns} 轮
              </div>
              <div className="text-xs text-gray-500">
                情商训练对话
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 聊天消息区域 - 包含所有内容的统一滚动区域 */}
      <div 
        className="flex-1 p-4 space-y-4 overflow-y-auto overflow-x-hidden"
        style={{ 
          minHeight: 0,
          maxHeight: 'calc(100vh - 130px)',
          overflowY: 'auto',
          overscrollBehavior: 'contain', // 防止滚动溢出
          scrollBehavior: 'smooth',      // 平滑滚动
          WebkitOverflowScrolling: 'touch' // 改善移动端滚动体验
        }}
        id="chat-messages-container"
      >
        {/* 场景背景说明 */}
        {scenario && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📋</div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">场景背景</h4>
                <p className="text-sm text-blue-800 mb-3">
                  {scenario.scenario_context || `这是一个${getDomainName(scenario.domain)}的情商训练场景。您将与${getCharacterInfo(scenario).name}进行对话，练习您的沟通技巧。`}
                </p>
                <div className="text-xs text-blue-600">
                  💡 提示：运用情商技巧，注意对方的情绪和需求，找到最佳的沟通方式。
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isInitializing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{sessionId ? "正在加载对话历史..." : "正在准备情商训练场景..."}</p>
          </div>
        ) : (
          <>
            {/* 聊天消息 - 过滤掉系统消息 */}
            {messages
              .filter(message => message.role !== 'system')
              .map((message, index) => (
                <MessageBubble 
                  key={index} 
                  message={message} 
                  isUser={message.role === 'user'} 
                  scenario={scenario}
                />
              ))}
            
            {/* 评估中状态 */}
            {isEvaluating && (
              <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200 mt-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <div className="text-lg font-medium text-blue-600 mb-2">
                  正在评估您的表现...
                </div>
                <div className="text-sm text-gray-600">
                  AI正在分析您的沟通技巧和情商表现
                </div>
              </div>
            )}

            {/* 训练完成等待评分状态 */}
            {currentTurn >= maxTurns && !evaluation && !isEvaluating && (
              <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200 mt-6">
                <div className="text-2xl mb-3">✅</div>
                <div className="text-lg font-medium text-green-600 mb-2">
                  🎉 情商训练完成！
                </div>
                <div className="text-sm text-gray-600">
                  您已完成 {maxTurns} 轮对话训练，系统正在为您生成评分和建议...
                </div>
              </div>
            )}
            
            {/* 评分结果 */}
            {evaluation && (
              <div className="space-y-4 mt-6" id="evaluation-result">
                {/* 滚动指示器 */}
                <div className="text-center mb-3">
                  <button 
                    onClick={() => {
                      const container = document.getElementById('chat-messages-container');
                      if (container) container.scrollTop = 0;
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    查看场景背景
                  </button>
                </div>
                <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl mb-3">🎉</div>
                  <div className="text-xl font-medium text-green-600 mb-3">
                    情商训练完成！
                  </div>
                  <div className="text-4xl font-bold text-green-700 mb-3">
                    {evaluation.overall_score}/100
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    综合情商评分
                  </div>
                  {evaluation.objective_achievement_rate !== undefined && evaluation.objective_achievement_rate !== evaluation.overall_score && (
                    <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                      沟通目标达成率: {evaluation.objective_achievement_rate}%
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3 text-lg">💡 反馈评价</h4>
                  <p className="text-sm text-blue-800 mb-4 leading-relaxed">{evaluation.feedback}</p>
                  
                  {evaluation.improvement_suggestions && evaluation.improvement_suggestions.length > 0 && (
                    <div className="mt-5">
                      <h5 className="font-medium text-blue-900 mb-4 text-lg">🎯 改进建议</h5>
                      <div className="text-sm text-blue-800 space-y-4">
                        {evaluation.improvement_suggestions.map((suggestion: string, index: number) => (
                          <div key={index} className="flex items-start leading-relaxed">
                            <span className="mr-3 mt-2 flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span className="flex-1">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    再次训练
                  </button>
                  <button
                    onClick={() => onComplete && onComplete()}
                    className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    查看历史
                  </button>
                </div>
              </div>
            )}

            {/* 评分错误区域 */}
            {!evaluation && evaluationError && (
              <div className="space-y-4 mt-6" id="evaluation-error">
                <div className="bg-red-50 rounded-lg p-6 border border-red-200 text-center">
                  <div className="text-2xl mb-3">❌</div>
                  <div className="text-lg font-medium text-red-600 mb-2">评分失败</div>
                  <div className="text-sm text-red-600 mb-4">{evaluationError}</div>
                  <button
                    disabled={isEvaluating}
                    onClick={() => currentSessionId && evaluateSession(currentSessionId)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isEvaluating ? '重新评分中...' : '重新尝试评分'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
        {/* 底部安全间距 - 确保内容不被遮挡，特别是评价反馈区域 */}
        <div className="h-12"></div>
      </div>

      {/* 输入区域 - 仅用于输入 */}
      {!evaluation && !isEvaluating && currentTurn < maxTurns && (
        <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-white">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? `${getCharacterInfo(scenario).name}正在思考...` : "输入您的回复..."}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '发送中...' : '发送'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  scenario: Scenario | null;
}

function MessageBubble({ message, isUser, scenario }: MessageBubbleProps) {
  const getCharacterInfo = () => {
    if (!scenario || !scenario.character) {
      return {
        name: 'AI助手',
        avatar: '🤖'
      };
    }
    return {
      name: scenario.character.name,
      avatar: scenario.character.avatar
    };
  };
  
  // 处理可能带有名字前缀的消息内容
  const processMessageContent = (content: string, characterName: string) => {
    // 检查是否以角色名开头
    const namePattern = new RegExp(`^${characterName}[：:][""]?\\s*`);
    return content.replace(namePattern, '');
  };

  const characterInfo = getCharacterInfo();
  // 如果是助手消息，处理可能的名字前缀
  const processedContent = !isUser ? 
    processMessageContent(message.content, characterInfo.name) : 
    message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start space-x-2",
        isUser ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-lg",
            isUser 
              ? "bg-gradient-to-r from-blue-500 to-purple-600" 
              : "bg-white border-2 border-gray-200"
          )}
        >
          {isUser ? (
            <span className="text-white text-xs font-medium">我</span>
          ) : (
            <span>{characterInfo.avatar}</span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {isUser ? "我" : characterInfo.name}
        </div>
      </div>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          isUser
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-white text-gray-800 rounded-tl-none shadow"
        )}
      >
        {message.isThinking ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-600">{characterInfo.name}思考中...</span>
          </div>
        ) : (
          <p className="text-sm">{processedContent}</p>
        )}
      </div>
    </motion.div>
  );
}