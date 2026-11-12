import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPublishedForm } from "../data";
import styles from "../public.module.css";

export const instant = false;

export default async function ThanksPage({ params }: PageProps<"/f/[slug]/thanks">) {
  const { slug } = await params;
  const form = await loadPublishedForm(slug);
  if (!form) notFound();

  return (
    <main className={styles.page}>
      <article className={styles.card}>
        <h1 className={styles.title}>Thanks, your response was recorded.</h1>
        <p className={styles.note}>{form.title}</p>
        <Link href={`/f/${slug}`} className={styles.again}>
          Submit another response
        </Link>
      </article>
    </main>
  );
}
