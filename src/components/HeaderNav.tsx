"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/problems", label: "Problem Statements" },
  { href: "/faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default function HeaderNav({
  loggedIn,
  isAdmin,
}: {
  loggedIn: boolean;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // For "/#contact": when already on the home page, scroll smoothly instead of
  // letting Next re-navigate to the top of the page.
  function handleNavClick(
    href: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) {
    if (href === "/#contact" && pathname === "/") {
      const el = document.getElementById("contact");
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", "/#contact");
      }
    }
    setOpen(false);
  }

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-6 md:flex">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={(e) => handleNavClick(l.href, e)}
            className="text-sm text-muted transition hover:text-foreground"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Right-side actions (desktop) + hamburger (mobile) */}
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 md:flex">
          {loggedIn ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-muted hover:text-foreground"
                >
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

        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-foreground md:hidden"
        >
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-x-0 top-16 z-40 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 -z-10 h-screen w-full bg-black/50 backdrop-blur-sm"
          />
          <nav className="mx-3 mt-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
            <div className="flex flex-col">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(l.href, e)}
                  className="rounded-lg px-3 py-3 text-sm text-muted transition hover:bg-[var(--surface-2)] hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="my-2 border-t border-[var(--border)]" />

            <div className="flex flex-col gap-2 p-1">
              {loggedIn ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm text-muted transition hover:bg-[var(--surface-2)] hover:text-foreground"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full justify-center text-center"
                  >
                    Dashboard
                  </Link>
                  <LogoutButton className="btn-ghost w-full justify-center text-center" />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="btn-ghost w-full justify-center text-center"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full justify-center text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
