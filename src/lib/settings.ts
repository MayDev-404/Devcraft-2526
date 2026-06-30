import { createClient } from "@/lib/supabase/server";
import type { AppSettings } from "@/lib/types";

// Sensible defaults if the settings row can't be read (e.g. before the
// 0005 migration has been applied).
const DEFAULTS: Pick<AppSettings, "submissions_open" | "event_start"> = {
  submissions_open: false,
  event_start: null,
};

// Reads the single app_settings row. Publicly readable (RLS), so this works
// for signed-out visitors too (used by the landing-page countdown).
export async function getSettings(): Promise<
  Pick<AppSettings, "submissions_open" | "event_start">
> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("app_settings")
      .select("submissions_open, event_start")
      .maybeSingle();
    if (!data) return DEFAULTS;
    return {
      submissions_open: data.submissions_open ?? false,
      event_start: data.event_start ?? null,
    };
  } catch {
    return DEFAULTS;
  }
}
