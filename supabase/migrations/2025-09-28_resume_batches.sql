-- Create resume_batches table
create table if not exists public.resume_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  label text not null,
  total int default 0,
  processed int default 0,
  failed int default 0,
  status text default 'created', -- created|running|completed|failed|canceled
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create resume_batch_items table
create table if not exists public.resume_batch_items (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.resume_batches(id) on delete cascade,
  company text,
  role text,
  jd_url text,
  jd_text text,
  keywords text[],
  resume_version_id uuid,   -- tailored version created per JD
  ats_score numeric,
  status text default 'queued', -- queued|processing|done|failed
  error text,
  assets jsonb default '{}'::jsonb, -- {resumePdf, coverPdf, emailTxt, inmailTxt}
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for batch items
create index if not exists idx_batch_items_batch on public.resume_batch_items(batch_id);

-- Create index for user batches
create index if not exists idx_batches_user on public.resume_batches(user_id);

-- Create index for batch status
create index if not exists idx_batches_status on public.resume_batches(status);

-- Create index for batch item status
create index if not exists idx_batch_items_status on public.resume_batch_items(status);

-- Add RLS policies
alter table public.resume_batches enable row level security;
alter table public.resume_batch_items enable row level security;

-- Policy for resume_batches: users can only access their own batches
create policy "Users can access their own batches" on public.resume_batches
  for all using (auth.uid() = user_id);

-- Policy for resume_batch_items: users can only access items from their own batches
create policy "Users can access their own batch items" on public.resume_batch_items
  for all using (
    batch_id in (
      select id from public.resume_batches where user_id = auth.uid()
    )
  );
