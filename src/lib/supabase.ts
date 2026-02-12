import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Creates a chainable response proxy that mimics Supabase query builder behavior
function createChainableResponse(): any {
  const proxy = new Proxy(
    {
      data: null,
      error: null,
    },
    {
      get: (_target, prop) => {
        // Return actual data/error properties
        if (prop === 'data') return null
        if (prop === 'error') return null

        // Make the proxy thenable so it can be awaited directly
        if (prop === 'then') {
          return (resolve: (value: any) => void) => {
            resolve({ data: [], error: null })
          }
        }

        // Terminal methods that return promises with { data, error }
        const terminalMethods = ['single', 'maybeSingle']
        if (terminalMethods.includes(prop as string)) {
          return async () => ({ data: null, error: null })
        }

        // All other methods (eq, order, in, select, insert, update, delete, etc.)
        // return a function that returns the chainable proxy itself
        return (..._args: any[]) => createChainableResponse()
      },
    }
  )
  return proxy
}

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
          return () => createChainableResponse()
        }
        return () => {}
      },
    })
