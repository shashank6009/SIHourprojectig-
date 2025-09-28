-- Privacy & Compliance Tables
-- PII VAULT (envelope encryption: data_key_encrypted + ciphertext + iv + tag)
create table if not exists public.pii_vault (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null,                     -- "contact", "education_doc", etc.
  data_key_encrypted bytea not null,
  iv bytea not null,
  tag bytea not null,
  ciphertext bytea not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_pii_user on public.pii_vault(user_id);

-- CONSENT LEDGER (append-only)
create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  policy_version text not null,
  scopes text[] not null,                 -- e.g., { "LLM_PROCESSING", "OUTREACH_EMAIL", "STORAGE_OFFSHORE" }
  region text not null,                   -- e.g., "EU","IN","US"
  granted boolean not null,
  ip_hash text,
  user_agent text,
  created_at timestamptz default now()
);
create index if not exists idx_consents_user on public.consents(user_id);

-- POLICY VERSIONS
create table if not exists public.policy_versions (
  id uuid primary key default gen_random_uuid(),
  version text unique not null,
  url text,
  effective_at timestamptz not null,
  created_at timestamptz default now()
);

-- PROCESSING LOG (append-only, immutable intent)
create table if not exists public.processing_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,                   -- "LLM_CALL","PDF_EXPORT","EMAIL_DRAFT","DELETE","EXPORT"
  lawful_basis text,                      -- "consent","contract","legitimate_interest"
  consent_version text,
  scopes_used text[],
  subject_id text,                        -- e.g., resume_version_id
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_proc_user on public.processing_logs(user_id);
create index if not exists idx_proc_action on public.processing_logs(action);

-- DSR REQUESTS (Data Subject Requests)
create table if not exists public.dsr_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,                     -- "EXPORT" | "DELETE"
  status text default 'pending',          -- pending|running|done|failed
  result_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add RLS policies
alter table public.pii_vault enable row level security;
alter table public.consents enable row level security;
alter table public.processing_logs enable row level security;
alter table public.dsr_requests enable row level security;

-- Policy: users can only access their own PII vault
create policy "Users can access their own PII vault" on public.pii_vault
  for all using (auth.uid() = user_id);

-- Policy: users can only access their own consents
create policy "Users can access their own consents" on public.consents
  for all using (auth.uid() = user_id);

-- Policy: users can only access their own processing logs
create policy "Users can access their own processing logs" on public.processing_logs
  for all using (auth.uid() = user_id);

-- Policy: users can only access their own DSR requests
create policy "Users can access their own DSR requests" on public.dsr_requests
  for all using (auth.uid() = user_id);

-- Insert default policy version
insert into public.policy_versions (version, url, effective_at) 
values ('2025-09-28', 'https://example.com/privacy-policy', now())
on conflict (version) do nothing;
