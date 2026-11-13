import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { requireUser } from "@/lib/current-user";
import { signOutAction } from "./actions";
import { Providers } from "./providers";
import styles from "./layout.module.css";

/**
 * Admin shell. The header frame is static and prerendered; everything that reads the
 * session streams in behind <Suspense>. RequireUser is the real gate for every /app page
 * (proxy.ts only does an optimistic cookie check).
 */
export default function AdminLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <header className={styles.header}>
        <Link href="/app" className={styles.brand}>
          Formagen
        </Link>
        <Suspense fallback={null}>
          <Account />
        </Suspense>
      </header>
      <main>
        <Suspense fallback={<p className="page">Loading…</p>}>
          <RequireUser>
            <Providers>{children}</Providers>
          </RequireUser>
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
    <div className={styles.account}>
      <span>{user.name ?? user.email}</span>
      <form action={signOutAction}>
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </div>
  );
}
