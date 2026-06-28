import { createClient } from "@/lib/supabase/server";
import type { ProblemStatement } from "@/lib/types";

export const metadata = { title: "Problem Statements · DevCraft" };

export default async function ProblemsPage() {
  let problems: ProblemStatement[] = [];
  let error: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error: dbError } = await supabase
      .from("problem_statements")
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (dbError) throw dbError;
    problems = data ?? [];
  } catch {
    error =
      "Problem statements aren't available yet. Please check back once the database is connected.";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Problem statements</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Browse the challenges below. Once you&apos;ve formed a team, your team
        leader picks one of these from the dashboard.
      </p>

      {error ? (
        <div className="card mt-10 text-muted">{error}</div>
      ) : problems.length === 0 ? (
        <div className="card mt-10 text-muted">
          Problem statements will be published soon. Stay tuned!
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {problems.map((p) => (
            <div key={p.id} className="card">
              <div className="flex flex-wrap items-center gap-3">
                {p.code && <span className="badge">{p.code}</span>}
                {p.track && (
                  <span className="badge border-[var(--brand)]/40 text-[var(--brand-2)]">
                    {p.track}
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
