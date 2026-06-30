-- ============================================================================
-- DevCraft — Separate "create" and "edit" gates for submissions
-- ============================================================================
-- Replaces the single submissions_open flag with two independent toggles:
--   * submissions_create_open — leaders may create their (first) submission
--   * submissions_edit_open   — leaders may edit an existing submission
-- Enforced via separate INSERT / UPDATE RLS policies on public.submissions.
-- ============================================================================

-- 1. Columns: rename the old flag to *_create_open, add *_edit_open ------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'app_settings'
      and column_name = 'submissions_open'
  ) then
    alter table public.app_settings
      rename column submissions_open to submissions_create_open;
  end if;
end $$;

alter table public.app_settings
  add column if not exists submissions_create_open boolean not null default false;
alter table public.app_settings
  add column if not exists submissions_edit_open boolean not null default false;

-- 2. Helper functions (SECURITY DEFINER, used inside the RLS policies) ---------
create or replace function public.submissions_create_open()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select submissions_create_open from public.app_settings where id), false);
$$;

create or replace function public.submissions_edit_open()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select submissions_edit_open from public.app_settings where id), false);
$$;

-- 3. Split the write policy into INSERT / UPDATE / DELETE ----------------------
-- Drop the old policy first so the helper it depends on can be removed.
drop policy if exists submissions_leader_write on public.submissions;

-- The old single-flag helper is no longer used.
drop function if exists public.submissions_open();

-- Create: leader of the team, only while creating is open (admins always).
create policy submissions_leader_insert on public.submissions
  for insert with check (
    public.is_admin()
    or (
      public.submissions_create_open()
      and team_id in (select id from public.teams where leader_id = auth.uid())
    )
  );

-- Edit: leader of the team, only while editing is open (admins always).
create policy submissions_leader_update on public.submissions
  for update using (
    public.is_admin()
    or (
      public.submissions_edit_open()
      and team_id in (select id from public.teams where leader_id = auth.uid())
    )
  ) with check (
    public.is_admin()
    or (
      public.submissions_edit_open()
      and team_id in (select id from public.teams where leader_id = auth.uid())
    )
  );

-- Delete: team leader or admin (not gated by the toggles).
create policy submissions_leader_delete on public.submissions
  for delete using (
    public.is_admin()
    or team_id in (select id from public.teams where leader_id = auth.uid())
  );
