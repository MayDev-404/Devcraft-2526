export const metadata = { title: "FAQ · DevCraft" };

const faqs = [
  {
    q: "Who can participate?",
    a: "All ISTE members (workcomm + mancomm) and summer school participants are allowed to take part in DevCraft Hackathon",
  },
  {
    q: "How big can a team be?",
    a: "Teams have 2 to 4 members. The person who creates the team becomes the team leader.",
  },
  {
    q: "How do I join an existing team?",
    a: "Ask your team leader for the team ID (team code) and enter it on your dashboard under 'Join a team'.",
  },
  {
    q: "Can I take part alone?",
    a: "You need at least one teammate to make a valid submission. Create a team and share your team ID with others to fill it up.",
  },
  {
    q: "Who chooses the problem statement?",
    a: "Only the team leader can select the problem statement and make the final submission on behalf of the team.",
  },
  {
    q: "What does the ISTE membership question mean?",
    a: "During registration we ask whether you're an ISTE member. It's optional information used for member recognition and does not affect eligibility.",
  },
  {
    q: "What do I need to register?",
    a: "Your name, registration number, learner email, personal email, and phone number.",
  },
  {
    q: "Is there a participation fee?",
    a: "DevCraft is an exclusive hackathon for ISTE members + Summer School participants",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Frequently asked questions</h1>
      <p className="mt-3 text-muted">
        Everything you need to know before you register.
      </p>

      <div className="mt-10 space-y-4">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="card group cursor-pointer [&_summary]:list-none"
          >
            <summary className="flex items-center justify-between font-semibold">
              {f.q}
              <span className="text-[var(--brand)] transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
