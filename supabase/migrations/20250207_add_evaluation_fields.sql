-- 添加评分和目标相关字段到sessions表
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS objective TEXT,
ADD COLUMN IF NOT EXISTS objective_achievement_rate INTEGER CHECK (objective_achievement_rate >= 0 AND objective_achievement_rate <= 100),
ADD COLUMN IF NOT EXISTS overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
ADD COLUMN IF NOT EXISTS detailed_scores JSONB,
ADD COLUMN IF NOT EXISTS feedback TEXT,
ADD COLUMN IF NOT EXISTS improvement_suggestions TEXT[],
ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMP WITH TIME ZONE;

-- 添加角色和场景上下文字段到scenarios_dynamic表
ALTER TABLE scenarios_dynamic 
ADD COLUMN IF NOT EXISTS character JSONB,
ADD COLUMN IF NOT EXISTS scenario_context TEXT,
ADD COLUMN IF NOT EXISTS objective TEXT;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_sessions_evaluated_at ON sessions(evaluated_at);
CREATE INDEX IF NOT EXISTS idx_sessions_overall_score ON sessions(overall_score);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status); 