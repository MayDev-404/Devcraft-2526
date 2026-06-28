"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export default function AdminUsers({
  initialUsers,
  currentUserId,
}: {
  initialUsers: Profile[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.full_name.toLowerCase().includes(q) ||
        u.registration_number.toLowerCase().includes(q) ||
        u.learner_email.toLowerCase().includes(q) ||
        u.personal_email.toLowerCase().includes(q)
    );
  }, [users, query]);

  async function toggleAdmin(u: Profile) {
    setError(null);
    const next = !u.is_admin;
    const { error: err } = await supabase
      .from("profiles")
      .update({ is_admin: next })
      .eq("id", u.id);
    if (err) return setError(err.message);
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, is_admin: next } : x))
    );
  }

  async function removeUser(u: Profile) {
    if (
      !confirm(
        `Delete ${u.full_name}'s profile? This frees their registration number but does not delete their auth login.`
      )
    )
      return;
    setError(null);
    const { error: err } = await supabase.from("profiles").delete().eq("id", u.id);
    if (err) return setError(err.message);
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <span className="badge">Total: {users.length}</span>
          <span className="badge">
            ISTE: {users.filter((u) => u.is_iste_member).length}
          </span>
          <span className="badge">
            On a team: {users.filter((u) => u.team_id).length}
          </span>
        </div>
        <input
          className="input max-w-xs"
          placeholder="Search name, reg no, email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Reg no.</th>
              <th className="px-4 py-3">Emails</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">ISTE</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--surface-2)]/40">
                <td className="px-4 py-3 font-medium">
                  {u.full_name}
                  {u.id === currentUserId && (
                    <span className="ml-1 text-xs text-muted">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {u.registration_number}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  <div>{u.learner_email}</div>
                  <div>{u.personal_email}</div>
                </td>
                <td className="px-4 py-3 text-xs">{u.phone}</td>
                <td className="px-4 py-3">
                  {u.is_iste_member ? (
                    <span className="text-[var(--success)]">Yes</span>
                  ) : (
                    <span className="text-muted">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.is_admin ? (
                    <span className="badge border-[var(--brand)]/40 text-[var(--brand-2)]">
                      admin
                    </span>
                  ) : (
                    <span className="text-muted">user</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => toggleAdmin(u)}
                      disabled={u.id === currentUserId}
                      className="text-xs text-[var(--brand-2)] hover:underline disabled:opacity-40"
                    >
                      {u.is_admin ? "Revoke admin" : "Make admin"}
                    </button>
                    <button
                      onClick={() => removeUser(u)}
                      disabled={u.id === currentUserId}
                      className="text-xs text-[var(--danger)] hover:underline disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
