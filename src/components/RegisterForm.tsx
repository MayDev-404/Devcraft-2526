"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Fields = {
  full_name: string;
  registration_number: string;
  learner_email: string;
  personal_email: string;
  phone: string;
  is_iste_member: "yes" | "no";
  password: string;
  confirm: string;
};

const initial: Fields = {
  full_name: "",
  registration_number: "",
  learner_email: "",
  personal_email: "",
  phone: "",
  is_iste_member: "no",
  password: "",
  confirm: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const [f, setF] = useState<Fields>(initial);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (f.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (f.password !== f.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const reg = f.registration_number.trim();

    // 1) Friendly pre-check against the allow-list.
    const { data: allowed, error: rpcError } = await supabase.rpc(
      "is_registration_allowed",
      { reg_number: reg }
    );

    if (rpcError) {
      setLoading(false);
      setError(
        "Couldn't verify your registration number right now. Please try again."
      );
      return;
    }
    if (!allowed) {
      setLoading(false);
      setError(
        "This registration number isn't on the approved list, or it's already registered. Please contact the organisers if you believe this is a mistake."
      );
      return;
    }

    // 2) Create the auth user; the DB trigger creates the profile + enforces the gate.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: f.learner_email.trim(),
      password: f.password,
      options: {
        data: {
          full_name: f.full_name.trim(),
          registration_number: reg,
          learner_email: f.learner_email.trim(),
          personal_email: f.personal_email.trim(),
          phone: f.phone.trim(),
          is_iste_member: f.is_iste_member === "yes",
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "Registration failed. Please try again.");
      return;
    }

    // If email confirmation is enabled, there's no active session yet.
    if (!data.session) {
      setNotice(
        "Almost there! We've sent a confirmation link to your learner email. Confirm it, then log in."
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-lg">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-muted">
        Register with the details below. Your registration number must be on the
        approved list.
      </p>

      <form onSubmit={onSubmit} className="card mt-6 space-y-4">
        <div>
          <label className="label">Full name</label>
          <input
            className="input"
            value={f.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            required
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="label">Registration number</label>
          <input
            className="input"
            value={f.registration_number}
            onChange={(e) => update("registration_number", e.target.value)}
            required
            placeholder="e.g. REG001"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Learner email</label>
            <input
              type="email"
              className="input"
              value={f.learner_email}
              onChange={(e) => update("learner_email", e.target.value)}
              required
              placeholder="you@learner.manipal..edu"
            />
            <p className="mt-1 text-xs text-muted">You&apos;ll log in with this.</p>
          </div>
          <div>
            <label className="label">Personal email</label>
            <input
              type="email"
              className="input"
              value={f.personal_email}
              onChange={(e) => update("personal_email", e.target.value)}
              required
              placeholder="you@gmail.com"
            />
          </div>
        </div>

        <div>
          <label className="label">Phone number</label>
          <input
            type="tel"
            className="input"
            value={f.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
            placeholder="+91 90000 00000"
          />
        </div>

        <div>
          <label className="label">Are you a member of ISTE?</label>
          <div className="flex gap-3">
            {(["yes", "no"] as const).map((opt) => (
              <label
                key={opt}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-sm capitalize transition ${
                  f.is_iste_member === opt
                    ? "border-[var(--brand)] bg-[var(--brand)]/10 text-foreground"
                    : "border-[var(--border)] text-muted hover:bg-[var(--surface-2)]"
                }`}
              >
                <input
                  type="radio"
                  name="iste"
                  className="sr-only"
                  checked={f.is_iste_member === opt}
                  onChange={() => update("is_iste_member", opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={f.password}
              onChange={(e) => update("password", e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input
              type="password"
              className="input"
              value={f.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
        </div>

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

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Already registered?{" "}
        <Link href="/login" className="text-[var(--brand-2)] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
