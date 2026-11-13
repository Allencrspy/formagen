"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { gql } from "@/graphql/client";
import { CreateFormMutation, FormsListQuery } from "./queries";
import styles from "./page.module.css";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Your forms. "New form" creates one and opens the builder in a single click. */
export function FormsList() {
  const router = useRouter();
  const forms = useQuery({ queryKey: ["forms"], queryFn: () => gql(FormsListQuery) });
  const create = useMutation({
    mutationFn: () => gql(CreateFormMutation, { title: "Untitled form" }),
    onSuccess: ({ createForm }) => router.push(`/app/forms/${createForm.id}`),
  });

  const newButton = (
    <Button onClick={() => create.mutate()} disabled={create.isPending}>
      <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
      {create.isPending ? "Creating…" : "New form"}
    </Button>
  );

  return (
    <div className="page" style={{ maxWidth: "60rem" }}>
      <div className={styles.listHeader}>
        <h1>Your forms</h1>
        {forms.data && forms.data.forms.length > 0 ? newButton : null}
      </div>

      {create.isError ? (
        <p role="alert" className={styles.publishError}>
          Couldn&apos;t create the form. Try again.
        </p>
      ) : null}

      {forms.isPending ? <p className={styles.muted}>Loading…</p> : null}
      {forms.isError ? <p role="alert">Couldn&apos;t load your forms. Refresh to try again.</p> : null}

      {forms.data && forms.data.forms.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Build your first form</h2>
          <p>Add fields, publish a version and share the link. It takes a couple of minutes.</p>
          {newButton}
        </div>
      ) : null}

      {forms.data && forms.data.forms.length > 0 ? (
        <table className={styles.formsTable}>
          <thead>
            <tr>
              <th scope="col">Form</th>
              <th scope="col">Status</th>
              <th scope="col">Responses</th>
              <th scope="col" className={styles.hideNarrow}>
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {forms.data.forms.map((f) => (
              <tr key={f.id}>
                <td>
                  <Link href={`/app/forms/${f.id}`} className={styles.formLink}>
                    {f.title}
                  </Link>
                </td>
                <td className={styles.muted}>{f.latestVersion ? `v${f.latestVersion} live` : "Draft"}</td>
                <td>
                  {f.latestVersion ? (
                    <Link href={`/app/forms/${f.id}/responses`} className={styles.formLink}>
                      {f.responseCount}
                    </Link>
                  ) : (
                    <span className={styles.muted}>—</span>
                  )}
                </td>
                <td className={`${styles.muted} ${styles.hideNarrow}`}>
                  <time dateTime={f.updatedAt}>{dateFmt.format(new Date(f.updatedAt))}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
