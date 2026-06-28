-- ============================================================================
-- DevCraft — Row Level Security
-- ============================================================================

alter table public.allowed_users      enable row level security;
alter table public.problem_statements enable row level security;
alter table public.profiles           enable row level security;
alter table public.teams              enable row level security;
alter table public.submissions        enable row level security;

-- ---------------------------------------------------------------------------
-- allowed_users — admin only (the gate check is done via SECURITY DEFINER fns)
-- ---------------------------------------------------------------------------
create policy allowed_users_admin_all on public.allowed_users
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- problem_statements — public read; admin write
-- ---------------------------------------------------------------------------
create policy ps_public_read on public.problem_statements
  for select using (true);
create policy ps_admin_write on public.problem_statements
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- profiles
--   read:  own profile, teammates, or admin
--   update: own profile, or admin
--   insert: only via handle_new_user() trigger (definer) -> no client policy
--   delete: admin only
-- ---------------------------------------------------------------------------
create policy profiles_read on public.profiles
  for select using (
    id = auth.uid()
    or (team_id is not null and team_id = public.my_team_id())
    or public.is_admin()
  );

create policy profiles_update_self on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy profiles_admin_update on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

create policy profiles_admin_delete on public.profiles
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- teams
--   read:  members of the team, or admin (joining is done via RPC by code)
--   update: leader only, or admin (e.g. choosing problem statement, rename)
--   insert/membership changes: via RPC (definer)
--   delete: leader or admin
-- ---------------------------------------------------------------------------
create policy teams_read on public.teams
  for select using (
    id = public.my_team_id()
    or leader_id = auth.uid()
    or public.is_admin()
  );

create policy teams_leader_update on public.teams
  for update using (leader_id = auth.uid() or public.is_admin())
  with check (leader_id = auth.uid() or public.is_admin());

create policy teams_delete on public.teams
  for delete using (leader_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- submissions
--   read:  team members or admin
--   write: team leader only, or admin
-- ---------------------------------------------------------------------------
create policy submissions_read on public.submissions
  for select using (team_id = public.my_team_id() or public.is_admin());

create policy submissions_leader_write on public.submissions
  for all using (
    public.is_admin()
    or team_id in (select id from public.teams where leader_id = auth.uid())
  ) with check (
    public.is_admin()
    or team_id in (select id from public.teams where leader_id = auth.uid())
  );
