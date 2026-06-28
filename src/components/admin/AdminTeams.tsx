"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, ProblemStatement, Submission, Team } from "@/lib/types";

export type TeamRow = {
  team: Team;
  members: Profile[];
  problem: ProblemStatement | null;
  submission: Submission | null;
};

export default function AdminTeams({
  initialRows,
}: {
  initialRows: TeamRow[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function deleteTeam(t: Team) {
    if (
      !confirm(
        `Delete team "${t.name}"? Members will be released and the submission removed.`
      )
    )
      return;
    setError(null);
    const { error: err } = await supabase.from("teams").delete().eq("id", t.id);
    if (err) return setError(err.message);
    setRows((prev) => prev.filter((r) => r.team.id !== t.id));
  }

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <span className="badge">Teams: {rows.length}</span>
        <span className="badge">
          With submission: {rows.filter((r) => r.submission?.title).length}
        </span>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <div className="card text-muted">No teams have been created yet.</div>
      ) : (
        <div className="space-y-4">
          {rows.map(({ team, members, problem, submission }) => (
            <div key={team.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <code className="rounded bg-[var(--surface-2)] px-2 py-0.5 text-xs tracking-widest text-[var(--brand-2)]">
                      {team.team_code}
                    </code>
                    <span className="badge">{members.length}/4</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    Problem:{" "}
                    {problem ? (
                      <span className="text-foreground">
                        {problem.code ? `${problem.code} — ` : ""}
                        {problem.title}
                      </span>
                    ) : (
                      "not selected"
                    )}
                  </p>
                </div>
                <button
                  onClick={() => deleteTeam(team)}
                  className="text-xs text-[var(--danger)] hover:underline"
                >
                  Delete team
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">
                    Members
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {members.map((m) => (
                      <li key={m.id} className="flex justify-between">
                        <span>
                          {m.full_name}{" "}
                          <span className="text-xs text-muted">
                            ({m.registration_number})
                          </span>
                        </span>
                        <span
                          className={
                            m.role === "leader"
                              ? "text-xs text-[var(--brand-2)]"
                              : "text-xs text-muted"
                          }
                        >
                          {m.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">
                    Submission
                  </p>
                  {submission?.title ? (
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="font-medium">{submission.title}</p>
                      {submission.description && (
                        <p className="text-muted">{submission.description}</p>
                      )}
                      {submission.repo_url && (
                        <a
                          href={submission.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[var(--brand-2)] hover:underline"
                        >
                          {submission.repo_url}
                        </a>
                      )}
                      {submission.demo_url && (
                        <a
                          href={submission.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[var(--brand-2)] hover:underline"
                        >
                          {submission.demo_url}
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No submission yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
