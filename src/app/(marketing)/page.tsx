import Link from "next/link";
import Image from "next/image";
import Countdown from "@/components/Countdown";
import HeroArt from "@/components/HeroArt";
import ProblemCarousel from "@/components/ProblemCarousel";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import { EVENT_START, WHATSAPP_GROUP_URL } from "@/lib/event";
import type { ProblemStatement } from "@/lib/types";

const highlights = [
  { label: "Format", value: "Online" },
  { label: "Team size", value: "2 – 4 members" },
  { label: "Tracks", value: "Multi Domain" },
  { label: "Prize pool", value: "₹10,000" },
];

const steps = [
  {
    n: "01",
    title: "Register",
    body: "Create your account using your registration number, then complete your profile.",
  },
  {
    n: "02",
    title: "Form a team",
    body: "Create a team and become its leader, or join an existing team with a team ID.",
  },
  {
    n: "03",
    title: "Pick a problem",
    body: "The team leader chooses a problem statement from the available tracks.",
  },
  {
    n: "04",
    title: "Build & submit",
    body: "Hack on your idea and submit your project before the deadline.",
  },
];

export default async function LandingPage() {
  const session = await getSessionProfile();
  const loggedIn = Boolean(session);

  let problems: ProblemStatement[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("problem_statements")
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    problems = data ?? [];
  } catch {
    problems = [];
  }

  return (
    <>
      {/* Hero ------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="glow pointer-events-none absolute -left-40 -top-40 -z-10 h-[36rem] w-[36rem] opacity-40" />

        {/* Decorative curved arc + accent shapes */}
        <svg
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="arc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand-2)" stopOpacity="0" />
              <stop offset="55%" stopColor="var(--brand)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--brand-2)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-50 470 C 300 360, 520 540, 760 360 S 1150 120, 1300 200"
            fill="none"
            stroke="url(#arc)"
            strokeWidth="2.5"
          />
        </svg>
        <span className="accent-square pointer-events-none absolute left-[48%] top-16 hidden h-4 w-4 rotate-45 lg:block" />
        <span className="pointer-events-none absolute right-10 top-24 hidden h-3 w-3 rounded-full border-2 border-[var(--brand-2)]/60 lg:block" />
        <span className="accent-square pointer-events-none absolute bottom-16 left-10 hidden h-3 w-3 lg:block" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="eyebrow">ISTE Manipal · Online Hackathon</p>
            <h1 className="mt-5 text-6xl font-bold leading-[0.95] sm:text-7xl">
              Dev<span className="text-gradient">Craft</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              Form a team, pick a problem statement, and ship a working product —
              entirely online. Built by ISTE Manipal for builders who like to move
              fast.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {loggedIn ? (
                <Link href="/dashboard" className="btn-primary">
                  Go to dashboard
                </Link>
              ) : (
                <Link href="/register" className="btn-primary">
                  Register now
                </Link>
              )}
              <Link href="/problems" className="btn-ghost">
                View problem statements
              </Link>
            </div>
            <p className="eyebrow mt-7 flex items-center gap-2 text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand)]" />
              </span>
              Registrations open
            </p>
          </div>

          {/* Isometric 3D code-monitor illustration */}
          <HeroArt />
        </div>
      </section>

      {/* About + countdown ----------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">About</p>
            <h2 className="mt-3 text-4xl font-bold">
              The hackathon for <span className="text-gradient">ISTE</span> builders
            </h2>
            <p className="mt-5 text-muted">
              DevCraft is an online hackathon where teams of 2–4 turn an idea into a
              working product. Open to all ISTE members and Summer School
              participants — no travel, just code.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]">
              {highlights.map((h) => (
                <div key={h.label} className="bg-[var(--surface)] p-5">
                  <dt className="eyebrow text-muted">{h.label}</dt>
                  <dd className="mt-2 text-lg font-semibold">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card flex flex-col items-center gap-6 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] py-10 text-center">
            <p className="eyebrow text-muted">Kicks off in</p>
            <Countdown target={EVENT_START} />
            {loggedIn ? (
              <Link href="/dashboard" className="btn-primary">
                Go to dashboard
              </Link>
            ) : (
              <Link href="/register" className="btn-primary">
                Reserve your spot
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Problem themes --------------------------------------------------- */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Problem statements</p>
              <h2 className="mt-3 text-4xl font-bold">
                Pick your <span className="text-gradient">challenge</span>
              </h2>
            </div>
            <Link href="/problems" className="btn-ghost">
              View all
            </Link>
          </div>

          <ProblemCarousel problems={problems} />
        </div>
      </section>

      {/* How it works ----------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="eyebrow text-center">The flow</p>
        <h2 className="mt-3 text-center text-4xl font-bold">
          Sign-up to <span className="text-gradient">submission</span>
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card relative">
              <span className="mono text-sm text-[var(--brand)]">{s.n}</span>
              <div className="mt-3 h-px w-8 bg-[var(--brand)]" />
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prize ------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="card grid items-center gap-8 overflow-hidden bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] p-10 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Prize &amp; more</p>
            <h2 className="mt-3 text-4xl font-bold">Win big for building</h2>
            <p className="mt-4 text-muted">
              Cash prizes, certificates, and bragging rights for the teams that
              ship the most impressive products.
            </p>
          </div>
          <div className="text-center sm:text-right">
            <div className="flex items-start justify-center font-display text-6xl font-bold leading-none text-gradient sm:justify-end sm:text-7xl">
              <span className="mt-1 mr-0.5 text-4xl sm:text-5xl">₹</span>
              <span className="tabular-nums tracking-tight">10,000</span>
            </div>
            <p className="eyebrow mt-3 text-muted">Total prize pool</p>
          </div>
        </div>
      </section>

      {/* CTA banner ------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="mono grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--brand-2)]">
              &lt;/&gt;
            </span>
            <p className="text-lg font-semibold">
              Turn your idea into a shipped product.
            </p>
          </div>
          {loggedIn ? (
            <Link href="/dashboard" className="btn-primary shrink-0">
              Go to dashboard
            </Link>
          ) : (
            <Link href="/register" className="btn-primary shrink-0">
              Register now
            </Link>
          )}
        </div>
      </section>

      {/* Join the WhatsApp group ------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] p-8 sm:p-10">
          <div className="glow pointer-events-none absolute -left-16 -top-16 h-56 w-56 opacity-25" />
          <div className="relative grid items-center gap-8 sm:grid-cols-[auto_1fr]">
            {/* QR code */}
            <div className="mx-auto rounded-2xl bg-white p-3 shadow-lg sm:mx-0">
              <Image
                src="/qr.jpeg"
                alt="WhatsApp group QR code"
                width={200}
                height={200}
                className="h-44 w-44 rounded-lg object-contain"
              />
            </div>

            <div className="text-center sm:text-left">
              <p className="eyebrow">Stay in the loop</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Join the group for <span className="text-gradient">updates</span>
              </h2>
              <p className="mt-4 max-w-md text-muted">
                Scan the QR code, or tap the button below to join our WhatsApp
                group for announcements, deadlines, and important updates about
                DevCraft.
              </p>
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-7 inline-flex"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M.06 24l1.68-6.13A11.86 11.86 0 0 1 .14 11.9C.14 5.33 5.49 0 12.06 0a11.8 11.8 0 0 1 8.4 3.49 11.76 11.76 0 0 1 3.48 8.42c0 6.57-5.35 11.91-11.92 11.91a11.93 11.93 0 0 1-5.7-1.45L.06 24Zm6.6-3.8c1.67.99 3.27 1.58 5.4 1.58 5.46 0 9.9-4.43 9.9-9.88 0-5.46-4.42-9.89-9.89-9.89-5.46 0-9.9 4.43-9.9 9.88 0 2.24.66 3.92 1.75 5.68l-.99 3.63 3.73-.99Zm11.4-5.55c-.07-.12-.27-.2-.57-.34-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42Z" />
                </svg>
                Join WhatsApp group
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact us ------------------------------------------------------- */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-20">
        <p className="eyebrow text-center">Get in touch</p>
        <h2 className="mt-3 text-center text-4xl font-bold">Contact us</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Have a question? Reach out to the DevCraft organising team.
        </p>

        <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
          {/* Email — TODO: replace the placeholder email below */}
          <a
            href="mailto:isteboard2526@gmail.com"
            className="card flex items-start gap-4 transition hover:border-[var(--brand)]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--surface-2)] text-xl">
              ✉️
            </span>
            <div>
              <p className="font-semibold">Email</p>
              <p className="mt-1 text-sm text-muted">isteboard2526@gmail.com</p>
              <p className="mt-1 text-sm text-muted">iste.mit@manipal.edu</p>
            </div>
          </a>

          {/* Phone — TODO: replace the placeholder number below */}
          <a
            href="tel:CONTACT_PHONE_PLACEHOLDER"
            className="card flex items-start gap-4 transition hover:border-[var(--brand)]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--surface-2)] text-xl">
              📞
            </span>
            <div>
              <p className="font-semibold">Phone</p>
              <p className="mt-1 text-sm text-muted">Tanvi: +91 7827867996</p>
              <p className="mt-1 text-sm text-muted">Mayank: +91 6202410694</p>
            </div>
          </a>
        </div>
      </section>

      {/* Final CTA -------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] py-14 text-center">
          <div className="glow pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 opacity-25" />
          <h2 className="text-4xl font-bold">Ready to compete?</h2>
          {loggedIn ? (
            <>
              <p className="mx-auto mt-4 max-w-lg text-muted">
                Round up your team, pick a problem statement, and start building.
              </p>
              <Link href="/dashboard" className="btn-primary mt-7">
                Go to dashboard
              </Link>
            </>
          ) : (
            <>
              <p className="mx-auto mt-4 max-w-lg text-muted">
                Grab your registration number, round up your team, and lock in your
                spot.
              </p>
              <Link href="/register" className="btn-primary mt-7">
                Create your account
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}
