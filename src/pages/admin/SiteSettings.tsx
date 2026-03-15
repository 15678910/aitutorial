import { useState, useEffect } from 'react'
import { useSiteSettingsStore } from '../../store/siteSettingsStore'

function ToggleSwitch({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${enabled ? 'bg-accent' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function SiteSettings() {
  const { settings, initialized, fetchSettings, updateSetting } = useSiteSettingsStore()
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!initialized) fetchSettings()
  }, [initialized, fetchSettings])

  const handleToggle = async (key: 'maintenance_mode' | 'invite_only', value: boolean) => {
    if (key === 'maintenance_mode' && value === true) {
      setShowConfirm(true)
      return
    }
    await doToggle(key, value)
  }

  const doToggle = async (key: 'maintenance_mode' | 'invite_only', value: boolean) => {
    setSaving(key)
    setMessage(null)
    const result = await updateSetting(key, value)
    setSaving(null)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: '설정이 저장되었습니다.' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleConfirmMaintenance = async () => {
    setShowConfirm(false)
    await doToggle('maintenance_mode', true)
  }

  const handleCancelMaintenance = () => {
    setShowConfirm(false)
  }

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">유지보수 모드 활성화</h3>
                <p className="text-gray-600 text-sm">
                  유지보수 모드를 활성화하면 승인되지 않은 모든 사용자가 사이트에 접근할 수 없습니다.
                  승인된 사용자와 관리자는 계속 접근 가능합니다. 활성화하시겠습니까?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelMaintenance}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmMaintenance}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                활성화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">⚙️ 사이트 설정</h1>
        <p className="text-gray-500 mt-1">사이트 접근 제어 및 운영 모드를 관리합니다.</p>
      </div>

      {/* Maintenance Mode Active Warning Banner */}
      {settings.maintenance_mode && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-300 text-red-800">
          <span className="text-lg mt-0.5">⚠️</span>
          <p className="text-sm font-medium">
            현재 유지보수 모드가 활성화되어 있습니다. 승인되지 않은 사용자는 사이트에 접근할 수 없습니다.
          </p>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Maintenance Mode Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔧</span>
              <h2 className="text-lg font-semibold text-gray-900">유지보수 모드</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                settings.maintenance_mode
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  settings.maintenance_mode ? 'bg-red-500' : 'bg-green-500'
                }`} />
                {settings.maintenance_mode ? '사이트 닫힘' : '사이트 열림'}
              </span>
            </div>
            <p className="text-gray-500 text-sm ml-11">
              활성화하면 승인되지 않은 사용자에게 '준비 중' 페이지가 표시됩니다.
              <br />
              관리자와 승인된(초대된) 사용자는 항상 접근 가능합니다.
            </p>
          </div>
          <div className="ml-4 pt-1">
            <ToggleSwitch
              enabled={settings.maintenance_mode}
              onChange={(v) => handleToggle('maintenance_mode', v)}
              disabled={saving === 'maintenance_mode'}
            />
          </div>
        </div>
      </div>

      {/* Invite-Only Mode Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔒</span>
              <h2 className="text-lg font-semibold text-gray-900">초대제 (회원가입 제한)</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                settings.invite_only
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  settings.invite_only ? 'bg-amber-500' : 'bg-green-500'
                }`} />
                {settings.invite_only ? '초대제 운영' : '자유 가입'}
              </span>
            </div>
            <p className="text-gray-500 text-sm ml-11">
              활성화하면 새 회원가입 시 관리자 승인이 필요합니다.
              <br />
              미승인 사용자는 로그인할 수 없으며, 사용자 관리에서 승인할 수 있습니다.
            </p>
          </div>
          <div className="ml-4 pt-1">
            <ToggleSwitch
              enabled={settings.invite_only}
              onChange={(v) => handleToggle('invite_only', v)}
              disabled={saving === 'invite_only'}
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-blue-500 text-lg">💡</span>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">설정 안내</p>
            <ul className="list-disc list-inside space-y-1 text-blue-600">
              <li>유지보수 모드와 초대제는 독립적으로 동작합니다.</li>
              <li>두 설정 모두 켜면 사이트가 닫히고, 열었을 때 초대제가 적용됩니다.</li>
              <li>설정 변경은 즉시 반영되며 재배포가 필요 없습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
