import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Log in · DevCraft" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
