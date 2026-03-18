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

### 4. Supabase JS 클라이언트 hang 문제 (심각도: 높음)
**절대 하지 말 것:**
```tsx
// ❌ supabase.auth.updateUser(), getSession() 등이 무한 대기할 수 있음
const { error } = await supabase.auth.updateUser({ password })
// ❌ Promise.race로 타임아웃해도 원래 Promise는 계속 대기 → 상태 미복구
const result = await Promise.race([supabase.auth.updateUser(...), timeout])
```

**올바른 방법:**
```tsx
// ✅ 중요한 API 호출은 fetch()로 직접 Supabase REST API 호출
// ✅ AbortController로 실제 요청 취소
// ✅ finally 블록으로 반드시 상태 복구
const controller = new AbortController()
setTimeout(() => controller.abort(), 15000)
const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
  method: 'PUT',
  headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY },
  body: JSON.stringify({ password }),
  signal: controller.signal,
})
```

### 5. 메신저 봇 링크 prefetch 문제 (심각도: 높음)
**절대 하지 말 것:**
```
❌ Supabase의 /auth/v1/verify?token=xxx URL을 직접 공유
→ 카카오톡/LINE 등이 미리보기 생성 시 URL을 fetch → 일회용 토큰 소비
→ 실제 사용자 클릭 시 "만료된 링크" 에러
```

**올바른 방법:**
```
✅ 자체 사이트 URL에 token_hash를 쿼리 파라미터로 전달
   /accept-invite?token_hash=xxx&type=invite
✅ 클라이언트에서 supabase.auth.verifyOtp({ token_hash, type }) 호출
→ 봇은 HTML만 가져가고 JS 실행 안 함 → 토큰 안전
```

### 6. 관리자 페이지 접속 흐름 (심각도: 높음)
**절대 하지 말 것:**
```tsx
// ❌ Supabase 로그인 확인을 관리자 비밀번호보다 먼저 하면
//    /admin → /login 리다이렉트 → 관리자 비밀번호 화면이 안 보임
if (!user) return <Navigate to="/login" replace />
// 이 줄이 adminAuthed 체크보다 위에 있으면 안 됨!
```

**올바른 방법:**
```tsx
// ✅ 관리자 비밀번호 확인이 반드시 FIRST
if (!adminAuthed) return <AdminLogin ... />
// ✅ 관리자 비밀번호 통과 후에 Supabase 로그인 확인
if (!user) return <Navigate to="/login?redirect=/admin" replace />
```
**핵심:** `/admin` 접속 시 관리자 비밀번호 입력 화면이 바로 보여야 함

### 8. 관리자 로그인 화면 배경색 (심각도: 중간)
**절대 하지 말 것:**
```tsx
// ❌ 어두운 배경색/오버레이 → 화면이 "희미하게" 보임
<div className="fixed inset-0 bg-[#29264c] z-[9999]">
```

**올바른 방법:**
```tsx
// ✅ 사이트 전체와 일관된 밝은 배경 사용
<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
```

### 7. 로딩 상태 관리 (심각도: 높음)
**절대 하지 말 것:**
```tsx
// ❌ 외부 store의 loading 상태에 의존 → 비동기 실패 시 영구 잠금
const { loading } = useAuthStore()
<Button disabled={loading}>  // store가 loading을 리셋 못하면 영구 비활성화
```

**올바른 방법:**
```tsx
// ✅ 컴포넌트 로컬 state + finally 블록으로 항상 복구
const [submitting, setSubmitting] = useState(false)
try { ... } finally { setSubmitting(false) }
// ✅ 안전 타임아웃 추가 (이중 보호)
const safety = setTimeout(() => setSubmitting(false), 20000)
```

## 배포 전 체크리스트
- [ ] `npm run build` 성공 확인
- [ ] Supabase RLS 정책에 자기 참조 없는지 확인
- [ ] Vercel 환경변수 (VITE_* vs non-VITE) 올바르게 설정 확인
- [ ] 로그인/로그아웃 동작 확인
- [ ] 비동기 버튼에 로컬 loading state + finally 사용 확인
- [ ] 외부 URL 공유 시 봇 prefetch 영향 없는지 확인
- [ ] 페이지 리다이렉트 시 복귀 경로(redirect) 유지 확인
- [ ] 기존 UI 변경 시 사용자에게 미리 확인 (특히 관리자 페이지)

## 작업 템플릿

### RLS 정책 추가 시
1. `is_admin()` 함수가 존재하는지 확인
2. 새 정책에서 admin 확인은 반드시 `is_admin()` 사용
3. profiles 테이블을 직접 서브쿼리하지 않음
4. SQL Editor에서 테스트 후 마이그레이션 파일에 기록
