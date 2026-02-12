export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
      <p className="text-sm text-gray-500 mb-10">최종 수정일: 2026년 2월 12일</p>

      <div className="prose prose-gray max-w-none space-y-10">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
          <p className="text-gray-700 leading-relaxed">
            이 약관은 AI 학습 플랫폼(이하 "플랫폼")이 제공하는 온라인 교육 서비스의 이용 조건 및 절차,
            플랫폼과 이용자 간의 권리와 의무에 관한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제2조 (정의)</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>"플랫폼"</strong>이란 AI 학습 플랫폼이 운영하는 웹사이트(determined-payne.vercel.app)를 말합니다.</li>
            <li><strong>"이용자"</strong>란 플랫폼에 접속하여 서비스를 이용하는 모든 사람을 말합니다.</li>
            <li><strong>"회원"</strong>이란 플랫폼에 가입하여 계정을 보유한 이용자를 말합니다.</li>
            <li><strong>"콘텐츠"</strong>란 플랫폼에서 제공하는 학습 자료, 퀴즈, 에세이 문제 등을 말합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제3조 (서비스의 내용)</h2>
          <p className="text-gray-700 leading-relaxed mb-3">플랫폼은 다음과 같은 서비스를 무료로 제공합니다:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>AI 관련 온라인 학습 코스 제공</li>
            <li>퀴즈 및 에세이를 통한 학습 평가</li>
            <li>피어리뷰(동료 평가) 시스템</li>
            <li>학습 진도 추적 및 수료증 발급</li>
            <li>학습자 간 토론 기능</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제4조 (회원 가입 및 계정)</h2>
          <ul className="list-decimal list-inside space-y-2 text-gray-700">
            <li>회원 가입은 이메일 주소와 비밀번호로 진행됩니다.</li>
            <li>회원은 정확한 정보를 제공해야 하며, 타인의 정보를 도용해서는 안 됩니다.</li>
            <li>계정 보안은 회원 본인의 책임이며, 비밀번호를 안전하게 관리해야 합니다.</li>
            <li>회원은 언제든지 탈퇴를 요청할 수 있으며, 탈퇴 시 관련 데이터는 삭제됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제5조 (이용자의 의무)</h2>
          <p className="text-gray-700 leading-relaxed mb-3">이용자는 다음 행위를 해서는 안 됩니다:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>타인의 개인정보를 침해하거나 수집하는 행위</li>
            <li>플랫폼의 정상적 운영을 방해하는 행위</li>
            <li>허위 정보를 게시하거나 타인을 비방하는 행위</li>
            <li>콘텐츠를 무단으로 복제, 배포, 상업적으로 이용하는 행위</li>
            <li>자동화된 도구를 사용하여 대량의 데이터를 수집하는 행위</li>
            <li>에세이, 토론 등에서 부적절하거나 폭력적인 내용을 작성하는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제6조 (콘텐츠 저작권)</h2>
          <ul className="list-decimal list-inside space-y-2 text-gray-700">
            <li>플랫폼의 학습 콘텐츠에 대한 저작권은 플랫폼에 귀속됩니다.</li>
            <li>이용자가 작성한 에세이, 토론 글의 저작권은 해당 이용자에게 귀속됩니다.</li>
            <li>이용자가 작성한 콘텐츠는 피어리뷰 등 플랫폼 서비스 운영 목적으로 활용될 수 있습니다.</li>
            <li>학습 콘텐츠의 개인적, 비상업적 용도의 활용은 허용됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제7조 (서비스 변경 및 중단)</h2>
          <ul className="list-decimal list-inside space-y-2 text-gray-700">
            <li>플랫폼은 서비스의 내용을 변경하거나 일시적으로 중단할 수 있습니다.</li>
            <li>서비스 변경 시 사전 공지하는 것을 원칙으로 합니다.</li>
            <li>무료 서비스의 특성상 서비스 중단에 대한 별도의 보상은 제공되지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제8조 (면책 조항)</h2>
          <ul className="list-decimal list-inside space-y-2 text-gray-700">
            <li>플랫폼은 무료로 제공되며, 서비스 이용에 따른 어떠한 보증도 제공하지 않습니다.</li>
            <li>학습 콘텐츠는 교육 목적으로 제공되며, 전문적 조언을 대체하지 않습니다.</li>
            <li>수료증은 학습 완료를 증명하는 것이며, 공식 학위나 자격증이 아닙니다.</li>
            <li>이용자 간 상호작용(토론, 피어리뷰)에서 발생하는 분쟁에 대해 플랫폼은 책임지지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제9조 (약관의 변경)</h2>
          <p className="text-gray-700 leading-relaxed">
            플랫폼은 필요한 경우 이 약관을 변경할 수 있으며, 변경된 약관은 플랫폼에 공지한 시점부터 효력이 발생합니다.
            이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 탈퇴할 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  )
}
