'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ScenarioSelector } from '@/components/scenario/ScenarioSelector';
import { ChatHistory } from '@/components/history/ChatHistory';
import { cn } from '@/lib/utils';

function GenerationProgress({ step }: { step: number }) {
  const steps = [
    '正在分析场景需求...',
    '正在生成角色设定...',
    '正在构建对话情境...',
    '正在优化训练内容...',
    '正在完善评分标准...'
  ];

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="text-center max-w-md">
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
        <div className="absolute inset-0 rounded-full border-4 border-white animate-pulse"></div>
        <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">正在生成专属场景</h2>
      
      <div className="mb-6">
        <div className="text-lg font-medium text-blue-600 mb-2">{steps[step]}</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-500 mt-2">{Math.round(progress)}% 完成</div>
      </div>
      
      <p className="text-gray-600 text-sm">
        AI正在为您精心设计个性化的情商训练场景，请稍候...
      </p>
    </div>
  );
}

export default function PlayPage() {
  const [activeTab, setActiveTab] = useState<'select' | 'history'>('select');
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const handleScenarioSelect = (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
    setShowChat(true);
    setSelectedSessionId(null);
    setIsGenerating(false);
    setGenerationStep(0);
  };

  const handleGeneratingChange = (generating: boolean) => {
    setIsGenerating(generating);
  };

  const handleStepChange = (step: number) => {
    setGenerationStep(step);
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowChat(true);
    setActiveTab('select');
  };

  const handleBackToSelection = () => {
    setShowChat(false);
    setCurrentScenarioId(null);
    setSelectedSessionId(null);
  };

  const handleChatComplete = () => {
    setActiveTab('history');
    setShowChat(false);
    setCurrentScenarioId(null);
    setSelectedSessionId(null);
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
        {!showChat ? (
          /* 场景选择界面 */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
            <div className="flex h-full">
              {/* 左侧边栏 */}
              <div className="w-80 border-r border-gray-200 bg-gray-50">
                {/* 侧边栏头部 */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4">
                  <h2 className="font-semibold text-gray-800">练习中心</h2>
                </div>
                
                {/* Tab 切换 */}
                <div className="flex bg-white border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('select')}
                    className={cn(
                      "flex-1 py-3 text-center text-sm font-medium transition-colors",
                      activeTab === 'select'
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
                  {activeTab === 'select' ? (
                    <ScenarioSelector 
                      onSelect={handleScenarioSelect}
                      onGeneratingChange={handleGeneratingChange}
                      onStepChange={handleStepChange}
                    />
                  ) : (
                    <ChatHistory onSelect={handleSessionSelect} />
                  )}
                </div>
              </div>

              {/* 右侧欢迎区域 */}
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                {isGenerating ? (
                  <GenerationProgress step={generationStep} />
                ) : (
                  <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">欢迎来到 EQteacher</h2>
                    <p className="text-gray-600 mb-6">
                      选择一个练习场景，提升您的情商沟通技巧。我们的AI导师将为您提供个性化的对话练习和专业反馈。
                    </p>
                    <div className="space-y-3 text-sm text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>个性化场景练习</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>AI智能反馈</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>进度跟踪记录</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 聊天界面 */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
            <div className="flex h-full">
              {/* 左侧信息面板 */}
              <div className="w-80 border-r border-gray-200 bg-gray-50">
                {/* EQ 圆形大图标 */}
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mt-6 mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                {/* 返回按钮 */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4">
                  <button
                    onClick={handleBackToSelection}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">返回选择</span>
                  </button>
                </div>

                {/* 练习信息 */}
                <div className="p-4 space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-2">当前练习</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>情商对话练习</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>3轮对话练习</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>AI智能评分</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-2">练习提示</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• 保持真诚和开放的态度</p>
                      <p>• 仔细倾听对方的观点</p>
                      <p>• 用积极的语言表达想法</p>
                      <p>• 关注情感和事实的平衡</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧聊天区域 */}
              <div className="flex-1 flex flex-col bg-white">
                {/* 聊天内容区域 */}
                <div className="flex-1 bg-gray-50">
                  <ChatInterface
                    scenarioId={currentScenarioId || ''}
                    sessionId={selectedSessionId}
                    onComplete={handleChatComplete}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 