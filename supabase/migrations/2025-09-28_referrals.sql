-- Create referrals table for network management
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  person_name text not null,
  email text,
  company text,
  role text,
  relationship text,              -- alumni, mentor, peer
  strength int default 1,         -- 1-5
  notes text,
  created_at timestamptz default now()
);

-- Create index for efficient lookups
create index if not exists idx_referrals_user on public.referrals(user_id);

-- Create index for company-based queries
create index if not exists idx_referrals_company on public.referrals(company);

-- Add RLS policies
alter table public.referrals enable row level security;

-- Policy: users can only access their own referrals
create policy "Users can access their own referrals" on public.referrals
  for all using (auth.uid() = user_id);
