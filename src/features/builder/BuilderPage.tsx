"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Copy, ExternalLink, Inbox } from "lucide-react";
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
  return (
    <Builder
      key={form.id}
      id={form.id}
      slug={form.slug}
      draft={draft}
      versions={[...form.versions].sort((a, b) => a.version - b.version)}
      responseCount={form.responseCount}
    />
  );
}

type PublishedVersion = { version: number; publishedAt: string };

function Builder({
  id,
  slug,
  draft,
  versions: initialVersions,
  responseCount,
}: {
  id: string;
  slug: string;
  draft: FormSchema;
  versions: PublishedVersion[];
  responseCount: number;
}) {
  const queryClient = useQueryClient();
  const [store] = useState(() => createBuilderStore(draft));
  // Oldest first. The last one is live.
  const [versions, setVersions] = useState<PublishedVersion[]>(initialVersions);
  const published = versions.at(-1)?.version ?? null;
  // The first publish can change the slug (from "untitled-form-…" to the title), so the share
  // link follows the publish result rather than waiting for a refetch and showing a dead link.
  const [liveSlug, setLiveSlug] = useState(slug);
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
      setVersions((current) => [...current, publishForm.version]);
      setLiveSlug(publishForm.slug);
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
      // Keep the cached form fresh for the next visit to this builder.
      void queryClient.invalidateQueries({ queryKey: ["form", id] });
    },
    onError: (error) => setPublishError(error instanceof GqlError ? error.message : "Publishing failed. Try again."),
  });

  useLeaveWarning(status !== "saved");

  return (
    <>
      <TopBar
        id={id}
        responseCount={responseCount}
        store={store}
        status={status}
        published={published}
        publishing={publish.isPending}
        publishError={publishError}
        onPublish={() => publish.mutate()}
      />
      {versions.length > 0 ? <LiveBar slug={liveSlug} versions={versions} /> : null}
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
  id,
  responseCount,
  store,
  status,
  published,
  publishing,
  publishError,
  onPublish,
}: {
  id: string;
  responseCount: number;
  store: BuilderStore;
  status: SaveStatus;
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
        {published !== null ? (
          <Link href={`/app/forms/${id}/responses`} className={styles.responsesLink}>
            <Inbox size={16} strokeWidth={1.75} aria-hidden="true" />
            {responseCount} {responseCount === 1 ? "response" : "responses"}
          </Link>
        ) : null}
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

const versionDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

/**
 * The plum live bar: what respondents get right now (version, link, one-click copy) and
 * every published version on a dated strip, newest on the right.
 */
function LiveBar({ slug, versions }: { slug: string; versions: PublishedVersion[] }) {
  const [copied, setCopied] = useState(false);
  const path = `/f/${slug}`;
  const live = versions.at(-1)!;

  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className={styles.liveBar} aria-label="Live form">
      <div className={styles.share}>
        <span className={styles.liveBadge}>
          <span className={styles.livePulse} aria-hidden="true" />v{live.version} live
        </span>
        <a href={path} target="_blank" rel="noreferrer" className={styles.shareLink}>
          {path}
          <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className="visually-hidden">(opens in a new tab)</span>
        </a>
        <button type="button" className={styles.copy} onClick={copy} aria-label={copied ? "Link copied" : "Copy link"}>
          {copied ? <Check size={16} strokeWidth={1.75} aria-hidden="true" /> : <Copy size={16} strokeWidth={1.75} aria-hidden="true" />}
        </button>
      </div>
      <ol className={styles.strip} aria-label="Published versions">
        {versions.length > 6 ? <li className={styles.stripMore}>{versions.length - 6} earlier</li> : null}
        {versions.slice(-6).map((v) => (
          <li key={v.version} className={v === live ? styles.stripLive : undefined}>
            <span className={styles.stripKey}>v{v.version}</span>
            <time dateTime={v.publishedAt}>{versionDate.format(new Date(v.publishedAt))}</time>
          </li>
        ))}
      </ol>
    </section>
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
