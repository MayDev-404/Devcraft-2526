import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import AdminUsers from "@/components/admin/AdminUsers";
import type { Profile } from "@/lib/types";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const session = await getSessionProfile();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminUsers
      initialUsers={(profiles as Profile[]) ?? []}
      currentUserId={session?.user.id ?? ""}
    />
  );
}
