import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

const STORAGE_KEY = 'offline-banner-dismissed'

export default function OfflineBanner() {
  const { connectionError } = useAuthStore()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY) === 'true'
    setDismissed(wasDismissed)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (!connectionError || dismissed) {
    return null
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                오프라인 모드: 학습 진행률이 이 기기에만 저장됩니다
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-yellow-600 hover:text-yellow-800 transition-colors"
            aria-label="배너 닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
