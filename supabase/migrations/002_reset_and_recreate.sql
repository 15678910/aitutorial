-- 안전한 스키마 재배포 (기존 정책/트리거 삭제 후 재생성)
-- 이 SQL은 여러 번 실행해도 안전합니다 (멱등성)

-- ============================================
-- 1단계: 기존 정책(Policies) 삭제
-- ============================================

-- profiles 테이블 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- progress 테이블 정책 삭제
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON progress;
DROP POLICY IF EXISTS "Users can update own progress" ON progress;

-- discussions 테이블 정책 삭제
DROP POLICY IF EXISTS "Anyone can view discussions" ON discussions;
DROP POLICY IF EXISTS "Authenticated users can create discussions" ON discussions;
DROP POLICY IF EXISTS "Users can update own discussions" ON discussions;
DROP POLICY IF EXISTS "Users can delete own discussions" ON discussions;

-- replies 테이블 정책 삭제
DROP POLICY IF EXISTS "Anyone can view replies" ON replies;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON replies;
DROP POLICY IF EXISTS "Users can delete own replies" ON replies;

-- ============================================
-- 2단계: 기존 트리거(Triggers) 삭제
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_progress_updated_at ON progress;
DROP TRIGGER IF EXISTS update_discussions_updated_at ON discussions;

-- ============================================
-- 3단계: 테이블 생성 (IF NOT EXISTS)
-- ============================================

-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학습 진도 테이블
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  quiz_score NUMERIC(5, 2),
  quiz_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

-- 토론 테이블
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  liked_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 토론 댓글 테이블
CREATE TABLE IF NOT EXISTS replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4단계: 인덱스 생성 (IF NOT EXISTS)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_section_id ON progress(section_id);
CREATE INDEX IF NOT EXISTS idx_discussions_section_id ON discussions(section_id);
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_replies_discussion_id ON replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_replies_user_id ON replies(user_id);

-- ============================================
-- 5단계: RLS (Row Level Security) 활성화
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6단계: 정책(Policies) 재생성
-- ============================================

-- profiles 테이블 정책
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- progress 테이블 정책
CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (auth.uid() = user_id);

-- discussions 테이블 정책
CREATE POLICY "Anyone can view discussions"
  ON discussions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON discussions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discussions"
  ON discussions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own discussions"
  ON discussions FOR DELETE
  USING (auth.uid() = user_id);

-- replies 테이블 정책
CREATE POLICY "Anyone can view replies"
  ON replies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies"
  ON replies FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7단계: 함수(Functions) 재생성
-- ============================================

-- 새 사용자 자동 프로필 생성 함수
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================
-- 8단계: 트리거(Triggers) 재생성
-- ============================================

-- 새 사용자 생성 시 프로필 자동 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- updated_at 자동 갱신 트리거
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_discussions_updated_at
  BEFORE UPDATE ON discussions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 완료
-- ============================================
-- 모든 스키마 객체가 안전하게 재생성되었습니다.
