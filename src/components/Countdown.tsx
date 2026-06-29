"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
    done: ms === 0,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function Countdown({ target }: { target: string | null }) {
  const targetMs = target ? new Date(target).getTime() : NaN;
  const valid = !Number.isNaN(targetMs) && targetMs > Date.now();

  const [t, setT] = useState(() => (valid ? diff(targetMs) : null));

  useEffect(() => {
    if (!valid) return;
    const id = setInterval(() => setT(diff(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs, valid]);

  if (!valid || !t) {
    return (
      <p className="mono inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm text-muted">
        <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
        Dates to be announced
      </p>
    );
  }

  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Mins", value: t.mins },
    { label: "Secs", value: t.secs },
  ];

  return (
    <div className="flex items-stretch gap-2 sm:gap-3">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-stretch gap-2 sm:gap-3">
          <div className="min-w-[64px] rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-center sm:min-w-[76px]">
            <div className="mono text-3xl font-bold tabular-nums text-gradient sm:text-4xl">
              {pad(u.value)}
            </div>
            <div className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">
              {u.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="mono self-center text-2xl font-bold text-[var(--border)]">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
