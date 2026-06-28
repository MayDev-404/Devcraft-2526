import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

// Returns the current auth user + profile, or null if signed out.
export async function getSessionProfile(): Promise<{
  user: { id: string; email?: string };
  profile: Profile | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user: { id: user.id, email: user.email }, profile: profile ?? null };
}

// Use in protected pages: redirects to /login if signed out.
export async function requireProfile() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  return session;
}

// Use in admin pages: redirects non-admins away.
export async function requireAdmin() {
  const session = await requireProfile();
  if (!session.profile?.is_admin) redirect("/dashboard");
  return session;
}
