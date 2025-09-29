-- TODO: Phase 2 - Add RLS policies and proper constraints
-- Resume Co-Pilot Phase 1 Database Schema

-- resumes
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  target_role text,
  ats_score numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- resume_versions
create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  job_target_id uuid,
  label text not null,
  content jsonb not null default '{}'::jsonb,
  ats_score numeric,
  created_at timestamptz default now()
);

-- job_targets
create table if not exists public.job_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  url text,
  jd_text text,
  extracted_skills text[],
  keywords text[],
  created_at timestamptz default now()
);

-- helpful indexes
create index if not exists idx_resumes_user on public.resumes(user_id);
create index if not exists idx_versions_resume on public.resume_versions(resume_id);
create index if not exists idx_jobtargets_user on public.job_targets(user_id);
