export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
      <p className="text-sm text-gray-500 mb-10">최종 수정일: 2026년 2월 12일</p>

      <div className="prose prose-gray max-w-none space-y-10">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. 개인정보의 수집 항목</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            플랫폼은 회원 가입 및 서비스 이용을 위해 다음과 같은 개인정보를 수집합니다:
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-semibold text-gray-900">구분</th>
                  <th className="text-left py-2 font-semibold text-gray-900">수집 항목</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-2">필수</td>
                  <td className="py-2">이메일 주소, 비밀번호(암호화), 이름</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">자동 수집</td>
                  <td className="py-2">학습 진도, 퀴즈 점수, 에세이 제출 내용</td>
                </tr>
                <tr>
                  <td className="py-2">선택</td>
                  <td className="py-2">토론 작성 내용, 피어리뷰 내용</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>회원 관리:</strong> 본인 확인, 계정 생성 및 관리</li>
            <li><strong>학습 서비스 제공:</strong> 학습 진도 추적, 퀴즈 채점, 수료증 발급</li>
            <li><strong>피어리뷰:</strong> 에세이 평가를 위한 동료 매칭</li>
            <li><strong>서비스 개선:</strong> 학습 패턴 분석을 통한 콘텐츠 개선</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>회원 탈퇴 시 즉시 삭제합니다.</li>
            <li>단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</li>
            <li>학습 진도 데이터는 브라우저의 localStorage에도 저장되며, 이는 이용자가 직접 삭제할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            플랫폼은 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
            단, 서비스 운영을 위해 다음의 서비스를 이용하고 있습니다:
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-semibold text-gray-900">서비스</th>
                  <th className="text-left py-2 font-semibold text-gray-900">용도</th>
                  <th className="text-left py-2 font-semibold text-gray-900">서버 위치</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-2">Supabase</td>
                  <td className="py-2">데이터베이스, 인증</td>
                  <td className="py-2">미국</td>
                </tr>
                <tr>
                  <td className="py-2">Vercel</td>
                  <td className="py-2">웹사이트 호스팅</td>
                  <td className="py-2">미국 (엣지 CDN)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">5. 개인정보의 안전성 확보 조치</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>비밀번호는 bcrypt 알고리즘으로 암호화하여 저장합니다.</li>
            <li>모든 통신은 HTTPS(TLS) 암호화를 통해 전송됩니다.</li>
            <li>데이터베이스 접근은 행 수준 보안(RLS) 정책으로 제어됩니다.</li>
            <li>API 키는 최소 권한 원칙에 따라 관리됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">6. 이용자의 권리</h2>
          <p className="text-gray-700 leading-relaxed mb-3">이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>개인정보 열람, 정정, 삭제 요청</li>
            <li>개인정보 처리 정지 요청</li>
            <li>회원 탈퇴를 통한 개인정보 삭제</li>
          </ul>
          <p className="text-gray-700 mt-3">
            위 권리를 행사하려면 GitHub Issues를 통해 요청해주세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">7. 쿠키(Cookie) 사용</h2>
          <p className="text-gray-700 leading-relaxed">
            플랫폼은 별도의 쿠키를 사용하지 않습니다.
            학습 진도와 사용자 설정은 브라우저의 localStorage에 저장되며,
            인증 토큰은 Supabase Auth를 통해 관리됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">8. 개인정보 처리방침의 변경</h2>
          <p className="text-gray-700 leading-relaxed">
            이 개인정보처리방침은 법률이나 서비스 변경에 따라 수정될 수 있습니다.
            변경 사항은 플랫폼에 공지하며, 중요한 변경이 있는 경우 별도로 안내드립니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">9. 문의처</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 mb-2">개인정보 관련 문의는 아래로 연락해주세요:</p>
            <ul className="text-gray-700 space-y-1">
              <li>
                <strong>GitHub:</strong>{' '}
                <a href="https://github.com/15678910/aitutorial/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  github.com/15678910/aitutorial
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
