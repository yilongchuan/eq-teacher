'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  scenario_id: string;
  messages: Array<{ role: string; content: string }>;
  turn_count: number;
  status: string;
  created_at: string;
  overall_score?: number;
  objective_achievement_rate?: number;
  feedback?: string;
  improvement_suggestions?: string[];
  scenarios_dynamic?: {
    title: string;
    domain: string;
    character?: {
      name: string;
      avatar: string;
      role: string;
    };
  };
}

interface ChatHistoryProps {
  onSelect: (sessionId: string) => void;
}

export function ChatHistory({ onSelect }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isRequestingRef = useRef(false);  // 使用ref追踪请求状态
  const isAllLoadedRef = useRef(false);   // 新增：标记是否已加载全部数据

  const fetchSessions = async (reset = false) => {
    // 如果已经加载了所有数据，不再发起请求
    if (isAllLoadedRef.current && !reset) return;
    
    // 防止重复请求 - 使用ref而非state
    if (isRequestingRef.current) return;
    
    isRequestingRef.current = true;
    
    try {
      if (reset) {
        setIsLoading(true);
        setCurrentPage(0);
        setSessions([]);
        isAllLoadedRef.current = false; // 重置全部加载标志
      } else {
        setIsLoadingMore(true);
      }

      const page = reset ? 0 : currentPage;
      const pageSize = 10;
      
      const response = await fetch(`/api/sessions?page=${page}&limit=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      
      const data = await response.json();
      const newSessionsLength = data.sessions?.length || 0;
      
      if (reset) {
        setSessions(data.sessions || []);
      } else {
        setSessions(prev => [...prev, ...(data.sessions || [])]);
      }
      
      setTotalCount(data.total || 0);
      
      // 更准确的hasMore判断
      const currentTotal = reset ? newSessionsLength : sessions.length + newSessionsLength;
      const totalFromApi = data.total || 0;
      
      // 判断是否已加载全部数据
      const allLoaded = newSessionsLength < pageSize || currentTotal >= totalFromApi;
      setHasMore(!allLoaded);
      
      // 更新全部加载标志
      if (allLoaded) {
        isAllLoadedRef.current = true;
      }
      
      setCurrentPage(page + 1);
      
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('加载历史记录失败');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      isRequestingRef.current = false;  // 请求完成，重置状态
    }
  };

  const loadMoreSessions = useCallback(() => {
    // 如果已经加载了所有数据，不再触发加载
    if (isAllLoadedRef.current) return;
    
    // 检查是否还有更多数据可以加载
    if (!isRequestingRef.current && hasMore && !isLoading && !isLoadingMore && sessions.length < totalCount) {
      fetchSessions(false);
    }
  }, [hasMore, isLoading, isLoadingMore, sessions.length, totalCount]);

  // 无限滚动观察器
  const lastSessionElementRef = useCallback((node: HTMLDivElement) => {
    // 如果已经加载了所有数据，不再设置观察器
    if (isAllLoadedRef.current) return;
    
    if (!node || isLoadingMore || !hasMore || isLoading || sessions.length >= totalCount) return;
    
    // 清理之前的观察器
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // 再次检查是否已加载全部数据
        if (entry.isIntersecting && !isAllLoadedRef.current && hasMore && !isLoading && !isLoadingMore) {
          loadMoreSessions();
        }
      },
      { 
        threshold: 0.5,  // 降低阈值，减少触发频率
        rootMargin: '100px' // 增加边距
      }
    );
    
    observerRef.current.observe(node);
    
    // 返回清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoadingMore, hasMore, isLoading, loadMoreSessions, sessions.length, totalCount]);

  // 初始化加载
  useEffect(() => {
    fetchSessions(true);
  }, []);

  // 清理观察器和引用
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      // 重置所有ref状态
      isRequestingRef.current = false;
      isAllLoadedRef.current = false;
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '今天';
    if (diffDays === 2) return '昨天';
    if (diffDays <= 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'active':
        return '进行中';
      default:
        return '未知';
    }
  };

  const getFirstUserMessage = (messages: Array<{ role: string; content: string }>) => {
    // 先尝试找第一条用户消息
    const userMessage = messages.find(msg => msg.role === 'user');
    
    // 如果没有用户消息，返回第一条助手消息（通常是开场白）
    if (!userMessage) {
      const assistantMessage = messages.find(msg => msg.role === 'assistant');
      return assistantMessage ? `[AI开场] ${assistantMessage.content}` : '暂无消息';
    }
    
    return userMessage.content;
  };

  const getCharacterInfo = (session: Session) => {
    if (session.scenarios_dynamic?.character) {
      return {
        name: session.scenarios_dynamic.character.name,
        avatar: session.scenarios_dynamic.character.avatar,
        role: session.scenarios_dynamic.character.role
      };
    }
    
    // 默认值基于domain
    const domainMap: { [key: string]: { name: string; avatar: string; role: string } } = {
      'family': { name: '妈妈', avatar: '👩‍👧‍👦', role: '家庭成员' },
      'workplace': { name: '同事', avatar: '👨‍💼', role: '工作伙伴' },
      'friendship': { name: '朋友', avatar: '👥', role: '好朋友' },
      'romantic': { name: '恋人', avatar: '💕', role: '恋爱对象' },
      'social': { name: '新朋友', avatar: '🎉', role: '社交伙伴' }
    };
    
    const domain = session.scenarios_dynamic?.domain || 'general';
    return domainMap[domain] || { name: 'AI助手', avatar: '🤖', role: '对话伙伴' };
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        {/* 加载中的头部统计 */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        
        {/* 加载中的列表项 */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-center">{error}</p>
            <button
              onClick={() => fetchSessions(true)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessions.length === 0 && !isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-center text-gray-500">暂无对话记录</p>
            <p className="text-xs text-center text-gray-400 mt-1">开始你的第一次练习吧</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 头部统计信息 */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-medium text-gray-900">{totalCount}</span> 条记录
          </div>
          <div className="text-sm text-gray-500">
            已加载 <span className="font-medium text-gray-700">{sessions.length}</span> 条
          </div>
        </div>
      </div>

      {/* 滚动列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              ref={index === sessions.length - 1 ? lastSessionElementRef : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              onClick={() => onSelect(session.id)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                {/* 头像 */}
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">{getCharacterInfo(session).avatar}</span>
                </div>
                
                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {getCharacterInfo(session).name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(session.status))}>
                        {getStatusText(session.status)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(session.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {getFirstUserMessage(session.messages)}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>轮次: {session.turn_count}/3</span>
                    <div className="flex items-center space-x-2">
                      {session.overall_score && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          {session.overall_score}/100
                        </span>
                      )}
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{session.messages.length} 条消息</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 加载更多指示器 */}
        {isLoadingMore && (
          <div className="p-4 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm">加载中...</span>
            </div>
          </div>
        )}

        {/* 到底了的提示 */}
        {!hasMore && sessions.length > 0 && (
          <div className="p-4 text-center">
            <div className="text-xs text-gray-400 border-t border-gray-200 pt-4">
              已显示全部 {totalCount} 条记录
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 