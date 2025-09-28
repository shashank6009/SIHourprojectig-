-- Create integration_tokens table for OAuth token storage
create table if not exists public.integration_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider text not null,                 -- "google:gmail", "google:calendar"
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for efficient lookups
create index if not exists idx_tokens_user_provider on public.integration_tokens(user_id, provider);

-- Create index for cleanup of expired tokens
create index if not exists idx_tokens_expires on public.integration_tokens(expires_at);

-- Add RLS policies
alter table public.integration_tokens enable row level security;

-- Policy: users can only access their own tokens
create policy "Users can access their own integration tokens" on public.integration_tokens
  for all using (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate providers per user
create unique index if not exists idx_tokens_user_provider_unique 
on public.integration_tokens(user_id, provider);
