-- 005: 관리자 역할 시스템 추가
-- Supabase SQL Editor에서 실행

-- 1. profiles 테이블에 role 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- 2. role 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 3. 기존 SELECT 정책을 삭제하고 관리자 포함 정책으로 교체

-- profiles: 관리자는 모든 프로필 조회 가능
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile or admin can view all" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- progress: 관리자는 모든 진도 조회 가능
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
CREATE POLICY "Users can view own progress or admin can view all" ON progress
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- essays: 관리자는 모든 에세이 조회 가능
DROP POLICY IF EXISTS "Users can view own or submitted essays" ON essays;
CREATE POLICY "Users can view own or submitted essays or admin all" ON essays
  FOR SELECT USING (
    auth.uid() = user_id
    OR status = 'submitted'
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- peer_reviews: 관리자는 모든 피어리뷰 조회 가능
DROP POLICY IF EXISTS "Users can view relevant reviews" ON peer_reviews;
CREATE POLICY "Users can view relevant reviews or admin all" ON peer_reviews
  FOR SELECT USING (
    reviewer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM essays WHERE essays.id = peer_reviews.essay_id AND essays.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
