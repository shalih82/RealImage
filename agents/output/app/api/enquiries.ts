import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Minimal Vercel serverless function to accept enquiries and insert into Supabase
// Expects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be set as env vars in Vercel

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured on server' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const payload = req.body

  try {
    const { data, error } = await supabase.from('enquiries').insert([{
      client_id: payload.id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      wedding_date: payload.weddingDate,
      venue: payload.venue,
      service_type: payload.serviceType,
      budget: payload.budget,
      message: payload.message,
      submitted_at: payload.submittedAt,
      raw: payload,
    }])

    if (error) throw error
    return res.status(200).json({ ok: true, data })
  } catch (err: any) {
    console.error('Serverless insert failed', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
}
