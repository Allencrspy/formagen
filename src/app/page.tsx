import Link from "next/link";
import styles from "./landing/landing.module.css";
import { ProductDemo } from "./landing/ProductDemo";

const GITHUB = "https://github.com/Allencrspy/formagen";

const STEPS = [
  {
    term: "Build",
    text: "Add fields, mark what's required, and show a field only when an earlier answer calls for it. The preview is the real form.",
  },
  {
    term: "Publish",
    text: "Publishing saves the form as the next version. Nothing already submitted changes.",
  },
  {
    term: "Share",
    text: "One link that works on any phone, with a screen reader, and with JavaScript turned off.",
  },
  {
    term: "Read",
    text: "Every response shows the version it answered. Filter by version, page through, export to CSV.",
  },
];

const STACK = [
  ["Framework", "Next.js 16, App Router, Cache Components"],
  ["Language", "TypeScript, strict"],
  ["Schema", "Zod, one definition shared by browser and server"],
  ["Data", "Postgres on Neon, Drizzle ORM"],
  ["Sign-in", "Auth.js with GitHub"],
  ["Hosting", "AWS Lambda and CloudFront, deployed with SST"],
] as const;

export default function Home() {
  return (
    <div className={styles.root}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.wordmark}>
            Formagen
          </Link>
          <nav aria-label="Main" className={styles.navLinks}>
            <a href="#how">How it works</a>
            <a href={GITHUB}>GitHub</a>
            <Link href="/app">Sign in</Link>
          </nav>
          <Link href="/app" className={styles.navCta}>
            Start building
          </Link>
        </div>
      </header>

      <main>
        <section aria-labelledby="hero-title" className={styles.hero}>
          <h1 id="hero-title" className={styles.headline}>
            Change your form any time. Every response keeps its version.
          </h1>
          <p className={styles.lede}>
            Formagen turns one form definition into the editor preview, the public page and the server&apos;s checks, and
            saves each publish as a version.
          </p>
          <div className={styles.actions}>
            <Link href="/app" className={styles.primaryCta}>
              Start building
            </Link>
            <a href={GITHUB} className={styles.secondaryCta}>
              View source
            </a>
            <span className={styles.actionNote}>Sign in with GitHub. No setup.</span>
          </div>
        </section>

        <section aria-label="Live demo" className={styles.demoSection}>
          <ProductDemo />
          <p className={styles.demoCaption}>
            Live demo with sample data. Switch versions, submit the form, watch the table. Nothing leaves your browser.
          </p>
        </section>

        <section id="how" aria-labelledby="how-title" className={styles.section}>
          <h2 id="how-title" className={styles.sectionTitle}>
            How it works
          </h2>
          <dl className={styles.steps}>
            {STEPS.map((s) => (
              <div key={s.term} className={styles.step}>
                <dt className={styles.stepTerm}>{s.term}</dt>
                <dd className={styles.stepText}>{s.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="people-title" className={`${styles.section} ${styles.twoCol}`}>
          <h2 id="people-title" className={styles.sectionTitle}>
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

        <section aria-labelledby="stack-title" className={`${styles.section} ${styles.twoCol}`}>
          <h2 id="stack-title" className={styles.sectionTitle}>
            How it&apos;s built
          </h2>
          <div>
            <dl className={styles.stack}>
              {STACK.map(([k, v]) => (
                <div key={k} className={styles.stackRow}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.stackFoot}>
              Open source. <a href={GITHUB}>Read the code and design notes on GitHub</a>.
            </p>
          </div>
        </section>

        <section aria-labelledby="close-title" className={styles.close}>
          <h2 id="close-title" className={styles.closeTitle}>
            Publish your first form in minutes.
          </h2>
          <Link href="/app" className={styles.primaryCta}>
            Start building
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Formagen</span>
          <span>
            Built by Allen Binu Thomas · <a href={GITHUB}>GitHub</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
