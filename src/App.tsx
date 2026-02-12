import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Learn from './pages/Learn'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Certificate from './pages/Certificate'
import Transcript from './pages/Transcript'
import NotFound from './pages/NotFound'
import { useAuthStore } from './store/authStore'

// Lazy load Essay and Review pages
const Essay = lazy(() => import('./pages/Essay'))
const Review = lazy(() => import('./pages/Review'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
})

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize, initialized } = useAuthStore()
  useEffect(() => { if (!initialized) initialize() }, [initialize, initialized])
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:slug" element={<CourseDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/certificate/:courseSlug" element={<Certificate />} />
                <Route path="/transcript" element={<Transcript />} />
                <Route path="/essay/:courseSlug/:chapterId" element={<Essay />} />
                <Route path="/review/:courseSlug" element={<Review />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/learn/:courseSlug/:chapterSlug/:sectionSlug" element={<Learn />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthInitializer>
    </QueryClientProvider>
  )
}
