-- 006: 사이트 설정 + 사용자 승인 시스템
-- Supabase SQL Editor에서 실행

-- =============================================
-- 1. site_settings: 사이트 설정 key-value 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT 'false'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본값 삽입
INSERT INTO site_settings (key, value) VALUES
  ('maintenance_mode', 'false'::jsonb),
  ('invite_only', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS: 누구나 읽기, admin만 쓰기
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "Only admin can update site_settings"
  ON site_settings FOR UPDATE USING (is_admin());

CREATE POLICY "Only admin can insert site_settings"
  ON site_settings FOR INSERT WITH CHECK (is_admin());

-- =============================================
-- 2. profiles에 approved 컬럼 추가
-- =============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON profiles(approved);

-- =============================================
-- 3. handle_new_user() 수정: 초대제 활성화 시 approved=false
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_only_val BOOLEAN;
BEGIN
  -- 초대제 모드 확인
  SELECT COALESCE((value)::boolean, false) INTO invite_only_val
  FROM site_settings
  WHERE key = 'invite_only';

  INSERT INTO public.profiles (id, email, name, approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NOT invite_only_val, true)
  );
  RETURN NEW;
END;
$$;
