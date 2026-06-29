"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ProblemStatement } from "@/lib/types";

const EASE = "cubic-bezier(.22,.61,.18,1)";
const DURATION = 440;

export default function ProblemCarousel({
  problems,
}: {
  problems: ProblemStatement[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Expand-on-click state
  const [active, setActive] = useState<ProblemStatement | null>(null);
  const [closing, setClosing] = useState(false);
  const [backdropOn, setBackdropOn] = useState(false);
  const originRef = useRef<DOMRect | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  function open(p: ProblemStatement, el: HTMLElement) {
    originRef.current = el.getBoundingClientRect();
    setClosing(false);
    setActive(p);
  }

  function requestClose() {
    if (closing) return;
    setBackdropOn(false);
    setClosing(true);
  }

  // Lock scroll + Escape while the panel is open
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // FLIP: morph the panel from the clicked card's rect to its final centered rect
  useLayoutEffect(() => {
    if (!active || closing) return;
    const o = originRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!o || !panel || !content) return;

    const f = panel.getBoundingClientRect();
    const sx = o.width / f.width;
    const sy = o.height / f.height;
    const tx = o.left - f.left;
    const ty = o.top - f.top;

    panel.style.transition = "none";
    content.style.transition = "none";
    panel.style.transformOrigin = "top left";
    content.style.transformOrigin = "top left";
    panel.style.transform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
    panel.style.opacity = "0.65";
    content.style.transform = `scale(${1 / sx}, ${1 / sy})`;
    content.style.opacity = "0";

    // Force reflow so the starting frame is committed before we animate.
    void panel.getBoundingClientRect();
    requestAnimationFrame(() => {
      setBackdropOn(true);
      panel.style.transition = `transform ${DURATION}ms ${EASE}, opacity 220ms ease`;
      content.style.transition = `transform ${DURATION}ms ${EASE}, opacity 320ms ease 110ms`;
      panel.style.transform = "none";
      panel.style.opacity = "1";
      content.style.transform = "none";
      content.style.opacity = "1";
    });
  }, [active, closing]);

  // FLIP back: collapse into the origin card, then unmount
  useLayoutEffect(() => {
    if (!closing) return;
    const o = originRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!o || !panel || !content) {
      setActive(null);
      setClosing(false);
      return;
    }
    const f = panel.getBoundingClientRect();
    const sx = o.width / f.width;
    const sy = o.height / f.height;
    const tx = o.left - f.left;
    const ty = o.top - f.top;

    panel.style.transition = `transform ${DURATION}ms ${EASE}, opacity 260ms ease 140ms`;
    content.style.transition = `transform ${DURATION}ms ${EASE}, opacity 180ms ease`;
    requestAnimationFrame(() => {
      panel.style.transform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
      panel.style.opacity = "0.4";
      content.style.transform = `scale(${1 / sx}, ${1 / sy})`;
      content.style.opacity = "0";
    });
  }, [closing]);

  function onPanelTransitionEnd(e: React.TransitionEvent) {
    if (closing && e.propertyName === "transform") {
      setActive(null);
      setClosing(false);
    }
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
        className="edge-fade-x flex snap-x gap-5 overflow-x-auto px-7 py-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {problems.map((p) => (
          <article
            key={p.id}
            role="button"
            tabIndex={0}
            aria-label={`Open ${p.title}`}
            onClick={(e) => open(p, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(p, e.currentTarget);
              }
            }}
            className="ps-card group relative flex h-80 w-72 shrink-0 cursor-pointer snap-start flex-col justify-end overflow-hidden rounded-2xl border border-[var(--border)] p-6 outline-none hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30"
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
              <span className="eyebrow mt-3 inline-flex items-center gap-1 text-[var(--brand)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Read more →
              </span>
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

      {/* Expanded detail overlay ---------------------------------------- */}
      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
          <div
            onClick={requestClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            style={{ opacity: backdropOn ? 1 : 0 }}
            aria-hidden
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onTransitionEnd={onPanelTransitionEnd}
            className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)]" />
            <div className="glow pointer-events-none absolute -right-16 -top-16 h-56 w-56 opacity-30" />

            <div ref={contentRef} className="relative overflow-y-auto p-8 sm:p-10">
              <button
                onClick={requestClose}
                aria-label="Close"
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/70 text-muted transition hover:border-[var(--brand)] hover:text-foreground"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <span className="mono text-4xl font-bold text-[var(--brand)]/50">
                  {active.code ?? "PS"}
                </span>
                {active.track && (
                  <span className="badge border-[var(--brand)]/40 text-[var(--brand-2)]">
                    {active.track}
                  </span>
                )}
              </div>

              <h3 className="mt-4 pr-10 text-3xl font-bold leading-tight">
                {active.title}
              </h3>
              <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-muted">
                {active.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
