'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScenarioSelectorProps {
  onSelect: (scenarioId: string) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
  onStepChange?: (step: number) => void;
}

const domains = [
  { id: 'workplace', name: '职场沟通', icon: '💼', description: '提升职场人际关系' },
  { id: 'family', name: '家庭关系', icon: '🏠', description: '改善家庭沟通氛围' },
  { id: 'friendship', name: '朋友交往', icon: '👥', description: '增进友谊深度' },
  { id: 'romantic', name: '恋爱关系', icon: '💕', description: '提升情侣沟通质量' },
  { id: 'social', name: '社交场合', icon: '🎉', description: '增强社交自信' },
];

const difficulties = [
  { id: 'beginner', name: '初级', color: 'bg-green-100 text-green-800', description: '基础情商技巧' },
  { id: 'intermediate', name: '中级', color: 'bg-yellow-100 text-yellow-800', description: '进阶沟通策略' },
  { id: 'advanced', name: '高级', color: 'bg-red-100 text-red-800', description: '复杂情境处理' },
];

export function ScenarioSelector({ onSelect, onGeneratingChange, onStepChange }: ScenarioSelectorProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!selectedDomain || !selectedDifficulty) {
      setError('请选择场景类型和难度等级');
      return;
    }

    setIsLoading(true);
    setError('');
    onGeneratingChange?.(true);

    // 立即开始API调用
    const apiPromise = fetch('/api/generate-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: selectedDomain,
        difficulty: selectedDifficulty,
      }),
    });

    // 同时开始显示进度动画
    let currentStep = 0;
    const maxStep = 4; // 0-4 对应5个步骤
    onStepChange?.(currentStep);
    
    const progressInterval = setInterval(() => {
      if (currentStep < maxStep) {
        currentStep++;
        onStepChange?.(currentStep);
      }
      // 到达最后一步时停止递增，但保持interval运行直到API完成
    }, 3000); // 每3秒更新一次

    try {
      const response = await apiPromise;
      
      if (!response.ok) throw new Error('生成场景失败');
      
      const data = await response.json();
      onSelect(data.scenarioId);
    } catch (error) {
      console.error('Error generating scenario:', error);
      setError('生成场景失败，请重试');
    } finally {
      clearInterval(progressInterval); // 停止进度动画
      setIsLoading(false);
      onGeneratingChange?.(false);
      onStepChange?.(0);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* 场景类型选择 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">选择练习场景</h3>
        <div className="space-y-2">
          {domains.map((domain) => (
            <motion.button
              key={domain.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDomain(domain.id)}
              className={cn(
                "w-full p-3 rounded-lg border text-left transition-all duration-200",
                selectedDomain === domain.id
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              )}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{domain.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{domain.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{domain.description}</div>
                </div>
                {selectedDomain === domain.id && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 难度等级选择 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">选择难度等级</h3>
        <div className="grid grid-cols-1 gap-2">
          {difficulties.map((difficulty) => (
            <motion.button
              key={difficulty.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDifficulty(difficulty.id)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all duration-200",
                selectedDifficulty === difficulty.id
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{difficulty.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{difficulty.description}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", difficulty.color)}>
                    {difficulty.name}
                  </span>
                  {selectedDifficulty === difficulty.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </motion.div>
      )}

      {/* 开始练习按钮 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        disabled={isLoading || !selectedDomain || !selectedDifficulty}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200",
          isLoading || !selectedDomain || !selectedDifficulty
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md"
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>生成场景中...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>开始练习</span>
          </div>
        )}
      </motion.button>
    </div>
  );
} 