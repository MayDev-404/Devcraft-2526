export const metadata = { title: "About · DevCraft" };

const facts = [
  { label: "When", value: "-" },
  { label: "Where", value: "Online" },
  { label: "Who", value: "Open to ISTE members and Summer School participants" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">About DevCraft</h1>
      <p className="mt-4 text-lg text-muted">
        DevCraft is an exclusive hackathon built to turn ideas into working
        products. Teams of 2–4 pick a real-world
        problem, prototype a solution, and pitch it to a panel of judges.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label} className="card">
            <p className="text-xs uppercase tracking-wide text-muted">{f.label}</p>
            <p className="mt-1 font-semibold">{f.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">What you&apos;ll get</h2>
      <ul className="mt-4 space-y-3 text-muted">
        <li>• A chance to win from a prize pool of ₹10,000.</li>
        <li>• A portfolio-worthy project and a great team experience.</li>
      </ul>

      <h2 className="mt-12 text-2xl font-bold">Organised by</h2>
      <p className="mt-4 text-muted">
        DevCraft is organised by the ISTE Manipal.
      </p>
    </div>
  );
}
