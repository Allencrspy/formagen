import Link from "next/link";
import { CatalogueDemo } from "./landing/CatalogueDemo";
import { display, typed } from "./landing/fonts";
import styles from "./landing/landing.module.css";

const GITHUB = "https://github.com/Allencrspy/formagen";

const STEPS = [
  {
    term: "Build",
    text: "Add fields, mark what's required, show a field only when an earlier answer calls for it. The preview is the real form.",
    meta: "one schema",
  },
  {
    term: "Publish",
    text: "Files the card as the next version. Nothing already filed changes, ever.",
    meta: "v1, v2, …",
  },
  {
    term: "Share",
    text: "One link that works on any phone, with a screen reader, even with JavaScript turned off.",
    meta: "/f/your-form",
  },
  {
    term: "Read",
    text: "Responses grouped by the version they answered, 25 to a page, one click to CSV.",
    meta: "filter · export",
  },
];

const COLOPHON = [
  ["Framework", "Next.js 16, App Router with Cache Components"],
  ["Language", "TypeScript, strict"],
  ["Schema", "Zod, one definition shared by browser and server"],
  ["Data", "Postgres on Neon through Drizzle ORM"],
  ["Sign-in", "Auth.js with GitHub"],
  ["Hosting", "AWS Lambda and CloudFront, deployed with SST"],
] as const;

export default function Home() {
  return (
    <div data-theme="light" className={`${display.variable} ${typed.variable} ${styles.root}`}>
      <header className={styles.drawerNav}>
        <Link href="/" className={styles.labelHolder}>
          Formagen
        </Link>
        <nav aria-label="Main" className={styles.navLinks}>
          <a href="#how">How it works</a>
          <a href={GITHUB}>GitHub</a>
        </nav>
        <Link href="/app" className={styles.pull}>
          Sign in
        </Link>
      </header>

      <main>
        <section aria-labelledby="hero-title" className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1 id="hero-title" className={styles.headline}>
              Build a form once. Every response stays filed against the version it answered.
            </h1>
            <p className={styles.lede}>
              One definition becomes the builder preview, the public page and the server&apos;s checks. Publish a version,
              share the link, keep improving the form: old responses keep their own fields.
            </p>
            <div className={styles.actions}>
              <Link href="/app" className={styles.primaryCta}>
                Start building
              </Link>
              <span className={styles.actionNote}>Sign in with GitHub. No setup.</span>
            </div>
          </div>
          <p className={styles.tryIt}>Try it: switch versions, fill in the form, file it.</p>
          <CatalogueDemo />
        </section>

        <section id="how" aria-labelledby="how-title" className={styles.section}>
          <h2 id="how-title" className={styles.sectionTitle}>
            How it works
          </h2>
          <dl className={styles.index}>
            {STEPS.map((s) => (
              <div key={s.term} className={styles.indexRow}>
                <dt className={styles.indexTerm}>{s.term}</dt>
                <dd className={styles.indexText}>{s.text}</dd>
                <dd className={styles.indexMeta}>{s.meta}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="respondents-title" className={`${styles.section} ${styles.split}`}>
          <h2 id="respondents-title" className={styles.sectionTitle}>
            Built for the people filling it in
          </h2>
          <div className={styles.prose}>
            <p>
              Public forms are plain HTML first. They submit and show errors with JavaScript turned off, then add live
              conditions when it&apos;s on.
            </p>
            <p>
              A failed submit lists every problem at the top, each linked to its field, and screen readers hear the label,
              the hint and the error together.
            </p>
            <p>Designed to WCAG 2.2 AA: every field labelled, focus always visible, everything usable from the keyboard.</p>
          </div>
        </section>

        <section aria-labelledby="colophon-title" className={`${styles.section} ${styles.split}`}>
          <h2 id="colophon-title" className={styles.sectionTitle}>
            How it&apos;s built
          </h2>
          <div className={styles.colophon}>
            <dl className={styles.colophonList}>
              {COLOPHON.map(([k, v]) => (
                <div key={k} className={styles.colophonRow}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.colophonFoot}>
              Open source. <a href={GITHUB}>Read the code and design notes on GitHub</a>.
            </p>
          </div>
        </section>

        <section aria-labelledby="close-title" className={styles.close}>
          <h2 id="close-title" className={styles.closeTitle}>
            File your first form.
          </h2>
          <Link href="/app" className={styles.primaryCta}>
            Start building
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Formagen</span>
        <span>
          Built by Allen Binu Thomas · <a href={GITHUB}>GitHub</a>
        </span>
      </footer>
    </div>
  );
}
