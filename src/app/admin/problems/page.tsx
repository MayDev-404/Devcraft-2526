import { createClient } from "@/lib/supabase/server";
import AdminProblems from "@/components/admin/AdminProblems";
import type { ProblemStatement } from "@/lib/types";

export default async function AdminProblemsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("problem_statements")
    .select("*")
    .order("code", { ascending: true });

  return <AdminProblems initial={(data as ProblemStatement[]) ?? []} />;
}
