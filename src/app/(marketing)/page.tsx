import Link from "next/link";

const highlights = [
  { label: "Format", value: "Yet to be decided" },
  { label: "Team size", value: "2 – 4 members" },
  { label: "Tracks", value: "Yet to be decided" },
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
    body: "Hack through the weekend and submit your project before the deadline.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10rem] h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-[var(--brand)] opacity-20 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <span className="badge mb-6">🚀 Registrations are open</span>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Build something{" "}
            <span className="bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] bg-clip-text text-transparent">
              extraordinary
            </span>{" "}
            at DevCraft
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            DevCraft is the flagship hackathon where students team up, pick a
            challenge, and ship a working product in a weekend. Bring your ideas —
            we&apos;ll bring the mentors, the energy, and the prizes.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="btn-primary px-6 py-3 text-base">
              Register now
            </Link>
            <Link href="/problems" className="btn-ghost px-6 py-3 text-base">
              View problem statements
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.label} className="card">
              <p className="text-xs uppercase tracking-wide text-muted">{h.label}</p>
              <p className="mt-2 text-lg font-semibold">{h.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          From sign-up to submission in four steps.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card">
              <span className="text-3xl font-bold text-[var(--brand)]">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact us */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold">Contact us</h2>
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

          {/* Location — TODO: replace the placeholder below (optional) */}
          {/* <div className="card flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--surface-2)] text-xl">
              📍
            </span>
            <div>
              <p className="font-semibold">Venue</p>
              <p className="mt-1 text-sm text-muted">CONTACT_LOCATION_PLACEHOLDER</p>
            </div>
          </div> */}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="card flex flex-col items-center gap-5 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] py-14 text-center">
          <h2 className="text-3xl font-bold">Ready to compete?</h2>
          <p className="max-w-lg text-muted">
            Grab your registration number, round up your team, and lock in your
            spot. Slots are limited.
          </p>
          <Link href="/register" className="btn-primary px-6 py-3 text-base">
            Create your account
          </Link>
        </div>
      </section>
    </>
  );
}
