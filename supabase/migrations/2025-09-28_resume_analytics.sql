-- Raw behavioral events (append-only)
create table if not exists public.resume_events (
  id uuid primary key default gen_random_uuid(),
  user_hash text not null,                -- SHA-256 of userId (do not store raw)
  resume_version_id uuid,                 -- nullable (some events pre-version)
  event_type text not null,               -- INTERVIEW_COMPLETED | JD_ALIGNED | PDF_EXPORTED | COMMENT_ADDED | COMMENT_RESOLVED | MENTOR_APPROVED
  metadata jsonb default '{}'::jsonb,     -- e.g., {atsScore: 78, keywordsMatched: 12}
  created_at timestamptz default now()
);
create index if not exists idx_events_user on public.resume_events(user_hash);
create index if not exists idx_events_type on public.resume_events(event_type);
create index if not exists idx_events_created on public.resume_events(created_at);

-- Daily rollups per user and global aggregates
create table if not exists public.resume_metrics_daily (
  day date not null,
  user_hash text,
  resumes_created int default 0,
  versions_created int default 0,
  avg_ats_score numeric,
  p50_ats numeric,
  p90_ats numeric,
  avg_keywords_matched numeric,
  export_conversion numeric,              -- exports / interview completes
  mentor_accept_rate numeric,             -- approvals / submitted-for-review
  primary key (day, user_hash)
);
create index if not exists idx_metrics_day on public.resume_metrics_daily(day);

-- Prompt/Template experiment registry
create table if not exists public.resume_experiments (
  id uuid primary key default gen_random_uuid(),
  key text not null,                      -- e.g., "COACH_PROMPT_V1"
  variant text not null,                  -- "A", "B", "C"
  traffic_split numeric not null,         -- 0..1
  start_at timestamptz default now(),
  stop_at timestamptz,
  status text default 'active',           -- active | paused | completed
  target_metric text not null             -- e.g., "ats_score"
);

-- Assignment log (who saw what)
create table if not exists public.resume_experiment_assignments (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.resume_experiments(id) on delete cascade,
  user_hash text not null,
  variant text not null,
  created_at timestamptz default now()
);
create index if not exists idx_assign_user on public.resume_experiment_assignments(user_hash);

-- Model run registry for audits
create table if not exists public.resume_model_runs (
  id uuid primary key default gen_random_uuid(),
  user_hash text,
  resume_version_id uuid,
  provider text,                           -- openai/anthropic/bedrock
  model text,
  prompt_key text,                         -- e.g., "SYSTEM_COACH@2025-09-28"
  tokens_in int,
  tokens_out int,
  ats_score numeric,
  missing_keywords int,
  created_at timestamptz default now()
);
