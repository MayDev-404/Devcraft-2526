import Link from "next/link";
import Image from "next/image";
import { WHATSAPP_GROUP_URL } from "@/lib/event";

// TODO: replace the "#" placeholders with your real profile URLs.
const socials = [
  {
    label: "WhatsApp",
    href: WHATSAPP_GROUP_URL,
    icon: (
      <path d="M.06 24l1.68-6.13A11.86 11.86 0 0 1 .14 11.9C.14 5.33 5.49 0 12.06 0a11.8 11.8 0 0 1 8.4 3.49 11.76 11.76 0 0 1 3.48 8.42c0 6.57-5.35 11.91-11.92 11.91a11.93 11.93 0 0 1-5.7-1.45L.06 24Zm6.6-3.8c1.67.99 3.27 1.58 5.4 1.58 5.46 0 9.9-4.43 9.9-9.88 0-5.46-4.42-9.89-9.89-9.89-5.46 0-9.9 4.43-9.9 9.88 0 2.24.66 3.92 1.75 5.68l-.99 3.63 3.73-.99Zm11.4-5.55c-.07-.12-.27-.2-.57-.34-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42Z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/iste_manipal/", // e.g. https://instagram.com/your-handle
    icon: (
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.9.07s-3.63 0-4.9-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.51.01-4.75.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.21 8.49 3.2 8.86 3.2 12s.01 3.51.07 4.75c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.19-1.38-.32-1.7a2.86 2.86 0 0 0-.68-1.06 2.86 2.86 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.51 4.01 15.14 4 12 4Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 8.15A3.21 3.21 0 1 0 8.79 12 3.21 3.21 0 0 0 12 15.21Zm6.3-8.35a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15Z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/iste-manipal/posts/?feedView=all", // e.g. https://linkedin.com/company/your-page
    icon: (
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-8 text-sm text-muted sm:flex-row">
        <p className="flex items-center gap-2">
          <Image
            src="/iste-logo.png"
            alt="ISTE logo"
            width={24}
            height={24}
            className="h-6 w-6 rounded-full bg-white p-0.5"
          />
          © {new Date().getFullYear()} ISTE Manipal. All rights reserved.
        </p>

        <nav className="flex gap-5">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/problems" className="hover:text-foreground">Problems</Link>
          <Link href="/faq" className="hover:text-foreground">FAQ</Link>
          <Link href="/#contact" className="hover:text-foreground">Contact</Link>
        </nav>

        <div className="flex gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] text-muted transition hover:border-[var(--brand)] hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                {s.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
