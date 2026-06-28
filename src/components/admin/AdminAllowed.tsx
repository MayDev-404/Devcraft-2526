"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AllowedUser } from "@/lib/types";

export default function AdminAllowed({ initial }: { initial: AllowedUser[] }) {
  const [rows, setRows] = useState(initial);
  const [reg, setReg] = useState("");
  const [name, setName] = useState("");
  const [bulk, setBulk] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const supabase = createClient();

  async function addOne(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const registration_number = reg.trim();
    const { data, error: err } = await supabase
      .from("allowed_users")
      .upsert(
        { registration_number, full_name: name.trim() || null },
        { onConflict: "registration_number" }
      )
      .select()
      .single();
    setBusy(false);
    if (err) return setError(err.message);
    setRows((prev) => [
      data as AllowedUser,
      ...prev.filter((r) => r.registration_number !== registration_number),
    ]);
    setReg("");
    setName("");
  }

  async function addBulk() {
    setError(null);
    setBusy(true);
    const entries = bulk
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((registration_number) => ({ registration_number }));
    if (entries.length === 0) {
      setBusy(false);
      return;
    }
    const { data, error: err } = await supabase
      .from("allowed_users")
      .upsert(entries, { onConflict: "registration_number" })
      .select();
    setBusy(false);
    if (err) return setError(err.message);
    const added = (data as AllowedUser[]) ?? [];
    const addedKeys = new Set(added.map((a) => a.registration_number));
    setRows((prev) => [
      ...added,
      ...prev.filter((r) => !addedKeys.has(r.registration_number)),
    ]);
    setBulk("");
  }

  async function remove(registration_number: string) {
    if (!confirm(`Remove ${registration_number} from the allow-list?`)) return;
    setError(null);
    const { error: err } = await supabase
      .from("allowed_users")
      .delete()
      .eq("registration_number", registration_number);
    if (err) return setError(err.message);
    setRows((prev) =>
      prev.filter((r) => r.registration_number !== registration_number)
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-6">
        <form onSubmit={addOne} className="card space-y-3">
          <h3 className="font-semibold">Add a registration number</h3>
          <div>
            <label className="label">Registration number</label>
            <input
              className="input"
              value={reg}
              onChange={(e) => setReg(e.target.value)}
              required
              placeholder="REG004"
            />
          </div>
          <div>
            <label className="label">Name (optional)</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <button disabled={busy} className="btn-primary w-full">
            Add to allow-list
          </button>
        </form>

        <div className="card space-y-3">
          <h3 className="font-semibold">Bulk add</h3>
          <p className="text-sm text-muted">
            Paste registration numbers separated by commas or new lines.
          </p>
          <textarea
            className="input min-h-28"
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder={"REG010\nREG011\nREG012"}
          />
          <button onClick={addBulk} disabled={busy} className="btn-ghost w-full">
            Add all
          </button>
        </div>
      </div>

      <div>
        {error && (
          <p className="mb-3 rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        <div className="mb-3">
          <span className="badge">Allowed: {rows.length}</span>
        </div>
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Reg no.</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {rows.map((r) => (
                <tr key={r.registration_number}>
                  <td className="px-4 py-3 font-mono text-xs">
                    {r.registration_number}
                  </td>
                  <td className="px-4 py-3 text-muted">{r.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(r.registration_number)}
                      className="text-xs text-[var(--danger)] hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted">
                    No registration numbers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
