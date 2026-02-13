import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'

export default function Header() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-primary">AI 학습</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/courses" className="text-gray-600 hover:text-primary font-medium transition-colors">코스</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium transition-colors">내 학습</Link>
                <Link to="/transcript" className="text-gray-600 hover:text-primary font-medium transition-colors">성적표</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-red-600 hover:text-red-700 font-medium transition-colors">관리자</Link>
                )}
                <button onClick={handleSignOut} className="text-gray-500 hover:text-gray-700 text-sm font-medium">로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">로그인</Button></Link>
                <Link to="/signup"><Button size="sm">시작하기</Button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
