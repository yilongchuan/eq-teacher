-- Create scenarios_dynamic table
CREATE TABLE scenarios_dynamic (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
    system_prompt TEXT NOT NULL,
    rubric JSONB NOT NULL,
    play_count INTEGER DEFAULT 0,
    usefulness_avg FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create sessions table
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    scenario_id TEXT REFERENCES scenarios_dynamic(id),
    messages JSONB NOT NULL,
    turn INTEGER DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('idle', 'generating', 'active', 'grading', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create session_results table
CREATE TABLE session_results (
    session_id TEXT PRIMARY KEY REFERENCES sessions(id),
    scores JSONB NOT NULL,
    feedback TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_scenarios_domain ON scenarios_dynamic(domain);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_created_at ON sessions(created_at); 