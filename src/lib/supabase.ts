import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if Supabase config is properly set
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

// Initialize Supabase client only if properly configured
let supabase: SupabaseClient<Database> | null = null
let supabaseAdmin: SupabaseClient<Database> | null = null

if (isSupabaseConfigured) {
  supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  
  // Admin client for server-side operations
  if (supabaseServiceRoleKey) {
    supabaseAdmin = createClient<Database>(supabaseUrl!, supabaseServiceRoleKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
}

// Helper function to ensure Supabase is configured
export function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your environment variables.')
  }
  return supabase
}

// Helper function to get admin client
export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured. Please check your SUPABASE_SERVICE_ROLE_KEY environment variable.')
  }
  return supabaseAdmin
}

export { supabase, supabaseAdmin, isSupabaseConfigured }