import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function insertEvent(eventData) {
  if (!supabase) {
    return {
      data: null,
      error: new Error(
        'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      ),
    }
  }

  return supabase.from('events').insert([eventData])
}

export async function fetchEvents() {
  if (!supabase) {
    return {
      data: null,
      error: new Error(
        'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      ),
    }
  }

  return supabase.from('events').select('*')
}
