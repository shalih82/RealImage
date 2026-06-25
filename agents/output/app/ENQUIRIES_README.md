Enquiries: webhook & Supabase setup
=================================

Quick steps to enable remote collection of Contact form submissions.

1) Install deps and run locally

   cd agents/output/app
   npm install
   npm run dev

2) Webhook (fast)

 - Provide `VITE_ENQUIRY_WEBHOOK` in `.env` (see `.env.example`).
 - The app will POST each saved enquiry JSON to that URL. The JSON shape is the saved `Submission` object.

3) Supabase (recommended)

 - Create a Supabase project and copy `URL` and `anon` key into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
 - Run `SUPABASE_SETUP.sql` in the Supabase SQL editor to create the `enquiries` table.
 - The site will insert entries into `enquiries` and the admin panel will fetch them when Supabase is configured.

4) Notes

 - The app still saves entries to browser `localStorage` for offline fallback.
 - For production use, prefer server-side webhook endpoints to keep keys secret. The app supports a Vercel serverless endpoint at `/api/enquiries` that inserts submissions using a Supabase `service_role` key (set `VITE_USE_SERVERLESS=true` and add `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in your Vercel project settings).
