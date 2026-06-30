import { createClient } from "@/lib/supabase/server";
import type { AppSettings } from "@/lib/types";

type PublicSettings = Pick<
  AppSettings,
  "submissions_create_open" | "submissions_edit_open" | "event_start"
>;

// Sensible defaults if the settings row can't be read (e.g. before the
// migrations have been applied).
const DEFAULTS: PublicSettings = {
  submissions_create_open: false,
  submissions_edit_open: false,
  event_start: null,
};

// Reads the single app_settings row. Publicly readable (RLS), so this works
// for signed-out visitors too (used by the landing-page countdown).
export async function getSettings(): Promise<PublicSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("app_settings")
      .select("submissions_create_open, submissions_edit_open, event_start")
      .maybeSingle();
    if (!data) return DEFAULTS;
    return {
      submissions_create_open: data.submissions_create_open ?? false,
      submissions_edit_open: data.submissions_edit_open ?? false,
      event_start: data.event_start ?? null,
    };
  } catch {
    return DEFAULTS;
  }
}
