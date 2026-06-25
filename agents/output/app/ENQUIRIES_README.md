Enquiries: Webhook & Supabase Setup
===================================

Enable cross-browser enquiry storage so admin can see all submissions regardless of browser/device.

Quick Start
-----------

**Option 1: Supabase (recommended)**

1. Create a Supabase project (free tier available at supabase.com)
2. In Supabase SQL editor, run: SUPABASE_SETUP.sql (in this folder)
3. In Supabase project settings → API, copy your `URL` and `anon public key`
4. In `.env` (copy from `.env.example`):
   - `VITE_SUPABASE_URL=` your Supabase URL
   - `VITE_SUPABASE_ANON_KEY=` your anon key
5. Restart dev server: `npm run dev`
6. Submit form from any browser — enquiry will appear in Supabase
7. In admin panel ("View Data"), enquiries will load from Supabase (visible to all browsers)

**Option 2: Webhook (email notifications)**

1. Use a webhook service: Formspree, Zapier, Pipedream, or custom server
2. Set `VITE_ENQUIRY_WEBHOOK=` in `.env` to your webhook URL
3. On form submit, the enquiry JSON will POST to that endpoint
4. Example webhook: `https://formspree.io/f/YOUR-ID` (Formspree handles email routing)

For Production (Deployed on Vercel)
-----------------------------------

1. Set Vercel environment variables (Project Settings → Environment Variables):
   - `VITE_SUPABASE_URL` = your Supabase URL (Build/Client env)
   - `VITE_SUPABASE_ANON_KEY` = your anon key (Build/Client env)
2. Redeploy your site
3. Enquiries will now be stored in Supabase and visible across browsers

Notes
-----

- The app saves to browser localStorage for offline fallback
- Supabase anon key is safe for public client usage (read/write only to enquiries table)
- Consider row-level security (RLS) policies for production
- Webhook services like Formspree can route submissions to email automatically

