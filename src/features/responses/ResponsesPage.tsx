"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, PenLine } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { GqlError, gql } from "@/graphql/client";
import { columnsFor, type VersionSchema } from "@/lib/forms/csv";
import { parseFormSchema } from "@/lib/schema/parse";
import { ResponsesQuery } from "./queries";
import { ResponsesTable, type TableRow } from "./ResponsesTable";
import styles from "./responses.module.css";

/** Responses for one form: filter by version, page through, export to CSV in one click. */
export function ResponsesPage({ id }: { id: string }) {
  const [versionId, setVersionId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["responses", id, versionId, page],
    queryFn: () => gql(ResponsesQuery, { id, versionId, page }),
    placeholderData: keepPreviousData,
  });

  const versions = useMemo<VersionSchema[]>(
    () =>
      (query.data?.form.versions ?? []).flatMap((v) => {
        const parsed = parseFormSchema(v.schema);
        return parsed.ok ? [{ id: v.id, version: v.version, schema: parsed.schema }] : [];
      }),
    [query.data],
  );

  if (query.isPending) return <p className="page">Loading responses…</p>;
  if (query.isError) {
    const code = query.error instanceof GqlError ? query.error.code : "INTERNAL";
    return (
      <div className="page">
        <h1>{code === "NOT_FOUND" || code === "FORBIDDEN" ? "Form not found" : "Couldn't load responses"}</h1>
        <Link href="/app">Back to your forms</Link>
      </div>
    );
  }

  const form = query.data.form;
  const columns = columnsFor(versions, versionId ?? undefined);
  const rows = form.responses.items as TableRow[];
  const exportHref = `/api/forms/${id}/export${versionId ? `?versionId=${versionId}` : ""}`;

  function choose(next: string | null) {
    setVersionId(next);
    setPage(1);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Link href="/app" className={styles.back}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" /> Forms
        </Link>
        <h1>{form.title}</h1>
        <div className={styles.headerActions}>
          <Link href={`/app/forms/${id}`} className={styles.linkButton}>
            <PenLine size={16} strokeWidth={1.75} aria-hidden="true" /> Edit form
          </Link>
          {form.responses.total > 0 ? (
            <a href={exportHref} className={styles.linkButton} download>
              <Download size={16} strokeWidth={1.75} aria-hidden="true" /> Export CSV
            </a>
          ) : null}
        </div>
      </div>

      {versions.length > 1 ? (
        <div className={styles.toolbar}>
          <div className={styles.segmented} role="group" aria-label="Filter by version">
            <button type="button" className={styles.segment} aria-pressed={versionId === null} onClick={() => choose(null)}>
              All versions
            </button>
            {versions.map((v) => (
              <button key={v.id} type="button" className={styles.segment} aria-pressed={versionId === v.id} onClick={() => choose(v.id)}>
                v{v.version}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {versions.length === 0 ? (
        <p className={styles.empty}>
          This form isn&apos;t published yet. <Link href={`/app/forms/${id}`}>Publish it</Link> to start collecting responses.
        </p>
      ) : (
        <ResponsesTable columns={columns} rows={rows} total={form.responses.total} page={page} onPage={setPage} />
      )}
    </div>
  );
}
