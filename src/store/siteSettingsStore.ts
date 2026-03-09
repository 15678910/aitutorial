import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface SiteSettings {
  maintenance_mode: boolean
  invite_only: boolean
}

interface SiteSettingsState {
  settings: SiteSettings
  loading: boolean
  initialized: boolean
  fetchSettings: () => Promise<void>
  updateSetting: (key: keyof SiteSettings, value: boolean) => Promise<{ error: string | null }>
}

export const useSiteSettingsStore = create<SiteSettingsState>((set, get) => ({
  settings: {
    maintenance_mode: false,
    invite_only: false,
  },
  loading: false,
  initialized: false,

  fetchSettings: async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')

      if (error) {
        console.warn('Failed to fetch site settings:', error)
        set({ initialized: true })
        return
      }

      if (data) {
        const settings: SiteSettings = {
          maintenance_mode: false,
          invite_only: false,
        }
        data.forEach((row: { key: string; value: any }) => {
          if (row.key === 'maintenance_mode' || row.key === 'invite_only') {
            settings[row.key] = row.value === true || row.value === 'true'
          }
        })
        set({ settings, initialized: true })
      }
    } catch (error) {
      console.warn('Failed to fetch site settings:', error)
      set({ initialized: true })
    }
  },

  updateSetting: async (key, value) => {
    set({ loading: true })
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: JSON.stringify(value) })
        .eq('key', key)

      if (error) {
        set({ loading: false })
        return { error: error.message }
      }

      // Optimistic update
      const currentSettings = get().settings
      set({
        settings: { ...currentSettings, [key]: value },
        loading: false,
      })
      return { error: null }
    } catch (error) {
      set({ loading: false })
      return { error: '설정 업데이트에 실패했습니다.' }
    }
  },
}))
