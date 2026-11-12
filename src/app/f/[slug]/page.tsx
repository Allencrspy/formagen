import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { loadPublishedForm } from "./data";
import { decodeFlash, flashCookieName } from "./flash";
import { PublicForm } from "./PublicForm";
import styles from "./public.module.css";

// Renders per request (it reads the flash cookie); the form data itself is cached in data.ts.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/f/[slug]">): Promise<Metadata> {
  const form = await loadPublishedForm((await params).slug);
  return { title: form ? form.title : "Form not found", robots: { index: false } };
}

export default async function PublicFormPage({ params }: PageProps<"/f/[slug]">) {
  const { slug } = await params;
  const form = await loadPublishedForm(slug);
  if (!form) notFound();
  // Errors and typed values from a failed submit (Post/Redirect/Get, see flash.ts).
  const flash = decodeFlash((await cookies()).get(flashCookieName(slug))?.value);

  return (
    <main className={styles.page}>
      <article className={styles.card} aria-labelledby="form-title">
        <h1 id="form-title" className={styles.title}>
          {form.title}
        </h1>
        <p className={styles.note}>Fields marked (required) must be filled in.</p>
        <PublicForm slug={slug} schema={form.schema} flash={flash} />
      </article>
      <p className={styles.footer}>
        Made with <Link href="/">Formagen</Link>
      </p>
    </main>
  );
}
