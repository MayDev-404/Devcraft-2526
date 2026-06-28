"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { rpcErrorMessage } from "@/lib/errors";

export default function CreateJoinTeam() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createTeam(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy("create");
    const supabase = createClient();
    const { error: err } = await supabase.rpc("create_team", {
      team_name: teamName.trim(),
    });
    setBusy(null);
    if (err) {
      setError(rpcErrorMessage(err.message));
      return;
    }
    router.refresh();
  }

  async function joinTeam(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy("join");
    const supabase = createClient();
    const { error: err } = await supabase.rpc("join_team", {
      code: joinCode.trim().toUpperCase(),
    });
    setBusy(null);
    if (err) {
      setError(rpcErrorMessage(err.message));
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create */}
        <form onSubmit={createTeam} className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Create a team</h2>
            <p className="mt-1 text-sm text-muted">
              You&apos;ll become the team leader and get a team ID to share.
            </p>
          </div>
          <div>
            <label className="label">Team name</label>
            <input
              className="input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              placeholder="The Code Wizards"
            />
          </div>
          <button
            type="submit"
            disabled={busy !== null}
            className="btn-primary w-full"
          >
            {busy === "create" ? "Creating…" : "Create team"}
          </button>
        </form>

        {/* Join */}
        <form onSubmit={joinTeam} className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Join a team</h2>
            <p className="mt-1 text-sm text-muted">
              Enter the team ID your leader shared with you.
            </p>
          </div>
          <div>
            <label className="label">Team ID</label>
            <input
              className="input uppercase tracking-widest"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              required
              maxLength={6}
              placeholder="ABC123"
            />
          </div>
          <button
            type="submit"
            disabled={busy !== null}
            className="btn-ghost w-full"
          >
            {busy === "join" ? "Joining…" : "Join team"}
          </button>
        </form>
      </div>
    </div>
  );
}
