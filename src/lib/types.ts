// Hand-written DB types. Regenerate with the Supabase CLI once your schema is
// live if you prefer: `supabase gen types typescript --linked`.

export type Profile = {
  id: string;
  full_name: string;
  registration_number: string;
  learner_email: string;
  personal_email: string;
  phone: string;
  is_iste_member: boolean;
  is_admin: boolean;
  team_id: string | null;
  role: "leader" | "member";
  created_at: string;
};

export type Team = {
  id: string;
  team_code: string;
  name: string;
  leader_id: string;
  problem_statement_id: string | null;
  created_at: string;
};

export type ProblemStatement = {
  id: string;
  code: string | null;
  title: string;
  description: string;
  track: string | null;
  is_active: boolean;
  created_at: string;
};

export type Submission = {
  id: string;
  team_id: string;
  title: string | null;
  description: string | null;
  repo_url: string | null;
  demo_url: string | null;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AllowedUser = {
  registration_number: string;
  full_name: string | null;
  note: string | null;
  created_at: string;
};

export type AppSettings = {
  id: boolean;
  submissions_open: boolean;
  event_start: string | null;
  updated_at: string;
};

export const MAX_TEAM_SIZE = 4;
export const MIN_TEAM_SIZE = 2;
