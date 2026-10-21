// Supabase Client Utilities for SomoPal
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CONFIG } from './config.ts'

let supabaseBrowserClient: SupabaseClient | null = null

/**
 * Returns a Supabase client for client-side usage (browser or SSR with anon key).
 */
export function getSupabaseClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    if (!supabaseBrowserClient) {
      if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) {
        console.warn('Supabase URL or Anon Key is missing. Check your environment variables.')
      }
      supabaseBrowserClient = createClient(
        CONFIG.supabaseUrl || 'https://placeholder.supabase.co',
        CONFIG.supabaseAnonKey || 'placeholder-anon-key'
      )
    }
    return supabaseBrowserClient
  }

  return createClient(
    CONFIG.supabaseUrl || 'https://placeholder.supabase.co',
    CONFIG.supabaseAnonKey || 'placeholder-anon-key'
  )
}

/**
 * Returns an admin Supabase client with the service role key for backend operations (seeding, migrations, RPC).
 */
export function getSupabaseAdminClient(): SupabaseClient {
  const key = CONFIG.supabaseServiceRoleKey || CONFIG.supabaseAnonKey || 'placeholder-key'
  return createClient(CONFIG.supabaseUrl || 'https://placeholder.supabase.co', key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
