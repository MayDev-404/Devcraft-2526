import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import CreateJoinTeam from "@/components/dashboard/CreateJoinTeam";
import TeamPanel from "@/components/dashboard/TeamPanel";
import type { Profile, ProblemStatement, Submission, Team } from "@/lib/types";

export const metadata = { title: "Dashboard · DevCraft" };

export default async function DashboardPage() {
  const { user, profile } = await requireProfile();
  const supabase = await createClient();

  // Profile should exist (created on signup). Guard just in case.
  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="card text-muted">
          We couldn&apos;t load your profile. Please sign out and back in, or
          contact the organisers.
        </div>
      </div>
    );
  }

  let team: Team | null = null;
  let members: Profile[] = [];
  let submission: Submission | null = null;
  let problem: ProblemStatement | null = null;

  if (profile.team_id) {
    const [teamRes, membersRes, subRes] = await Promise.all([
      supabase.from("teams").select("*").eq("id", profile.team_id).maybeSingle(),
      supabase
        .from("profiles")
        .select("*")
        .eq("team_id", profile.team_id)
        .order("role", { ascending: true }),
      supabase
        .from("submissions")
        .select("*")
        .eq("team_id", profile.team_id)
        .maybeSingle(),
    ]);
    team = teamRes.data;
    members = membersRes.data ?? [];
    submission = subRes.data;

    if (team?.problem_statement_id) {
      const { data } = await supabase
        .from("problem_statements")
        .select("*")
        .eq("id", team.problem_statement_id)
        .maybeSingle();
      problem = data;
    }
  }

  // Active problem statements for the leader's picker.
  const { data: problemList } = await supabase
    .from("problem_statements")
    .select("*")
    .eq("is_active", true)
    .order("code", { ascending: true });

  const isLeader = team?.leader_id === user.id;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {profile.full_name.split(" ")[0] || "there"} 👋
        </h1>
        <p className="mt-1 text-muted">
          {team
            ? "Manage your team and submission below."
            : "Create a team or join one to get started."}
        </p>
      </header>

      {team ? (
        <TeamPanel
          team={team}
          members={members}
          currentUserId={user.id}
          isLeader={isLeader}
          submission={submission}
          problem={problem}
          problemList={problemList ?? []}
        />
      ) : (
        <CreateJoinTeam />
      )}
    </div>
  );
}
