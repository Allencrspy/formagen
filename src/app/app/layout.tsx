import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { requireUser } from "@/lib/current-user";
import { signOutAction } from "./actions";

/**
 * Admin shell. The header frame is static and prerendered; everything that reads the
 * session streams in behind <Suspense>. RequireUser is the real gate for every /app page
 * (Next.js docs: Proxy is only for optimistic checks).
 */
export default function AdminLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <header>
        <Link href="/app">Formagen</Link>
        <Suspense fallback={null}>
          <Account />
        </Suspense>
      </header>
      <main>
        <Suspense fallback={<p>Loading…</p>}>
          <RequireUser>{children}</RequireUser>
        </Suspense>
      </main>
    </>
  );
}

async function RequireUser({ children }: { children: ReactNode }) {
  await requireUser();
  return children;
}

async function Account() {
  const user = await requireUser();
  return (
    <>
      <span>{user.name ?? user.email}</span>
      <form action={signOutAction}>
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}
