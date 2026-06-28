import SiteHeader from "@/components/SiteHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Admin · DevCraft" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin(); // redirects non-admins

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Admin panel</h1>
          <AdminTabs />
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </>
  );
}
