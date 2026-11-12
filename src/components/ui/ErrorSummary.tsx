"use client";

import { useEffect, useRef } from "react";
import styles from "./ErrorSummary.module.css";

export type SummaryError = { fieldId: string; label: string; message: string };

/**
 * Shown at the top of a form after a failed submit. It takes focus so keyboard and
 * screen-reader users land on it, and each item links to its field.
 */
export function ErrorSummary({ errors, title = "There is a problem" }: { errors: SummaryError[]; title?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const hasErrors = errors.length > 0;

  useEffect(() => {
    if (hasErrors) ref.current?.focus();
  }, [hasErrors, errors]);

  if (!hasErrors) return null;

  return (
    <div ref={ref} role="alert" tabIndex={-1} aria-labelledby="error-summary-title" className={styles.summary}>
      <h2 id="error-summary-title" className={styles.title}>
        {title}
      </h2>
      <ul className={styles.list}>
        {errors.map((e) => (
          <li key={e.fieldId}>
            <a href={`#${e.fieldId}`}>
              {e.label}: {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
