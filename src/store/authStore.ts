import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../types'

interface AuthState {
  user: UserProfile | null
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (profile) {
          set({ user: { id: profile.id, email: profile.email, name: profile.name, avatarUrl: profile.avatar_url, createdAt: profile.created_at } })
        }
      }
    } catch {
      // Supabase not configured yet
    } finally {
      set({ initialized: true })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (profile) {
            set({ user: { id: profile.id, email: profile.email, name: profile.name, avatarUrl: profile.avatar_url, createdAt: profile.created_at } })
          }
        } catch {
          set({ user: null })
        }
      } else {
        set({ user: null })
      }
    })
  },

  signIn: async (email, password) => {
    set({ loading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    set({ loading: false })
    return { error: error?.message || null }
  },

  signUp: async (email, password, name) => {
    set({ loading: true })
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    set({ loading: false })
    return { error: error?.message || null }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
