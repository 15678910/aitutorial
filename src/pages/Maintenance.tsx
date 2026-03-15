import { Link } from 'react-router-dom'

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#29264c] to-[#312e81] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* AI Logo */}
        <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-accent/20">
          <span className="text-white font-bold text-2xl">AI</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          사이트 준비 중
        </h1>
        <p className="text-gray-300 text-lg mb-2">
          더 나은 서비스로 곧 돌아오겠습니다.
        </p>
        <p className="text-gray-400 text-sm mb-10">
          불편을 드려 죄송합니다. 잠시 후 다시 방문해 주세요.
        </p>

        {/* Decorative dots animation */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Login button for approved users */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors mb-6"
        >
          로그인
        </Link>

        {/* Admin access link */}
        <div>
          <Link
            to="/admin"
            className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
          >
            관리자 접속
          </Link>
        </div>
      </div>
    </div>
  )
}
