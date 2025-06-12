'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ScenarioSelector } from '@/components/scenario/ScenarioSelector';
import { ChatHistory } from '@/components/history/ChatHistory';
import { cn } from '@/lib/utils';

interface PageProps {
  params: {
    scenarioId: string;
  };
}

export default function PlayPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const handleScenarioSelect = (scenarioId: string) => {
    // 重定向到新的场景页面
    window.location.href = `/app/play/${scenarioId}`;
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EQ</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">EQteacher</h1>
              </div>
              <div className="hidden md:block text-sm text-gray-500">
                情商对话训练平台
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                帮助
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="flex h-full">
            {/* 左侧边栏 - 类似微信聊天列表 */}
            <div className="w-80 border-r border-gray-200 bg-gray-50">
              {/* 侧边栏头部 */}
              <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4">
                <h2 className="font-semibold text-gray-800">对话练习</h2>
              </div>
              
              {/* Tab 切换 */}
              <div className="flex bg-white border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={cn(
                    "flex-1 py-3 text-center text-sm font-medium transition-colors",
                    activeTab === 'chat'
                      ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  )}
                >
                  开始练习
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    "flex-1 py-3 text-center text-sm font-medium transition-colors",
                    activeTab === 'history'
                      ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  )}
                >
                  历史记录
                </button>
              </div>

              {/* Tab 内容 */}
              <div className="h-[calc(100%-112px)] overflow-y-auto">
                {activeTab === 'chat' ? (
                  <ScenarioSelector onSelect={handleScenarioSelect} />
                ) : (
                  <ChatHistory onSelect={handleSessionSelect} />
                )}
              </div>
            </div>

            {/* 右侧聊天区域 - 类似微信聊天窗口 */}
            <div className="flex-1 flex flex-col bg-white min-h-0">
              {/* 聊天内容区域 */}
              <div className="flex-1 bg-gray-50 min-h-0">
                <ChatInterface
                  scenarioId={params.scenarioId}
                  sessionId={selectedSessionId}
                  onComplete={() => {
                    setActiveTab('history');
                    setSelectedSessionId(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 