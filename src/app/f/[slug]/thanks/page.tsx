import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPublishedForm, STATIC_PARAMS_PLACEHOLDER } from "../data";
import styles from "../public.module.css";

// Same for every visitor, so cached like the form page.
export function generateStaticParams() {
  return [{ slug: STATIC_PARAMS_PLACEHOLDER }];
}

export default async function ThanksPage({ params }: PageProps<"/f/[slug]/thanks">) {
  const { slug } = await params;
  const form = await loadPublishedForm(slug);
  if (!form) notFound();

  return (
    <main className={styles.page}>
      <header className={styles.band}>
        <div className={styles.column}>
          <p className={styles.note}>{form.title}</p>
          <h1 className={styles.title}>Thanks, your response was recorded.</h1>
        </div>
      </header>
      <div className={`${styles.column} ${styles.body}`}>
        <Link href={`/f/${slug}`} className={styles.again}>
          Submit another response
        </Link>
      </div>
    </main>
  );
}
