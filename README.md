# DevCraft — Hackathon Registration

A full hackathon registration site built with **Next.js 16 (App Router)**,
**React 19**, **Tailwind CSS v4**, and **Supabase** (Postgres + Auth).

## Features

- **Public pages** — Landing, About, FAQ, Problem Statements.
- **Auth** — Register / Login. Registration collects name, registration number,
  learner email, personal email, phone, and ISTE membership (y/n).
- **Allow-list gate** — A registration only succeeds if the registration number
  exists in the `allowed_users` table (enforced at the database level).
- **Teams** — Create a team (you become the leader) or join one with a Team ID.
  Teams have **2–4 members**.
- **Leader-only powers** — Only the team leader can choose the problem statement
  and edit/submit the team's project.
- **Admin panel** (`/admin`) — Manage Users, Manage Teams, the Allow-list, and
  Problem Statements. Restricted to users with `is_admin = true`.

## Project structure

```
src/
  app/
    (marketing)/      Landing, About, FAQ, Problems (public)
    (auth)/           Login, Register
    dashboard/        Team dashboard (auth required)
    admin/            Admin panel (admin required)
  components/         UI + dashboard/admin client components
  lib/                Supabase clients, auth helpers, types
  proxy.ts            Session refresh + route protection (Next 16 "proxy")
supabase/
  migrations/         SQL: schema, functions/RPCs, RLS, seed
```

## Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a project, and note your
**Project URL** and **anon / publishable key** (Project Settings → API).

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the database migrations

In the Supabase dashboard → **SQL Editor**, run the files in
`supabase/migrations/` **in order**:

1. `0001_schema.sql`
2. `0002_functions.sql`
3. `0003_rls.sql`
4. `0004_seed.sql` (sample data — edit the allow-list & problem statements first)

> Prefer the CLI? `supabase link` then `supabase db push`.

### 4. Auth settings

For the smoothest experience during a hackathon, you can **disable email
confirmation** (Supabase → Authentication → Providers → Email → turn off
"Confirm email"). If you leave it on, users must click a confirmation link
before they can log in — the register page handles both cases.

### 5. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### 6. Make yourself an admin

1. Add your registration number to the allow-list (it's in `0004_seed.sql`, or
   add it later from the Admin → Allow-list tab once another admin exists).
2. Register through the site.
3. In the Supabase SQL Editor, run:

   ```sql
   update public.profiles set is_admin = true
   where id = (select id from auth.users where email = 'YOUR_LEARNER_EMAIL');
   ```

4. Reload — the **Admin** link appears in the header.

## How the gate works

- `is_registration_allowed(reg)` — a `SECURITY DEFINER` function the register
  form calls for a friendly pre-check.
- `handle_new_user()` — a trigger on `auth.users` that creates the profile and
  **aborts signup** if the registration number isn't on the allow-list. This is
  the authoritative enforcement, so the gate can't be bypassed from the client.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables.
4. Deploy. Add your Vercel URL to Supabase → Authentication → URL Configuration.

## Tech notes

- Row Level Security is enabled on every table; access rules live in
  `0003_rls.sql`. Helper functions (`is_admin()`, `my_team_id()`) are
  `SECURITY DEFINER` to avoid policy recursion.
- Team membership changes go through RPCs (`create_team`, `join_team`,
  `leave_team`, `remove_member`) so size limits and leader rules are atomic.
