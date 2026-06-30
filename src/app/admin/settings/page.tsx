import { createClient } from "@/lib/supabase/server";
import AdminSettings from "@/components/admin/AdminSettings";
import type { AppSettings } from "@/lib/types";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("submissions_create_open, submissions_edit_open, event_start")
    .maybeSingle();

  const initial: Pick<
    AppSettings,
    "submissions_create_open" | "submissions_edit_open" | "event_start"
  > = {
    submissions_create_open: data?.submissions_create_open ?? false,
    submissions_edit_open: data?.submissions_edit_open ?? false,
    event_start: data?.event_start ?? null,
  };

  return <AdminSettings initial={initial} />;
}
