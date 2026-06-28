-- ============================================================================
-- DevCraft Hackathon — Schema
-- ============================================================================
-- Tables: allowed_users, problem_statements, profiles, teams, submissions
-- Note on circular FK: profiles.team_id <-> teams.leader_id. We create the
-- columns first and add the cross-referencing FK at the end.
-- ============================================================================

-- Allowlist of registration numbers permitted to register. Admin-managed.
create table if not exists public.allowed_users (
  registration_number text primary key,
  full_name           text,
  note                text,
  created_at          timestamptz not null default now()
);

-- Hackathon problem statements (publicly visible).
create table if not exists public.problem_statements (
  id          uuid primary key default gen_random_uuid(),
  code        text unique,                 -- e.g. "PS01"
  title       text not null,
  description text not null,
  track       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- One profile per authenticated user.
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  full_name           text not null,
  registration_number text not null unique,
  learner_email       text not null,
  personal_email      text not null,
  phone               text not null,
  is_iste_member      boolean not null default false,
  is_admin            boolean not null default false,
  team_id             uuid,                -- FK added after teams is created
  role                text not null default 'member' check (role in ('leader','member')),
  created_at          timestamptz not null default now()
);

-- Teams. Created by a leader; 2-4 members enforced in RPCs.
create table if not exists public.teams (
  id                   uuid primary key default gen_random_uuid(),
  team_code            text not null unique,            -- the join "team ID"
  name                 text not null,
  leader_id            uuid not null references public.profiles(id) on delete cascade,
  problem_statement_id uuid references public.problem_statements(id) on delete set null,
  created_at           timestamptz not null default now()
);

-- Now wire the profiles -> teams FK.
alter table public.profiles
  add constraint profiles_team_id_fkey
  foreign key (team_id) references public.teams(id) on delete set null;

create index if not exists idx_profiles_team_id on public.profiles(team_id);

-- One submission record per team (leader edits it).
create table if not exists public.submissions (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null unique references public.teams(id) on delete cascade,
  title        text,
  description  text,
  repo_url     text,
  demo_url     text,
  submitted_by uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
