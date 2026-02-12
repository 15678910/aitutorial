import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold">AI 학습</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">누구나 무료로 배울 수 있는<br />인공지능 학습 플랫폼</p>
          </div>
          <nav aria-label="학습 네비게이션">
            <h3 className="font-semibold mb-4">학습</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/courses" className="hover:text-white transition-colors">전체 코스</Link></li>
              <li><Link to="/courses/ai-intro" className="hover:text-white transition-colors">AI란 무엇인가</Link></li>
              <li><Link to="/courses/ml-basics" className="hover:text-white transition-colors">머신러닝 기초</Link></li>
              <li><Link to="/courses/deep-learning" className="hover:text-white transition-colors">딥러닝과 신경망</Link></li>
              <li><Link to="/courses/generative-ai" className="hover:text-white transition-colors">생성형 AI와 LLM</Link></li>
              <li><Link to="/courses/making-ai" className="hover:text-white transition-colors">AI 만들기</Link></li>
              <li><Link to="/courses/claude-code" className="hover:text-white transition-colors">Claude Code 마스터하기</Link></li>
              <li><Link to="/courses/claude-constitution" className="hover:text-white transition-colors">Claude AI 헌법</Link></li>
            </ul>
          </nav>
          <nav aria-label="사이트 정보">
            <h3 className="font-semibold mb-4">정보</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white transition-colors">소개</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AI 학습 플랫폼. 모든 콘텐츠는 무료로 제공됩니다.
        </div>
      </div>
    </footer>
  )
}
