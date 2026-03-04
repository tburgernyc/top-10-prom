import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Where to redirect unauthenticated users. Default: /login */
  redirectTo?: string;
}

/**
 * Server Component HOC — protects routes by checking Supabase session.
 * Uses getUser() which validates the JWT server-side (not getSession which trusts client).
 * Wrap dashboard layouts with this to enforce authentication.
 */
export async function AuthGuard({
  children,
  redirectTo = "/login",
}: AuthGuardProps) {
  const user = await getAuthUser();

  if (!user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
