"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { Button } from "@/components/ui/Button";
import { GqlError, gql } from "@/graphql/client";
import { parseFormSchema } from "@/lib/schema/parse";
import type { FormSchema } from "@/lib/schema/types";
import { BuilderFormQuery, PublishFormMutation, UpdateDraftMutation } from "./queries";
import { createBuilderStore, type BuilderStore } from "./store";
import { useAutosave, type SaveStatus } from "./useAutosave";
import { Workspace } from "./Workspace";
import styles from "./page.module.css";

/** Loads the form, then hands its draft to the builder. */
export function BuilderPage({ id }: { id: string }) {
  const query = useQuery({ queryKey: ["form", id], queryFn: () => gql(BuilderFormQuery, { id }) });

  if (query.isPending) return <p className="page">Loading form…</p>;
  if (query.isError) {
    const code = query.error instanceof GqlError ? query.error.code : "INTERNAL";
    return (
      <div className="page">
        <h1>{code === "NOT_FOUND" || code === "FORBIDDEN" ? "Form not found" : "Couldn't load this form"}</h1>
        <p>
          <Link href="/app">Back to your forms</Link>
        </p>
      </div>
    );
  }

  const form = query.data.form;
  const parsed = parseFormSchema(form.draftSchema);
  const draft: FormSchema = parsed.ok ? parsed.schema : { schemaVersion: 1, title: form.title, fields: [] };
  return <Builder key={form.id} id={form.id} slug={form.slug} draft={draft} latestVersion={form.latestVersion ?? null} />;
}

function Builder({ id, slug, draft, latestVersion }: { id: string; slug: string; draft: FormSchema; latestVersion: number | null }) {
  const queryClient = useQueryClient();
  const [store] = useState(() => createBuilderStore(draft));
  const [published, setPublished] = useState<number | null>(latestVersion);
  const [publishError, setPublishError] = useState<string | null>(null);

  const { status, flush } = useAutosave({
    store,
    save: async (schema) => {
      const { updateDraft } = await gql(UpdateDraftMutation, { id, schema });
      if (updateDraft.ok) void queryClient.invalidateQueries({ queryKey: ["forms"] });
      return updateDraft.ok ? { ok: true } : { ok: false, issues: updateDraft.issues.map((i) => ({ ...i, fieldId: i.fieldId ?? undefined })) };
    },
  });

  const publish = useMutation({
    mutationFn: async () => {
      setPublishError(null);
      if (!(await flush())) throw new GqlError("Fix the highlighted problems before publishing.", "BAD_USER_INPUT");
      return gql(PublishFormMutation, { id });
    },
    onSuccess: ({ publishForm }) => {
      setPublished(publishForm.version);
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
      // The first publish sets the public link from the title; refetch to show it.
      void queryClient.invalidateQueries({ queryKey: ["form", id] });
    },
    onError: (error) => setPublishError(error instanceof GqlError ? error.message : "Publishing failed. Try again."),
  });

  useLeaveWarning(status !== "saved");

  return (
    <>
      <TopBar
        store={store}
        status={status}
        slug={slug}
        published={published}
        publishing={publish.isPending}
        publishError={publishError}
        onPublish={() => publish.mutate()}
      />
      <Workspace store={store} />
    </>
  );
}

const STATUS_TEXT: Record<SaveStatus, string> = {
  saved: "All changes saved",
  unsaved: "Unsaved changes",
  saving: "Saving…",
  invalid: "Fix the highlighted problems to save",
  error: "Couldn't save. Retrying on your next change",
};

function TopBar({
  store,
  status,
  slug,
  published,
  publishing,
  publishError,
  onPublish,
}: {
  store: BuilderStore;
  status: SaveStatus;
  slug: string;
  published: number | null;
  publishing: boolean;
  publishError: string | null;
  onPublish: () => void;
}) {
  const title = useStore(store, (s) => s.schema.title);

  return (
    <div className={styles.topBar}>
      <Link href="/app" className={styles.back} aria-label="Back to your forms">
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
      </Link>
      <label htmlFor="form-title" className="visually-hidden">
        Form title
      </label>
      <input
        id="form-title"
        className={styles.titleInput}
        value={title}
        placeholder="Untitled form"
        onChange={(e) => store.getState().setTitle(e.target.value)}
      />
      <p className={status === "invalid" || status === "error" ? `${styles.status} ${styles.statusProblem}` : styles.status} aria-live="polite">
        {STATUS_TEXT[status]}
      </p>
      <div className={styles.actions}>
        {published !== null ? <ShareLink slug={slug} version={published} /> : null}
        <Button onClick={onPublish} disabled={publishing}>
          {publishing ? "Publishing…" : published === null ? "Publish" : "Publish new version"}
        </Button>
      </div>
      {publishError ? (
        <p role="alert" className={styles.publishError}>
          {publishError}
        </p>
      ) : null}
    </div>
  );
}

/** The live link with one-click copy. Shown as soon as a version exists. */
function ShareLink({ slug, version }: { slug: string; version: number }) {
  const [copied, setCopied] = useState(false);
  const path = `/f/${slug}`;

  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={styles.share}>
      <span className={styles.liveBadge}>v{version} live</span>
      <a href={path} target="_blank" rel="noreferrer" className={styles.shareLink}>
        {path}
        <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
        <span className="visually-hidden">(opens in a new tab)</span>
      </a>
      <button type="button" className={styles.copy} onClick={copy} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? <Check size={16} strokeWidth={1.75} aria-hidden="true" /> : <Copy size={16} strokeWidth={1.75} aria-hidden="true" />}
      </button>
    </div>
  );
}

/** Warn before closing the tab while changes aren't saved yet. */
function useLeaveWarning(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [active]);
}
