"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      }
    );

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold">Reset your password</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your account email and we&apos;ll send you a secure link to set a
        new password.
      </p>

      {sent ? (
        <div className="card mt-6 space-y-3">
          <p className="rounded-lg border border-[var(--success)]/40 bg-[var(--success)]/10 px-3 py-2 text-sm text-[var(--success)]">
            If an account exists for <strong>{email}</strong>, a password reset
            link is on its way. Check your inbox (and spam).
          </p>
          <Link href="/login" className="btn-ghost w-full">
            Back to log in
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="card mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@learner.manipal.edu"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted">
            Remembered it?{" "}
            <Link href="/login" className="text-[var(--brand-2)] hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
