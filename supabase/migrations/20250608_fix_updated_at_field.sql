-- 修复sessions表缺失的updated_at字段
ALTER TABLE IF EXISTS "public"."sessions" 
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;

-- 为已存在的记录更新updated_at字段，设置为created_at的值
UPDATE "public"."sessions" 
SET "updated_at" = "created_at" 
WHERE "updated_at" IS NULL; 