import Link from "next/link";
import Image from "next/image";
import { getSessionProfile } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/problems", label: "Problem Statements" },
  { href: "/faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default async function SiteHeader() {
  const session = await getSessionProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <Image
            src="/iste-logo.png"
            alt="ISTE logo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-full bg-white p-0.5"
          />
          <span className="font-display text-lg">
            Dev<span className="text-gradient">Craft</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              {session.profile?.is_admin && (
                <Link href="/admin" className="hidden text-sm text-muted hover:text-foreground sm:block">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
