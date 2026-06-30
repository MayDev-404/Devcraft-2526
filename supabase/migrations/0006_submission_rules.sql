-- ============================================================================
-- DevCraft — Submission rules (defense in depth)
-- ============================================================================
-- Enforced for every write to public.submissions, regardless of client:
--   * the team must have at least MIN_TEAM_SIZE (2) members
--   * title and description are required (non-empty)
--   * repo_url and demo_url are required and must be http(s) URLs
-- One submission per team is already guaranteed by the UNIQUE(team_id) column.
-- The submissions_open gate lives in the RLS policy (migration 0005).
-- ============================================================================

create or replace function public.enforce_submission_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  member_count int;
begin
  select count(*) into member_count
  from public.profiles
  where team_id = new.team_id;

  if member_count < 2 then
    raise exception 'TEAM_TOO_SMALL';
  end if;

  if new.title is null or btrim(new.title) = '' then
    raise exception 'TITLE_REQUIRED';
  end if;

  if new.description is null or btrim(new.description) = '' then
    raise exception 'DESCRIPTION_REQUIRED';
  end if;

  if new.repo_url is null or btrim(new.repo_url) !~* '^https?://' then
    raise exception 'INVALID_REPO_URL';
  end if;

  if new.demo_url is null or btrim(new.demo_url) !~* '^https?://' then
    raise exception 'INVALID_DEMO_URL';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_submission_rules on public.submissions;
create trigger trg_enforce_submission_rules
  before insert or update on public.submissions
  for each row execute function public.enforce_submission_rules();
