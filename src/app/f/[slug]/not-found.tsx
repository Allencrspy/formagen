import Link from "next/link";
import styles from "./public.module.css";

export default function FormNotFound() {
  return (
    <main className={styles.page}>
      <article className={styles.card}>
        <h1 className={styles.title}>This form isn&apos;t available</h1>
        <p className={styles.note}>
          The link may be mistyped, or the form hasn&apos;t been published yet. Check the link with whoever shared it.
        </p>
        <Link href="/" className={styles.again}>
          Go to Formagen
        </Link>
      </article>
    </main>
  );
}
