-- 添加角色和场景上下文字段到scenarios_dynamic表
ALTER TABLE scenarios_dynamic 
ADD COLUMN IF NOT EXISTS character JSONB,
ADD COLUMN IF NOT EXISTS scenario_context TEXT; 