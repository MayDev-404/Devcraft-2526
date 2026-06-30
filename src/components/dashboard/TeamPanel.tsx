"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { rpcErrorMessage } from "@/lib/errors";
import { MAX_TEAM_SIZE, MIN_TEAM_SIZE } from "@/lib/types";
import type { Profile, ProblemStatement, Submission, Team } from "@/lib/types";

// Only accept http(s) URLs in the submission link fields.
function isValidUrl(raw: string): boolean {
  const v = raw.trim();
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function TeamPanel({
  team,
  members,
  currentUserId,
  isLeader,
  submission,
  problem,
  problemList,
  submissionsOpen,
}: {
  team: Team;
  members: Profile[];
  currentUserId: string;
  isLeader: boolean;
  submission: Submission | null;
  problem: ProblemStatement | null;
  problemList: ProblemStatement[];
  submissionsOpen: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const supabase = createClient();

  async function copyCode() {
    await navigator.clipboard.writeText(team.team_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function leaveTeam() {
    if (!confirm("Leave this team?")) return;
    setError(null);
    const { error: err } = await supabase.rpc("leave_team");
    if (err) return setError(rpcErrorMessage(err.message));
    router.refresh();
  }

  async function removeMember(id: string) {
    if (!confirm("Remove this member from the team?")) return;
    setError(null);
    const { error: err } = await supabase.rpc("remove_member", {
      member_id: id,
    });
    if (err) return setError(rpcErrorMessage(err.message));
    router.refresh();
  }

  const underMin = members.length < MIN_TEAM_SIZE;

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {/* Team header */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{team.name}</h2>
              <span className="badge">
                {members.length}/{MAX_TEAM_SIZE} members
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {isLeader ? "You are the team leader." : "You are a team member."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted">Team ID</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="rounded-md bg-[var(--surface-2)] px-3 py-1.5 text-lg font-bold tracking-widest text-[var(--brand-2)]">
                {team.team_code}
              </code>
              <button onClick={copyCode} className="btn-ghost px-3 py-1.5 text-xs">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {underMin && (
          <p className="mt-4 rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/5 px-3 py-2 text-sm text-muted">
            Share your Team ID to add at least {MIN_TEAM_SIZE - members.length} more
            member{MIN_TEAM_SIZE - members.length > 1 ? "s" : ""} — teams need {MIN_TEAM_SIZE}–{MAX_TEAM_SIZE} members.
          </p>
        )}
      </div>

      {/* Members */}
      <div className="card">
        <h3 className="text-lg font-semibold">Members</h3>
        <ul className="mt-4 divide-y divide-[var(--border)]">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">
                  {m.full_name}
                  {m.id === currentUserId && (
                    <span className="ml-2 text-xs text-muted">(you)</span>
                  )}
                </p>
                <p className="text-xs text-muted">
                  {m.registration_number} · {m.learner_email}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`badge ${
                    m.role === "leader"
                      ? "border-[var(--brand)]/40 text-[var(--brand-2)]"
                      : ""
                  }`}
                >
                  {m.role}
                </span>
                {isLeader && m.id !== currentUserId && (
                  <button
                    onClick={() => removeMember(m.id)}
                    className="text-xs text-[var(--danger)] hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Problem statement */}
      <ProblemSection
        isLeader={isLeader}
        team={team}
        problem={problem}
        problemList={problemList}
      />

      {/* Submission */}
      <SubmissionSection
        isLeader={isLeader}
        teamId={team.id}
        currentUserId={currentUserId}
        submission={submission}
        hasProblem={!!team.problem_statement_id}
        submissionsOpen={submissionsOpen}
        memberCount={members.length}
      />

      {/* Leave team */}
      <div className="flex justify-end">
        <button onClick={leaveTeam} className="btn-ghost text-[var(--danger)]">
          Leave team
        </button>
      </div>
    </div>
  );
}

function ProblemSection({
  isLeader,
  team,
  problem,
  problemList,
}: {
  isLeader: boolean;
  team: Team;
  problem: ProblemStatement | null;
  problemList: ProblemStatement[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(team.problem_statement_id ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("teams")
      .update({ problem_statement_id: selected || null })
      .eq("id", team.id);
    setSaving(false);
    if (err) return setError(err.message);
    router.refresh();
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold">Problem statement</h3>

      {!isLeader ? (
        <div className="mt-3">
          {problem ? (
            <div>
              <p className="font-medium">{problem.title}</p>
              <p className="mt-1 text-sm text-muted">{problem.description}</p>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Your team leader hasn&apos;t selected a problem statement yet.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-muted">
            As the leader, choose the challenge your team will tackle.
          </p>
          <select
            className="input"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">— Select a problem statement —</option>
            {problemList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code ? `${p.code} — ` : ""}
                {p.title}
              </option>
            ))}
          </select>
          {selected && (
            <p className="text-sm text-muted">
              {problemList.find((p) => p.id === selected)?.description}
            </p>
          )}
          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
          <button
            onClick={save}
            disabled={saving || selected === (team.problem_statement_id ?? "")}
            className="btn-primary"
          >
            {saving ? "Saving…" : "Save selection"}
          </button>
        </div>
      )}
    </div>
  );
}

function SubmissionSection({
  isLeader,
  teamId,
  currentUserId,
  submission,
  hasProblem,
  submissionsOpen,
  memberCount,
}: {
  isLeader: boolean;
  teamId: string;
  currentUserId: string;
  submission: Submission | null;
  hasProblem: boolean;
  submissionsOpen: boolean;
  memberCount: number;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: submission?.title ?? "",
    description: submission?.description ?? "",
    repo_url: submission?.repo_url ?? "",
    demo_url: submission?.demo_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaved(false);
    setError(null);

    // Client-side validation (also enforced in the DB via trigger + RLS).
    if (memberCount < MIN_TEAM_SIZE) {
      return setError(
        `Your team needs at least ${MIN_TEAM_SIZE} members before you can submit.`
      );
    }
    if (!form.title.trim()) {
      return setError("Please add a project title.");
    }
    if (!form.description.trim()) {
      return setError("Please add a project description.");
    }
    if (!isValidUrl(form.repo_url)) {
      return setError("Enter a valid repository URL (must start with https://).");
    }
    if (!isValidUrl(form.demo_url)) {
      return setError("Enter a valid demo URL (must start with https://).");
    }

    setSaving(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("submissions").upsert(
      {
        team_id: teamId,
        title: form.title.trim(),
        description: form.description.trim(),
        repo_url: form.repo_url.trim(),
        demo_url: form.demo_url.trim(),
        submitted_by: currentUserId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "team_id" }
    );
    setSaving(false);
    if (err) return setError(rpcErrorMessage(err.message));
    setSaved(true);
    router.refresh();
  }

  // Leaders may edit only while submissions are open AND the team meets the
  // minimum size. Everyone else (and leaders otherwise) see a read-only view.
  const teamTooSmall = memberCount < MIN_TEAM_SIZE;
  const canEdit = isLeader && submissionsOpen && !teamTooSmall;

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Submission</h3>
        <span
          className={`badge ${
            submissionsOpen
              ? "border-[var(--success)]/40 text-[var(--success)]"
              : "text-[var(--danger)]"
          }`}
        >
          {submissionsOpen ? "Open" : "Closed"}
        </span>
      </div>

      {!canEdit ? (
        <div className="mt-3 space-y-3">
          {isLeader && !submissionsOpen && (
            <p className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2 text-sm text-muted">
              Submissions are currently closed. You&apos;ll be able to add or edit
              your project here once the organisers open them.
            </p>
          )}
          {isLeader && submissionsOpen && teamTooSmall && (
            <p className="rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/5 px-3 py-2 text-sm text-muted">
              You need at least {MIN_TEAM_SIZE} team members before you can submit.
              Share your Team ID to add{" "}
              {MIN_TEAM_SIZE - memberCount} more.
            </p>
          )}
          {submission?.title ? (
            <div className="space-y-1 text-sm">
              <p className="font-medium">{submission.title}</p>
              <p className="text-muted">{submission.description}</p>
              {submission.repo_url && (
                <p className="text-[var(--brand-2)]">{submission.repo_url}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">
              {isLeader
                ? "No submission added yet."
                : "Your team leader hasn't added a submission yet."}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-4">
          {!hasProblem && (
            <p className="rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/5 px-3 py-2 text-sm text-muted">
              Tip: select a problem statement above before submitting.
            </p>
          )}
          <div>
            <label className="label">
              Project title <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="DevCraft Navigator"
            />
          </div>
          <div>
            <label className="label">
              Description <span className="text-[var(--danger)]">*</span>
            </label>
            <textarea
              className="input min-h-24"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What you built and how it works."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">
                Repository URL <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="url"
                inputMode="url"
                className="input"
                value={form.repo_url}
                onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
                placeholder="https://github.com/…"
              />
              <p className="mt-1 text-xs text-muted">
                Must be a valid link starting with https://
              </p>
            </div>
            <div>
              <label className="label">
                Demo / video URL <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="url"
                inputMode="url"
                className="input"
                value={form.demo_url}
                onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                placeholder="https://…"
              />
              <p className="mt-1 text-xs text-muted">
                Must be a valid link starting with https://
              </p>
            </div>
          </div>
          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
          {saved && (
            <p className="text-sm text-[var(--success)]">Submission saved.</p>
          )}
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving
              ? "Saving…"
              : submission
                ? "Update submission"
                : "Submit solution"}
          </button>
        </div>
      )}
    </div>
  );
}
