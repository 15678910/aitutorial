import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import { useAuthStore } from './store/authStore'
import { XPToastManager } from './components/gamification/XPToast'
import { useXPStore } from './store/xpStore'
import { useSiteSettingsStore } from './store/siteSettingsStore'

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
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const DashboardOverview = lazy(() => import('./pages/admin/DashboardOverview'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const UserDetail = lazy(() => import('./pages/admin/UserDetail'))
const ContentManagement = lazy(() => import('./pages/admin/ContentManagement'))
const ContentEditor = lazy(() => import('./pages/admin/ContentEditor'))
const SystemMonitoring = lazy(() => import('./pages/admin/SystemMonitoring'))
const PartnerManagement = lazy(() => import('./pages/admin/PartnerManagement'))
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
const Maintenance = lazy(() => import('./pages/Maintenance'))
const SiteSettings = lazy(() => import('./pages/admin/SiteSettings'))

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
  const { fetchSettings, initialized: settingsInitialized } = useSiteSettingsStore()
  useEffect(() => {
    if (!initialized) initialize()
    if (!settingsInitialized) fetchSettings()
    useXPStore.getState().checkDailyBonus()
  }, [initialize, initialized, fetchSettings, settingsInitialized])
  return <>{children}</>
}

function MaintenanceLayout() {
  const { settings, initialized: settingsReady } = useSiteSettingsStore()
  const { user, initialized: authReady } = useAuthStore()

  if (!settingsReady || !authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (settings.maintenance_mode && user?.role !== 'admin') {
    return <Maintenance />
  }

  return <Outlet />
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
                {/* Public routes - wrapped in MaintenanceLayout */}
                <Route element={<MaintenanceLayout />}>
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
                </Route>

                {/* Admin routes - always accessible (bypass maintenance) */}
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="users/:id" element={<UserDetail />} />
                  <Route path="content" element={<ContentManagement />} />
                  <Route path="content/:slug/edit" element={<ContentEditor />} />
                  <Route path="monitoring" element={<SystemMonitoring />} />
                  <Route path="partners" element={<PartnerManagement />} />
                  <Route path="settings" element={<SiteSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <XPToastManager />
        </BrowserRouter>
      </AuthInitializer>
    </QueryClientProvider>
  )
}
