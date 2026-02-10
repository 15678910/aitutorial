import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as SupabaseClient, {
      get: (_target, prop) => {
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithPassword: async () => ({ data: null, error: { message: 'Supabase가 설정되지 않았습니다. .env 파일을 확인하세요.' } }),
            signUp: async () => ({ data: null, error: { message: 'Supabase가 설정되지 않았습니다. .env 파일을 확인하세요.' } }),
            signOut: async () => ({ error: null }),
          }
        }
        if (prop === 'from') {
          return () => ({
            select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), data: null, error: null }), data: null, error: null }),
            upsert: async () => ({ data: null, error: null }),
          })
        }
        return () => {}
      },
    })
