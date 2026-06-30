"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AppSettings } from "@/lib/types";

// Supabase returns a PostgrestError object (not an Error instance), so pull the
// message off whatever we get and fall back gracefully.
function errMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string" && m) return m;
  }
  return fallback;
}

// ISO (UTC) -> value for <input type="datetime-local"> in the admin's local time.
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(
    d.getHours()
  )}:${p(d.getMinutes())}`;
}

export default function AdminSettings({
  initial,
}: {
  initial: Pick<AppSettings, "submissions_open" | "event_start">;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [submissionsOpen, setSubmissionsOpen] = useState(initial.submissions_open);
  const [eventStart, setEventStart] = useState(toLocalInput(initial.event_start));
  const [savedStart, setSavedStart] = useState(toLocalInput(initial.event_start));

  const [togglingSub, setTogglingSub] = useState(false);
  const [savingDate, setSavingDate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function update(patch: Partial<AppSettings>) {
    // upsert on the singleton row so this works even if the seed row is absent.
    const { error: err } = await supabase
      .from("app_settings")
      .upsert(
        { id: true, ...patch, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
    if (err) throw err;
  }

  async function toggleSubmissions() {
    const next = !submissionsOpen;
    setTogglingSub(true);
    setError(null);
    setNotice(null);
    try {
      await update({ submissions_open: next });
      setSubmissionsOpen(next);
      setNotice(
        next ? "Submissions are now open." : "Submissions are now closed."
      );
      router.refresh();
    } catch (e) {
      setError(errMessage(e, "Could not update setting."));
    } finally {
      setTogglingSub(false);
    }
  }

  async function saveDate() {
    setSavingDate(true);
    setError(null);
    setNotice(null);
    try {
      // datetime-local has no timezone; new Date(local) reads it as local time
      // and toISOString() stores the correct UTC instant.
      const iso = eventStart ? new Date(eventStart).toISOString() : null;
      await update({ event_start: iso });
      setSavedStart(eventStart);
      setNotice(
        iso ? "Hackathon start time saved." : "Start time cleared."
      );
      router.refresh();
    } catch (e) {
      setError(errMessage(e, "Could not save the date."));
    } finally {
      setSavingDate(false);
    }
  }

  return (
    <div className="grid max-w-3xl gap-6">
      {error && (
        <p className="rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-lg border border-[var(--success)]/40 bg-[var(--success)]/10 px-3 py-2 text-sm text-[var(--success)]">
          {notice}
        </p>
      )}

      {/* Submissions toggle */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">Submissions</h3>
            <p className="mt-1 text-sm text-muted">
              When closed, team leaders cannot create or edit their project
              submission. Enforced in the database, not just the UI.
            </p>
            <p className="mt-3">
              <span
                className={`badge ${
                  submissionsOpen
                    ? "border-[var(--success)]/40 text-[var(--success)]"
                    : "text-[var(--danger)]"
                }`}
              >
                {submissionsOpen ? "Open" : "Closed"}
              </span>
            </p>
          </div>
          <button
            onClick={toggleSubmissions}
            disabled={togglingSub}
            role="switch"
            aria-checked={submissionsOpen}
            aria-label="Toggle submissions"
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
              submissionsOpen ? "bg-[var(--brand)]" : "bg-[var(--surface-2)]"
            } disabled:opacity-50`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                submissionsOpen ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Event start date/time */}
      <div className="card space-y-3">
        <div>
          <h3 className="font-semibold">Hackathon start</h3>
          <p className="mt-1 text-sm text-muted">
            Drives the countdown on the home page. Enter the date and time in
            your local timezone. Leave empty to show “Dates to be announced”.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="grow">
            <label className="label">Start date &amp; time</label>
            <input
              type="datetime-local"
              className="input"
              value={eventStart}
              onChange={(e) => setEventStart(e.target.value)}
            />
          </div>
          <button
            onClick={saveDate}
            disabled={savingDate || eventStart === savedStart}
            className="btn-primary"
          >
            {savingDate ? "Saving…" : "Save"}
          </button>
          {eventStart && (
            <button
              onClick={() => setEventStart("")}
              className="btn-ghost"
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
