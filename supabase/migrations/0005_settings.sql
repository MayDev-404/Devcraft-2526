-- ============================================================================
-- DevCraft — App settings (admin-editable, no redeploy needed)
-- ============================================================================
-- A single-row settings table holding event-wide toggles:
--   * submissions_open — whether team leaders may create/edit submissions
--   * event_start      — hackathon start timestamp (drives the hero countdown)
-- ============================================================================

create table if not exists public.app_settings (
  id               boolean primary key default true,
  submissions_open boolean not null default false,
  event_start      timestamptz,
  updated_at       timestamptz not null default now(),
  -- Singleton guard: only one row (id = true) can ever exist.
  constraint app_settings_singleton check (id)
);

-- Seed the single row.
insert into public.app_settings (id) values (true)
  on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Helper: are submissions currently open? SECURITY DEFINER so it can be used
-- inside the submissions RLS policy without recursion.
-- ---------------------------------------------------------------------------
create or replace function public.submissions_open()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select submissions_open from public.app_settings where id), false);
$$;

-- ---------------------------------------------------------------------------
-- RLS: anyone may read settings (countdown + submission status are public);
-- only admins may change them.
-- ---------------------------------------------------------------------------
alter table public.app_settings enable row level security;

drop policy if exists app_settings_public_read on public.app_settings;
create policy app_settings_public_read on public.app_settings
  for select using (true);

drop policy if exists app_settings_admin_write on public.app_settings;
create policy app_settings_admin_write on public.app_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Enforce the submissions toggle at the database level (defense in depth):
-- leaders may only write submissions while submissions are open; admins always.
-- ---------------------------------------------------------------------------
drop policy if exists submissions_leader_write on public.submissions;
create policy submissions_leader_write on public.submissions
  for all using (
    public.is_admin()
    or (
      public.submissions_open()
      and team_id in (select id from public.teams where leader_id = auth.uid())
    )
  ) with check (
    public.is_admin()
    or (
      public.submissions_open()
      and team_id in (select id from public.teams where leader_id = auth.uid())
    )
  );
