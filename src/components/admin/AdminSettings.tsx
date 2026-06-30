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

type SettingsInitial = Pick<
  AppSettings,
  "submissions_create_open" | "submissions_edit_open" | "event_start"
>;

export default function AdminSettings({
  initial,
}: {
  initial: SettingsInitial;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [createOpen, setCreateOpen] = useState(initial.submissions_create_open);
  const [editOpen, setEditOpen] = useState(initial.submissions_edit_open);
  const [eventStart, setEventStart] = useState(toLocalInput(initial.event_start));
  const [savedStart, setSavedStart] = useState(toLocalInput(initial.event_start));

  const [busyKey, setBusyKey] = useState<string | null>(null);
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

  async function toggle(
    key: "submissions_create_open" | "submissions_edit_open",
    current: boolean,
    setLocal: (v: boolean) => void,
    label: string
  ) {
    const next = !current;
    setBusyKey(key);
    setError(null);
    setNotice(null);
    try {
      await update({ [key]: next } as Partial<AppSettings>);
      setLocal(next);
      setNotice(`${label} is now ${next ? "open" : "closed"}.`);
      router.refresh();
    } catch (e) {
      setError(errMessage(e, "Could not update setting."));
    } finally {
      setBusyKey(null);
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
      setNotice(iso ? "Hackathon start time saved." : "Start time cleared.");
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

      <div className="card space-y-5">
        <div>
          <h3 className="font-semibold">Submissions</h3>
          <p className="mt-1 text-sm text-muted">
            Control submissions in two stages. Both are enforced in the database,
            not just the UI.
          </p>
        </div>

        <ToggleRow
          title="Allow creating submissions"
          description="When open, team leaders can submit their project for the first time (teams of 2+ only)."
          on={createOpen}
          busy={busyKey === "submissions_create_open"}
          onToggle={() =>
            toggle(
              "submissions_create_open",
              createOpen,
              setCreateOpen,
              "Creating submissions"
            )
          }
        />

        <div className="border-t border-[var(--border)]" />

        <ToggleRow
          title="Allow editing submissions"
          description="When open, team leaders can edit a submission they've already made."
          on={editOpen}
          busy={busyKey === "submissions_edit_open"}
          onToggle={() =>
            toggle(
              "submissions_edit_open",
              editOpen,
              setEditOpen,
              "Editing submissions"
            )
          }
        />
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

function ToggleRow({
  title,
  description,
  on,
  busy,
  onToggle,
}: {
  title: string;
  description: string;
  on: boolean;
  busy: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
          <span
            className={`badge ${
              on
                ? "border-[var(--success)]/40 text-[var(--success)]"
                : "text-[var(--danger)]"
            }`}
          >
            {on ? "Open" : "Closed"}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <button
        onClick={onToggle}
        disabled={busy}
        role="switch"
        aria-checked={on}
        aria-label={title}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
          on ? "bg-[var(--brand)]" : "bg-[var(--surface-2)]"
        } disabled:opacity-50`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            on ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
