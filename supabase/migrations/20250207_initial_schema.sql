-- 创建动态场景表
CREATE TABLE IF NOT EXISTS scenarios_dynamic (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
    system_prompt TEXT NOT NULL,
    rubric JSONB NOT NULL,
    play_count INTEGER DEFAULT 0,
    usefulness_average FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建会话表
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    scenario_id TEXT NOT NULL REFERENCES scenarios_dynamic(id),
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    turn_count INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'grading', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    objective TEXT NULL,
    objective_achievement_rate INTEGER NULL CHECK (objective_achievement_rate BETWEEN 0 AND 100),
    overall_score INTEGER NULL CHECK (overall_score BETWEEN 0 AND 100),
    detailed_scores JSONB NULL,
    feedback TEXT NULL,
    improvement_suggestions TEXT[] NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE NULL,
    user_id UUID NULL REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_scenarios_domain ON scenarios_dynamic(domain);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_evaluated_at ON sessions(evaluated_at);
CREATE INDEX IF NOT EXISTS idx_sessions_overall_score ON sessions(overall_score);