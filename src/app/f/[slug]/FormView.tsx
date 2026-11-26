import Link from "next/link";
import type { PublishedForm } from "./data";
import type { Flash } from "./flash";
import { PublicForm } from "./PublicForm";
import styles from "./public.module.css";

/** The public form page body, shared by the cached form page and the dynamic retry page. */
export function FormView({ slug, form, flash }: { slug: string; form: PublishedForm; flash: Flash | null }) {
  return (
    <main className={styles.page}>
      <header className={styles.band}>
        <div className={styles.column}>
          <h1 id="form-title" className={styles.title}>
            {form.title}
          </h1>
          <p className={styles.note}>Fields marked (required) must be filled in.</p>
        </div>
      </header>
      <article className={`${styles.column} ${styles.body}`} aria-labelledby="form-title">
        <PublicForm slug={slug} schema={form.schema} flash={flash} />
      </article>
      <p className={`${styles.column} ${styles.footer}`}>
        {/* Respondents rarely leave for the landing page: don't spend their data prefetching it. */}
        Made with{" "}
        <Link href="/" prefetch={false}>
          Formagen
        </Link>
      </p>
    </main>
  );
}
