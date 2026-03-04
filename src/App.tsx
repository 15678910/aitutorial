import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import { useAuthStore } from './store/authStore'

// Lazy load ALL pages for better initial load performance
const Home = lazy(() => import('./pages/Home'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Learn = lazy(() => import('./pages/Learn'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Certificate = lazy(() => import('./pages/Certificate'))
const Transcript = lazy(() => import('./pages/Transcript'))
const Essay = lazy(() => import('./pages/Essay'))
const Review = lazy(() => import('./pages/Review'))
const NotFound = lazy(() => import('./pages/NotFound'))
const About = lazy(() => import('./pages/About'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Admin = lazy(() => import('./pages/Admin'))
const Community = lazy(() => import('./pages/Community'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const QAForum = lazy(() => import('./pages/QAForum'))
const QADetail = lazy(() => import('./pages/QADetail'))
const Wiki = lazy(() => import('./pages/Wiki'))
const WikiArticlePage = lazy(() => import('./pages/WikiArticle'))
const MyProfile = lazy(() => import('./pages/MyProfile'))
const Enterprise = lazy(() => import('./pages/Enterprise'))
const Research = lazy(() => import('./pages/Research'))
const StudyGroups = lazy(() => import('./pages/StudyGroups'))
const Roadmap = lazy(() => import('./pages/Roadmap'))

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
          <ErrorBoundary>
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
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/community/projects" element={<Projects />} />
                  <Route path="/community/projects/:id" element={<ProjectDetail />} />
                  <Route path="/community/qa" element={<QAForum />} />
                  <Route path="/community/qa/:id" element={<QADetail />} />
                  <Route path="/community/wiki" element={<Wiki />} />
                  <Route path="/community/wiki/:slug" element={<WikiArticlePage />} />
                  <Route path="/community/enterprise" element={<Enterprise />} />
                  <Route path="/community/research" element={<Research />} />
                  <Route path="/community/study-groups" element={<StudyGroups />} />
                  <Route path="/community/profile" element={<MyProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/learn/:courseSlug/:chapterSlug/:sectionSlug" element={<Learn />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthInitializer>
    </QueryClientProvider>
  )
}
