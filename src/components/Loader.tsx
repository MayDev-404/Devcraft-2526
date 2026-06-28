// Branded loading state: the DevCraft wordmark with two dots (coral + teal)
// orbiting it on an elliptical path. Used by the route-level loading.tsx files.
export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="flex flex-col items-center">
        <div className="relative grid h-52 w-52 place-items-center">
          <div className="glow pointer-events-none absolute inset-6 opacity-20" />
          <div className="loader-track" aria-hidden />
          <div className="loader-comet" aria-hidden />
          <span className="font-display text-2xl font-bold tracking-tight">
            Dev<span className="text-gradient">Craft</span>
          </span>
        </div>
        <p className="eyebrow mt-6 animate-pulse text-muted">{label}</p>
        <span className="sr-only" role="status">
          Loading…
        </span>
      </div>
    </div>
  );
}
