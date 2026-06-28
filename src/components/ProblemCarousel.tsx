"use client";

import { useRef } from "react";
import type { ProblemStatement } from "@/lib/types";

export default function ProblemCarousel({
  problems,
}: {
  problems: ProblemStatement[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  if (problems.length === 0) {
    return (
      <div className="card mt-10 text-muted">
        Problem statements drop soon. Check back shortly.
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div
        ref={trackRef}
        className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {problems.map((p) => (
          <article
            key={p.id}
            className="group relative flex h-80 w-72 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl border border-[var(--border)] p-6"
          >
            {/* layered background: gradient wash + theme tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
            <div className="glow absolute -right-10 -top-10 h-40 w-40 opacity-20 transition-opacity duration-300 group-hover:opacity-50" />
            <span className="mono absolute right-5 top-5 text-5xl font-bold text-[var(--border)] transition-colors group-hover:text-[var(--brand)]/40">
              {p.code ?? "PS"}
            </span>

            <div className="relative">
              {p.track && (
                <span className="badge mb-3 border-[var(--brand)]/40 text-[var(--brand-2)]">
                  {p.track}
                </span>
              )}
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted">
                {p.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {problems.length > 1 && (
        <div className="mt-2 flex justify-end gap-2">
          <button
            aria-label="Previous"
            onClick={() => scroll(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] text-muted transition hover:border-[var(--brand)] hover:text-foreground"
          >
            ←
          </button>
          <button
            aria-label="Next"
            onClick={() => scroll(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-foreground transition hover:border-[var(--brand)]"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
