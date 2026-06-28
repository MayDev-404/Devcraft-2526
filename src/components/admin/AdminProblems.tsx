"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProblemStatement } from "@/lib/types";

const empty = { code: "", title: "", description: "", track: "" };

export default function AdminProblems({
  initial,
}: {
  initial: ProblemStatement[];
}) {
  const [rows, setRows] = useState(initial);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const supabase = createClient();

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { data, error: err } = await supabase
      .from("problem_statements")
      .insert({
        code: form.code.trim() || null,
        title: form.title.trim(),
        description: form.description.trim(),
        track: form.track.trim() || null,
      })
      .select()
      .single();
    setBusy(false);
    if (err) return setError(err.message);
    setRows((prev) => [...prev, data as ProblemStatement]);
    setForm(empty);
  }

  async function toggleActive(p: ProblemStatement) {
    setError(null);
    const next = !p.is_active;
    const { error: err } = await supabase
      .from("problem_statements")
      .update({ is_active: next })
      .eq("id", p.id);
    if (err) return setError(err.message);
    setRows((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, is_active: next } : x))
    );
  }

  async function remove(p: ProblemStatement) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    setError(null);
    const { error: err } = await supabase
      .from("problem_statements")
      .delete()
      .eq("id", p.id);
    if (err) return setError(err.message);
    setRows((prev) => prev.filter((x) => x.id !== p.id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <form onSubmit={add} className="card h-fit space-y-3">
        <h3 className="font-semibold">Add a problem statement</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Code</label>
            <input
              className="input"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="PS04"
            />
          </div>
          <div>
            <label className="label">Track</label>
            <input
              className="input"
              value={form.track}
              onChange={(e) => setForm({ ...form, track: e.target.value })}
              placeholder="AI / ML"
            />
          </div>
        </div>
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Problem title"
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-28"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            placeholder="Describe the challenge…"
          />
        </div>
        <button disabled={busy} className="btn-primary w-full">
          {busy ? "Adding…" : "Add problem statement"}
        </button>
      </form>

      <div>
        {error && (
          <p className="mb-3 rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        {rows.length === 0 ? (
          <div className="card text-muted">No problem statements yet.</div>
        ) : (
          <div className="space-y-3">
            {rows.map((p) => (
              <div key={p.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {p.code && <span className="badge">{p.code}</span>}
                      {p.track && (
                        <span className="badge border-[var(--brand)]/40 text-[var(--brand-2)]">
                          {p.track}
                        </span>
                      )}
                      {!p.is_active && (
                        <span className="badge text-[var(--danger)]">hidden</span>
                      )}
                    </div>
                    <h4 className="mt-2 font-semibold">{p.title}</h4>
                    <p className="mt-1 text-sm text-muted">{p.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      onClick={() => toggleActive(p)}
                      className="text-xs text-[var(--brand-2)] hover:underline"
                    >
                      {p.is_active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="text-xs text-[var(--danger)] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
