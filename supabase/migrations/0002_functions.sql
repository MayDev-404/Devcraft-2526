-- ============================================================================
-- DevCraft — Functions, triggers, and RPCs
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER so they bypass RLS and avoid recursion
-- inside policies).
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.my_team_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select team_id from public.profiles where id = auth.uid();
$$;

-- Public-facing pre-check used by the registration form for a friendly message.
-- Returns true if the registration number is on the allowlist and unused.
create or replace function public.is_registration_allowed(reg_number text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.allowed_users a where a.registration_number = reg_number)
     and not exists (select 1 from public.profiles p where p.registration_number = reg_number);
$$;

-- ---------------------------------------------------------------------------
-- New-user trigger: creates the profile from signup metadata and enforces the
-- allowlist gate atomically. If the registration number is not allowed, the
-- whole signup is aborted.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reg text := new.raw_user_meta_data ->> 'registration_number';
begin
  if reg is null or length(trim(reg)) = 0 then
    raise exception 'registration_number is required';
  end if;

  if not exists (select 1 from public.allowed_users where registration_number = reg) then
    raise exception 'REG_NOT_ALLOWED: registration number % is not on the allow-list', reg;
  end if;

  if exists (select 1 from public.profiles where registration_number = reg) then
    raise exception 'REG_TAKEN: registration number % is already registered', reg;
  end if;

  insert into public.profiles (
    id, full_name, registration_number, learner_email,
    personal_email, phone, is_iste_member
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    reg,
    coalesce(new.raw_user_meta_data ->> 'learner_email', new.email),
    coalesce(new.raw_user_meta_data ->> 'personal_email', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce((new.raw_user_meta_data ->> 'is_iste_member')::boolean, false)
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Team RPCs (SECURITY DEFINER for atomic size/leader enforcement).
-- ---------------------------------------------------------------------------

-- Generate a short, readable, unique team code.
create or replace function public.gen_team_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no ambiguous chars
  code text;
  i int;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.teams where team_code = code);
  end loop;
  return code;
end;
$$;

-- Create a team. Caller becomes the leader. Fails if already on a team.
create or replace function public.create_team(team_name text)
returns public.teams
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  new_team public.teams;
begin
  if uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if team_name is null or length(trim(team_name)) = 0 then
    raise exception 'TEAM_NAME_REQUIRED';
  end if;
  if (select team_id from public.profiles where id = uid) is not null then
    raise exception 'ALREADY_ON_TEAM';
  end if;

  insert into public.teams (team_code, name, leader_id)
  values (public.gen_team_code(), trim(team_name), uid)
  returning * into new_team;

  update public.profiles
    set team_id = new_team.id, role = 'leader'
    where id = uid;

  return new_team;
end;
$$;

-- Join a team by its code. Enforces max size of 4.
create or replace function public.join_team(code text)
returns public.teams
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  t public.teams;
  member_count int;
begin
  if uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if (select team_id from public.profiles where id = uid) is not null then
    raise exception 'ALREADY_ON_TEAM';
  end if;

  select * into t from public.teams where team_code = upper(trim(code));
  if t.id is null then
    raise exception 'TEAM_NOT_FOUND';
  end if;

  select count(*) into member_count from public.profiles where team_id = t.id;
  if member_count >= 4 then
    raise exception 'TEAM_FULL';
  end if;

  update public.profiles
    set team_id = t.id, role = 'member'
    where id = uid;

  return t;
end;
$$;

-- Leave the current team. If the leader leaves, the team is disbanded unless
-- they hand over leadership first (handled in UI). Here: leader cannot leave
-- while other members remain.
create or replace function public.leave_team()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  my_team uuid;
  is_leader boolean;
  others int;
begin
  select team_id, (role = 'leader') into my_team, is_leader
    from public.profiles where id = uid;
  if my_team is null then
    raise exception 'NOT_ON_TEAM';
  end if;

  select count(*) into others from public.profiles
    where team_id = my_team and id <> uid;

  if is_leader and others > 0 then
    raise exception 'LEADER_MUST_TRANSFER';
  end if;

  update public.profiles set team_id = null, role = 'member' where id = uid;

  -- If the leader was the last member, remove the now-empty team.
  if is_leader and others = 0 then
    delete from public.teams where id = my_team;
  end if;
end;
$$;

-- Leader removes a member from their team.
create or replace function public.remove_member(member_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  my_team uuid;
begin
  select id into my_team from public.teams
    where leader_id = uid
      and id = (select team_id from public.profiles where id = member_id);
  if my_team is null then
    raise exception 'NOT_TEAM_LEADER_OR_MEMBER';
  end if;
  if member_id = uid then
    raise exception 'CANNOT_REMOVE_SELF';
  end if;
  update public.profiles set team_id = null, role = 'member' where id = member_id;
end;
$$;
