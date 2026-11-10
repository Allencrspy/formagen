import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { auth } from "@/auth";

export type CurrentUser = { id: string; name: string | null; email: string | null };

/**
 * The one place admin code reads the session (Next.js "Data Access Layer" pattern).
 * Redirects to sign-in when there is no user. Deduplicated per request with React cache.
 * It reads cookies, so callers must render inside a <Suspense> boundary.
 */
export const requireUser = cache(async (): Promise<CurrentUser> => {
  // Auth.js uses crypto.getRandomValues() before it reads cookies; mark this as
  // request-time work first so Next.js doesn't try to prerender it.
  await connection();
  const session = await auth();
  const user = session?.user;
  if (!user?.id) redirect("/api/auth/signin?callbackUrl=/app");
  return { id: user.id, name: user.name ?? null, email: user.email ?? null };
});
