-- ============================================================================
-- DevCraft — Seed data & admin bootstrap (edit before running in production)
-- ============================================================================

-- Sample problem statements -------------------------------------------------
insert into public.problem_statements (code, title, description, track) values
  ('PS01', 'Smart Campus Navigation',
   'Build a system that helps students navigate large campuses, find rooms, and discover events in real time.',
   'Web / Mobile'),
  ('PS02', 'AI Study Companion',
   'Design an AI-powered assistant that helps learners summarise notes, generate quizzes, and track progress.',
   'AI / ML'),
  ('PS03', 'Sustainable Living Tracker',
   'Create an app that gamifies sustainable habits and measures a user''s environmental impact.',
   'Open Innovation')
on conflict (code) do nothing;

-- Allow-list seed -----------------------------------------------------------
-- Replace these with the real registration numbers permitted to register,
-- or manage them later from the Admin panel.
insert into public.allowed_users (registration_number, full_name) values
  ('REG001', 'Test User One'),
  ('REG002', 'Test User Two'),
  ('REG003', 'Test User Three')
on conflict (registration_number) do nothing;

-- Admin bootstrap -----------------------------------------------------------
-- After you register your own account through the website, run ONE of these
-- to grant yourself admin access:
--
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'mayank.k@worldhire.com');
--
-- (You must also add your registration number to allowed_users first so you
--  can register.)
