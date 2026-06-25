import { createClient, SupabaseClient } from '@supabase/supabase-js'

type Entry = Record<string, any>

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let supabase: SupabaseClient | null = null
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
}

export function isSupabaseConfigured() {
  return !!supabase
}

export async function sendToSupabase(entry: Entry) {
  if (!supabase) return null
  try {
    // Expecting a table named `enquiries` in Supabase. Adjust column names as needed.
    const payload = {
      client_id: entry.id,
      name: entry.name || null,
      email: entry.email || null,
      phone: entry.phone || null,
      wedding_date: entry.weddingDate || null,
      venue: entry.venue || null,
      service_type: entry.serviceType || null,
      budget: entry.budget || null,
      message: entry.message || null,
      submitted_at: entry.submittedAt || new Date().toISOString(),
      raw: entry,
    }
    const { data, error } = await supabase.from('enquiries').insert([payload])
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Supabase insert failed', err)
    return null
  }
}

export async function fetchFromSupabase() {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) throw error
    return data ?? []
  } catch (err) {
    console.warn('Supabase fetch failed', err)
    return []
  }
}

export default supabase
