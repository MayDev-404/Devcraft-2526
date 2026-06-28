import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2.5 font-display font-bold">
            <Image
              src="/iste-logo.png"
              alt="ISTE logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9 rounded-full bg-white p-0.5"
            />
            <span className="text-lg">
              Dev<span className="text-gradient">Craft</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
