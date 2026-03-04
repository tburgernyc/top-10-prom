import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /logout — clears Supabase session cookies and redirects to home.
 * Can be triggered via <a href="/logout"> or router.push('/logout').
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
