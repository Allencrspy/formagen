import Link from "next/link";
import styles from "./public.module.css";

export default function FormNotFound() {
  return (
    <main className={styles.page}>
      <header className={styles.band}>
        <div className={styles.column}>
          <h1 className={styles.title}>This form isn&apos;t available</h1>
        </div>
      </header>
      <div className={`${styles.column} ${styles.body}`}>
        <p className={styles.lead}>
          The link may be mistyped, or the form hasn&apos;t been published yet. Check the link with whoever shared it.
        </p>
        <Link href="/" prefetch={false} className={styles.again}>
          Go to Formagen
        </Link>
      </div>
    </main>
  );
}
