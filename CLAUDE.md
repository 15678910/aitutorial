# AI Tutorial Platform (aitutorial.kr)

## 프로젝트 개요
- React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4 + Zustand 5
- 백엔드: Supabase (PostgreSQL + Auth)
- 배포: Vercel (Hobby plan)
- 도메인: aitutorial.kr

## 수정 금지 영역
- `supabase/migrations/001_initial_schema.sql` ~ `004_security_improvements.sql` — 이미 적용된 마이그레이션
- `.env` 파일 — 민감한 키 포함

## 자주 발생하는 실수

### 1. Supabase RLS 자기 참조 정책 (심각도: 치명적)
**절대 하지 말 것:**
```sql
-- ❌ profiles 테이블의 RLS에서 profiles를 다시 조회 → 무한 재귀 → 500 에러
CREATE POLICY "..." ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

**올바른 방법:**
```sql
-- ✅ SECURITY DEFINER 함수로 RLS를 우회하여 admin 확인
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "..." ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());
```

### 2. Vercel 환경변수 접두사
- `VITE_` 접두사: 클라이언트(브라우저)에서만 접근 가능
- 접두사 없음: 서버(API Routes)에서만 접근 가능
- `api/admin-verify.ts`는 `process.env.ADMIN_SECRET` 사용 (VITE_ 아님)

### 3. Supabase Auth Web Locks
- React Strict Mode에서 `navigator.locks` 충돌로 AbortError 발생 가능
- `src/lib/supabase.ts`에 `auth.lock` 우회 설정 필수 (이미 적용됨)

## 배포 전 체크리스트
- [ ] `npm run build` 성공 확인
- [ ] Supabase RLS 정책에 자기 참조 없는지 확인
- [ ] Vercel 환경변수 (VITE_* vs non-VITE) 올바르게 설정 확인
- [ ] 로그인/로그아웃 동작 확인

## 작업 템플릿

### RLS 정책 추가 시
1. `is_admin()` 함수가 존재하는지 확인
2. 새 정책에서 admin 확인은 반드시 `is_admin()` 사용
3. profiles 테이블을 직접 서브쿼리하지 않음
4. SQL Editor에서 테스트 후 마이그레이션 파일에 기록
