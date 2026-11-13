"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { displayAnswer, type Column } from "@/lib/forms/csv";
import styles from "./responses.module.css";

export const PAGE_SIZE = 25;

export type TableRow = {
  id: string;
  version: number;
  answers: Record<string, string | number | boolean>;
  submittedAt: string;
};

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** One row per response; a dash marks a field that response's version didn't have. */
export function ResponsesTable({
  columns,
  rows,
  total,
  page,
  onPage,
}: {
  columns: Column[];
  rows: TableRow[];
  total: number;
  page: number;
  onPage: (page: number) => void;
}) {
  if (total === 0) return <p className={styles.empty}>No responses yet.</p>;

  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, total);

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Submitted</th>
              <th scope="col">Version</th>
              {columns.map((c) => (
                <th key={c.id} scope="col" className={c.field.type === "longText" ? styles.colFree : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className={styles.muted}>
                  <time dateTime={r.submittedAt}>{dateFmt.format(new Date(r.submittedAt))}</time>
                </td>
                <td>
                  <span className={styles.versionBadge}>v{r.version}</span>
                </td>
                {columns.map((c) => {
                  const value = r.answers[c.id];
                  return (
                    <td key={c.id} className={c.field.type === "longText" ? styles.colFree : undefined}>
                      {value === undefined ? <span className={styles.muted}>—</span> : displayAnswer(c.field, value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pager}>
        <span className={styles.muted}>
          {first}–{last} of {total}
        </span>
        <span className={styles.pagerButtons}>
          <button type="button" className={styles.pageButton} aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button type="button" className={styles.pageButton} aria-label="Next page" disabled={last >= total} onClick={() => onPage(page + 1)}>
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </span>
      </div>
    </div>
  );
}
