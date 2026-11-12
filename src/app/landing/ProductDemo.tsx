"use client";

import { AlignLeft, Calendar, CheckSquare, ChevronsUpDown, Hash, Mail, Type, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { FormRenderer } from "@/components/renderer/FormRenderer";
import { Button } from "@/components/ui/Button";
import { formDataToAnswers, validateSubmission } from "@/lib/schema/submission";
import type { Field } from "@/lib/schema/types";
import { DEMO_VERSIONS, SAMPLE_RESPONSES, type DemoResponse, type DemoVersion } from "./demo-forms";
import styles from "./landing.module.css";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`));

const TYPE_LABEL: Record<Field["type"], string> = {
  shortText: "Short text",
  longText: "Long text",
  email: "Email",
  number: "Number",
  select: "Choice",
  checkbox: "Checkbox",
  date: "Date",
};

const TYPE_ICON: Record<Field["type"], LucideIcon> = {
  shortText: Type,
  longText: AlignLeft,
  email: Mail,
  number: Hash,
  select: ChevronsUpDown,
  checkbox: CheckSquare,
  date: Calendar,
};

const LATEST = DEMO_VERSIONS.at(-1)!;

/** What each publish changed, newest first (demo content). */
const HISTORY = [
  { key: "v2", date: "2026-11-03", change: "Added \u201cWhat will you collect first?\u201d" },
  { key: "v1", date: "2026-10-02", change: "First published" },
] as const;

/**
 * The landing page's proof, drawn as the product: fields, live preview, and a responses
 * table where every row keeps the version it answered. Everything stays in the browser.
 */
export function ProductDemo() {
  const [active, setActive] = useState<DemoVersion["key"]>("v1");
  const [responses, setResponses] = useState<DemoResponse[]>(SAMPLE_RESPONSES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [newestId, setNewestId] = useState<string | null>(null);
  const segRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const nextId = useRef(0);

  const version = DEMO_VERSIONS.find((v) => v.key === active)!;
  const previous = DEMO_VERSIONS[DEMO_VERSIONS.indexOf(version) - 1];
  const isNew = (f: Field) => !!previous && !previous.schema.fields.some((p) => p.id === f.id);

  useEffect(() => {
    if (!newestId) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(newestId)?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [newestId]);

  function select(key: DemoVersion["key"]) {
    setActive(key);
    setErrors({});
    setResetKey((k) => k + 1);
  }

  function onSegKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const i = DEMO_VERSIONS.findIndex((v) => v.key === active);
    const next = DEMO_VERSIONS[(i + (event.key === "ArrowRight" ? 1 : -1) + DEMO_VERSIONS.length) % DEMO_VERSIONS.length]!;
    select(next.key);
    segRefs.current[next.key]?.focus();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = validateSubmission(version.schema, formDataToAnswers(version.schema, new FormData(form)));
    if (!result.ok) {
      setErrors(result.errors);
      const first = version.schema.fields.find((f) => result.errors[f.id]);
      if (first) form.querySelector<HTMLElement>(`#${first.id}`)?.focus();
      return;
    }
    nextId.current += 1;
    const id = `response-${nextId.current}`;
    setResponses((prev) => [{ id, version: version.key, answers: result.answers, submitted: new Date().toISOString().slice(0, 10) }, ...prev]);
    setNewestId(id);
    setErrors({});
    setResetKey((k) => k + 1);
    setAnnouncement(`Response recorded against ${version.key}.`);
  }

  return (
    <div className={styles.frame}>
      <div className={styles.frameBar}>
        <span className={styles.crumbs}>
          <span className={styles.crumbMuted}>Forms</span>
          <span aria-hidden="true" className={styles.crumbMuted}>
            /
          </span>
          {version.schema.title}
        </span>
        <div role="tablist" aria-label="Form version" className={styles.segmented}>
          {DEMO_VERSIONS.map((v) => (
            <button
              key={v.key}
              ref={(el) => {
                segRefs.current[v.key] = el;
              }}
              role="tab"
              id={`version-${v.key}`}
              aria-selected={v.key === active}
              aria-controls="demo-editor"
              tabIndex={v.key === active ? 0 : -1}
              className={styles.segment}
              onClick={() => select(v.key)}
              onKeyDown={onSegKeyDown}
            >
              {v.key}
              <span className={styles.segmentDate}>{formatDate(v.publishedOn)}</span>
            </button>
          ))}
        </div>
        <span className={styles.badge}>{active === LATEST.key ? "Live" : "Earlier version"}</span>
      </div>

      <div id="demo-editor" role="tabpanel" aria-labelledby={`version-${active}`} className={styles.editor}>
        <section aria-labelledby="fields-title" className={styles.fieldsPane}>
          <h3 id="fields-title" className={styles.paneTitle}>
            Fields
          </h3>
          <ol className={styles.fieldList}>
            {version.schema.fields.map((f) => (
              <li key={f.id} className={isNew(f) ? `${styles.fieldRow} ${styles.fieldRowNew}` : styles.fieldRow}>
                <FieldIcon type={f.type} />
                <span className={styles.fieldLabel}>{f.label}</span>
                <span className={styles.fieldType}>
                  {TYPE_LABEL[f.type]}
                  {f.required ? " · Required" : ""}
                </span>
                {isNew(f) ? <span className={styles.newBadge}>New in {version.key}</span> : null}
              </li>
            ))}
          </ol>

          <h3 id="history-title" className={`${styles.paneTitle} ${styles.historyTitle}`}>
            Versions
          </h3>
          <ol aria-labelledby="history-title" className={styles.history}>
            {HISTORY.map((h) => (
              <li key={h.key}>
                <button
                  type="button"
                  aria-pressed={h.key === active}
                  className={h.key === active ? `${styles.historyItem} ${styles.historyActive}` : styles.historyItem}
                  onClick={() => select(h.key)}
                >
                  <span className={styles.historyKey}>{h.key}</span>
                  <span className={styles.historyChange}>{h.change}</span>
                  <span className={styles.historyDate}>{formatDate(h.date)}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="preview-title" className={styles.previewPane}>
          <h3 id="preview-title" className={styles.paneTitle}>
            Preview <span className={styles.paneHint}>What respondents see</span>
          </h3>
          <form noValidate onSubmit={onSubmit} className={styles.previewForm}>
            <FormRenderer key={`${active}-${resetKey}`} schema={version.schema} errors={errors} interactive />
            <Button type="submit">Submit response</Button>
          </form>
        </section>
      </div>

      <section aria-labelledby="responses-title" className={styles.responses}>
        <div className={styles.responsesHead}>
          <h3 id="responses-title" className={styles.paneTitle}>
            Responses
          </h3>
          <span className={styles.responsesCount}>{responses.length}</span>
        </div>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{LATEST.schema.fields[0]!.label}</th>
                <th scope="col">Version</th>
                {LATEST.schema.fields.slice(1).map((f) => (
                  <th key={f.id} scope="col" className={f.type === "longText" ? styles.colFree : undefined}>
                    {f.label}
                  </th>
                ))}
                <th scope="col">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r) => {
                const answered = DEMO_VERSIONS.find((v) => v.key === r.version)!.schema;
                return (
                  <tr key={r.id} id={r.id} className={r.id === newestId ? styles.rowNew : undefined}>
                    <td>{String(r.answers[LATEST.schema.fields[0]!.id] ?? "")}</td>
                    <td>
                      <span className={styles.versionBadge}>{r.version}</span>
                    </td>
                    {LATEST.schema.fields.slice(1).map((f) => {
                      const inVersion = answered.fields.some((af) => af.id === f.id);
                      const value = r.answers[f.id];
                      return (
                        <td
                          key={f.id}
                          className={[inVersion ? "" : styles.cellAbsent, f.type === "longText" ? styles.colFree : ""].filter(Boolean).join(" ") || undefined}
                        >
                          {inVersion ? (value === undefined ? "" : display(f, value)) : <span aria-label={`Not in ${r.version}`}>—</span>}
                        </td>
                      );
                    })}
                    <td className={styles.cellMuted}>
                      {formatDate(r.submitted)}
                      {r.sample ? <span className={styles.sample}> · sample</span> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p role="status" aria-live="polite" className="visually-hidden">
          {announcement}
        </p>
      </section>
    </div>
  );
}

function FieldIcon({ type }: { type: Field["type"] }) {
  const Icon = TYPE_ICON[type];
  return (
    <span className={styles.fieldIcon} aria-hidden="true">
      <Icon size={16} strokeWidth={1.75} />
    </span>
  );
}

function display(field: Field, value: string | number | boolean): string {
  if (field.type === "select") return field.options.find((o) => o.value === value)?.label ?? String(value);
  if (field.type === "checkbox") return value ? "Yes" : "No";
  return String(value);
}
