// Isometric "code monitor" hero illustration — pure CSS 3D, themed in ISTE teal.
// Echoes the reference's 3D monitor + floating tech-stack chips.
export default function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md [perspective:1600px]">
      {/* ambient glow */}
      <div className="glow pointer-events-none absolute inset-6 -z-10 opacity-40" />

      {/* the 3D rig */}
      <div className="absolute inset-0 [transform:rotateX(12deg)_rotateY(-26deg)_rotateZ(2deg)] [transform-style:preserve-3d]">
        {/* monitor screen */}
        <div className="absolute left-[14%] top-[20%] w-[68%] [transform:translateZ(0px)] [transform-style:preserve-3d]">
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/60 ring-1 ring-[var(--brand)]/20">
            <div className="flex items-center gap-1.5 border-b border-[var(--border)] bg-[var(--surface-2)] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="grid place-items-center px-4 py-7">
              <span className="mono bg-gradient-to-br from-[var(--brand-2)] to-[var(--brand)] bg-clip-text text-5xl font-bold text-transparent">
                &lt;/&gt;
              </span>
            </div>
          </div>
          {/* monitor neck + base */}
          <div className="mx-auto h-6 w-2 bg-gradient-to-b from-[var(--border)] to-[var(--surface-2)]" />
          <div className="mx-auto h-1.5 w-20 rounded-full bg-[var(--surface-2)]" />
        </div>

        {/* floating chip — code tag */}
        <div className="absolute left-[2%] top-[34%] [transform:translateZ(70px)]">
          <div className="float grid h-14 w-14 place-items-center rounded-2xl border border-[var(--brand)]/40 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] text-[var(--brand-2)] shadow-xl shadow-[var(--brand)]/20">
            <span className="mono text-lg font-bold">{"{ }"}</span>
          </div>
        </div>

        {/* floating chip — gear */}
        <div className="absolute right-[6%] top-[8%] [transform:translateZ(110px)]">
          <div className="float-2 grid h-16 w-16 place-items-center rounded-2xl border border-[var(--brand)]/40 bg-gradient-to-br from-[var(--brand-strong)] to-[var(--surface)] text-2xl shadow-xl shadow-[var(--brand)]/30">
            ⚙️
          </div>
        </div>

        {/* floating chip — rocket */}
        <div className="absolute right-[12%] bottom-[14%] [transform:translateZ(90px)]">
          <div className="float-3 grid h-14 w-14 place-items-center rounded-2xl border border-[var(--brand)]/40 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] text-xl shadow-xl shadow-[var(--brand)]/20">
            🚀
          </div>
        </div>
      </div>
    </div>
  );
}
