import { createClient } from "@/lib/supabase/server";
import AdminAllowed from "@/components/admin/AdminAllowed";
import type { AllowedUser } from "@/lib/types";

export default async function AdminAllowedPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("allowed_users")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminAllowed initial={(data as AllowedUser[]) ?? []} />;
}
