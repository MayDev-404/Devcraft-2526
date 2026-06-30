import Link from "next/link";
import Image from "next/image";
import { getSessionProfile } from "@/lib/auth";
import HeaderNav from "@/components/HeaderNav";

export default async function SiteHeader() {
  const session = await getSessionProfile();
  const loggedIn = Boolean(session);
  const isAdmin = Boolean(session?.profile?.is_admin);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
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

        <HeaderNav loggedIn={loggedIn} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
