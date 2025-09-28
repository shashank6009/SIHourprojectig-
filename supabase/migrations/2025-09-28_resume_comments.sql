-- resume_comments table for feedback and mentor reviews
create table if not exists public.resume_comments (
  id uuid primary key default gen_random_uuid(),
  resume_version_id uuid not null references public.resume_versions(id) on delete cascade,
  block_id text,
  line_ref int,
  author text not null,
  text text not null,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- helpful indexes
create index if not exists idx_comments_version on public.resume_comments(resume_version_id);
create index if not exists idx_comments_block on public.resume_comments(block_id);
create index if not exists idx_comments_resolved on public.resume_comments(resolved);
