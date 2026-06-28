import { createClient } from "@/lib/supabase/server";
import AdminTeams, { type TeamRow } from "@/components/admin/AdminTeams";
import type { Profile, ProblemStatement, Submission, Team } from "@/lib/types";

export default async function AdminTeamsPage() {
  const supabase = await createClient();

  const [teamsRes, profilesRes, psRes, subRes] = await Promise.all([
    supabase.from("teams").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*"),
    supabase.from("problem_statements").select("*"),
    supabase.from("submissions").select("*"),
  ]);

  const teams = (teamsRes.data as Team[]) ?? [];
  const profiles = (profilesRes.data as Profile[]) ?? [];
  const problems = (psRes.data as ProblemStatement[]) ?? [];
  const submissions = (subRes.data as Submission[]) ?? [];

  const rows: TeamRow[] = teams.map((t) => ({
    team: t,
    members: profiles.filter((p) => p.team_id === t.id),
    problem: problems.find((p) => p.id === t.problem_statement_id) ?? null,
    submission: submissions.find((s) => s.team_id === t.id) ?? null,
  }));

  return <AdminTeams initialRows={rows} />;
}
