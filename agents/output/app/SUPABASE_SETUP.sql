-- Supabase table for enquiries
-- Run this in Supabase SQL editor for your project

create extension if not exists pgcrypto;

create table if not exists enquiries (
  id uuid default gen_random_uuid() primary key,
  client_id text,
  name text,
  email text,
  phone text,
  wedding_date text,
  venue text,
  service_type text,
  budget text,
  message text,
  submitted_at timestamptz,
  raw jsonb
);

create index if not exists idx_enquiries_submitted_at on enquiries(submitted_at desc);
