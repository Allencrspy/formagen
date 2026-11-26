import Link from "next/link";
import { Mark } from "@/components/brand/Mark";
import styles from "./landing/landing.module.css";
import { ProductDemo } from "./landing/ProductDemo";

const GITHUB = "https://github.com/Allencrspy/formagen";

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
            <Mark size={22} inverse />
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
        <div className={styles.heroBand}>
          <section aria-labelledby="hero-title" className={styles.hero}>
            <h1 id="hero-title" className={styles.headline}>
              Change your form any time. Every response keeps its version.
            </h1>
            <p className={styles.lede}>One schema drives the editor preview, the public page and the server&apos;s checks.</p>
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
        </div>

        {/* The demo is the explanation: build, publish, share and read all happen in it. */}
        <section id="how" aria-label="Live demo" className={styles.demoSection}>
          <ProductDemo />
          <p className={styles.demoCaption}>
            Live demo with sample data. Switch versions, submit the form, watch the table. Nothing leaves your browser.
          </p>
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

        <section aria-labelledby="close-title" className={`${styles.section} ${styles.close}`}>
          <h2 id="close-title" className={styles.closeTitle}>
            Build a form, publish v1, share the link.
          </h2>
          <Link href="/app" className={styles.closeLink}>
            Start building with GitHub sign-in
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
