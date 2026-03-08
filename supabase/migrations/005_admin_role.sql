-- 005: 관리자 역할 시스템 추가
-- Supabase SQL Editor에서 실행
--
-- ⚠️ 중요: profiles 테이블의 RLS 정책에서 같은 profiles 테이블을
--    서브쿼리로 조회하면 무한 재귀가 발생하여 500 에러가 납니다.
--    반드시 SECURITY DEFINER 함수를 사용하세요!

-- 1. profiles 테이블에 role 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- 2. role 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 3. SECURITY DEFINER 함수: RLS를 우회하여 admin 역할을 확인
--    이 함수가 없으면 profiles RLS 정책이 자기 자신을 참조하여 무한 루프 발생
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 4. profiles: 관리자는 모든 프로필 조회 가능
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile or admin can view all" ON profiles;
CREATE POLICY "Users can view own profile or admin can view all" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

-- 5. progress: 관리자는 모든 진도 조회 가능
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
DROP POLICY IF EXISTS "Users can view own progress or admin can view all" ON progress;
CREATE POLICY "Users can view own progress or admin can view all" ON progress
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

-- 6. essays: 관리자는 모든 에세이 조회 가능
DROP POLICY IF EXISTS "Users can view own or submitted essays" ON essays;
DROP POLICY IF EXISTS "Users can view own or submitted essays or admin all" ON essays;
CREATE POLICY "Users can view own or submitted essays or admin all" ON essays
  FOR SELECT USING (
    auth.uid() = user_id
    OR status = 'submitted'
    OR is_admin()
  );

-- 7. peer_reviews: 관리자는 모든 피어리뷰 조회 가능
DROP POLICY IF EXISTS "Users can view relevant reviews" ON peer_reviews;
DROP POLICY IF EXISTS "Users can view relevant reviews or admin all" ON peer_reviews;
CREATE POLICY "Users can view relevant reviews or admin all" ON peer_reviews
  FOR SELECT USING (
    reviewer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM essays WHERE essays.id = peer_reviews.essay_id AND essays.user_id = auth.uid())
    OR is_admin()
  );
