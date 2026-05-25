import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const missingEnvError = new Error(
  'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
)

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function insertEvent(eventData) {
  if (!supabase) {
    return {
      data: null,
      error: missingEnvError,
    }
  }

  return supabase.from('events').insert([eventData])
}

export async function fetchEvents() {
  if (!supabase) {
    return {
      data: null,
      error: missingEnvError,
    }
  }

  return supabase.from('events').select('*')
}

export async function getAdminUserByEmail(email) {
  if (!supabase) {
    return { admin: null, error: missingEnvError }
  }

  if (!email) {
    return {
      admin: null,
      error: new Error('Email is required to verify admin access.'),
    }
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, username, is_active, password_hash')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    return { admin: null, error }
  }

  return { admin: data, error: null }
}
