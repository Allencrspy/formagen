"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { FormRenderer } from "@/components/renderer/FormRenderer";
import { Button } from "@/components/ui/Button";
import { formDataToAnswers, validateSubmission } from "@/lib/schema/submission";
import type { Field } from "@/lib/schema/types";
import { DEMO_VERSIONS, SAMPLE_RESPONSES, type DemoVersion, type FiledResponse } from "./demo-forms";
import styles from "./landing.module.css";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`));

const TYPE_LABEL: Record<Field["type"], string> = {
  shortText: "short text",
  longText: "long text",
  email: "email",
  number: "number",
  select: "choice",
  checkbox: "checkbox",
  date: "date",
};

/**
 * The landing page's proof: a versioned form you can actually fill in.
 * Start on v1, switch to v2 to see a field added, file a response and watch it land
 * behind its version's guide card. Everything stays in the browser; nothing is sent.
 */
export function CatalogueDemo() {
  const [active, setActive] = useState<DemoVersion["key"]>("v1");
  const [filed, setFiled] = useState<FiledResponse[]>(SAMPLE_RESPONSES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [lastFiledId, setLastFiledId] = useState<string | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const nextId = useRef(0);

  const version = DEMO_VERSIONS.find((v) => v.key === active)!;
  const previous = DEMO_VERSIONS[DEMO_VERSIONS.indexOf(version) - 1];
  const newFieldIds = new Set(
    version.schema.fields.filter((f) => !previous?.schema.fields.some((p) => p.id === f.id)).map((f) => f.id),
  );

  // The filing moment has to be seen: bring the new slip into view once it lands.
  useEffect(() => {
    if (!lastFiledId) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(lastFiledId)?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [lastFiledId]);

  function selectTab(key: DemoVersion["key"]) {
    setActive(key);
    setErrors({});
    setResetKey((k) => k + 1);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const i = DEMO_VERSIONS.findIndex((v) => v.key === active);
    const next = DEMO_VERSIONS[(i + (event.key === "ArrowRight" ? 1 : -1) + DEMO_VERSIONS.length) % DEMO_VERSIONS.length]!;
    selectTab(next.key);
    tabRefs.current[next.key]?.focus();
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
    const id = `filed-${nextId.current}`;
    setFiled((prev) => [...prev, { id, version: version.key, answers: result.answers, stamped: new Date().toISOString().slice(0, 10) }]);
    setLastFiledId(id);
    setErrors({});
    setResetKey((k) => k + 1);
    setAnnouncement(`Response filed under ${version.key}.`);
  }

  return (
    <div className={styles.demo}>
      <div role="tablist" aria-label="Form versions" className={styles.tabs}>
        {DEMO_VERSIONS.map((v, i) => (
          <button
            key={v.key}
            ref={(el) => {
              tabRefs.current[v.key] = el;
            }}
            role="tab"
            id={`tab-${v.key}`}
            aria-selected={v.key === active}
            aria-controls="demo-card"
            tabIndex={v.key === active ? 0 : -1}
            className={styles.tab}
            style={{ marginInlineStart: i === 0 ? undefined : `${i * 2}rem` }}
            onClick={() => selectTab(v.key)}
            onKeyDown={onTabKeyDown}
          >
            <span className={styles.tabKey}>{v.key}</span>
            <span className={styles.tabDate}>
              <span className={styles.wideOnly}>published </span>
              {formatDate(v.filedOn)}
            </span>
          </button>
        ))}
      </div>

      <div id="demo-card" role="tabpanel" aria-labelledby={`tab-${active}`} className={styles.card}>
        <div className={styles.cardHead}>
          <span className={styles.cardTitle}>{version.schema.title}</span>
          <span className={styles.callNo} aria-label={`Version ${version.key}`}>
            {version.key}
          </span>
        </div>

        <div className={styles.cardBody}>
          <section aria-labelledby="schema-title" className={styles.schema}>
            <h3 id="schema-title" className={styles.paneTitle}>
              The card <span className={styles.paneNote}>what you build</span>
            </h3>
            <ol className={styles.entries}>
              {version.schema.fields.map((f) => (
                <li key={f.id} className={newFieldIds.has(f.id) && previous ? `${styles.entry} ${styles.entryNew}` : styles.entry}>
                  <span className={styles.entryLabel}>{f.label}</span>
                  <span className={styles.entryMeta}>
                    {TYPE_LABEL[f.type]}
                    {f.required ? " · required" : ""}
                    {f.type === "select" ? ` · ${f.options.length} choices` : ""}
                    {newFieldIds.has(f.id) && previous ? <span className={styles.added}> · added in {version.key}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="form-title" className={styles.live}>
            <h3 id="form-title" className={styles.paneTitle}>
              The form <span className={styles.paneNote}>what people fill in</span>
            </h3>
            <form noValidate onSubmit={onSubmit} className={styles.liveForm}>
              <FormRenderer key={`${active}-${resetKey}`} schema={version.schema} errors={errors} interactive />
              <Button type="submit">File response</Button>
              <p className={styles.demoNote}>Demo. Responses stay in your browser.</p>
            </form>
          </section>
        </div>
      </div>

      <section aria-labelledby="drawer-title" className={styles.drawer}>
        <div className={styles.drawerFront}>
          <h3 id="drawer-title" className={styles.drawerLabel}>
            Filed responses
          </h3>
          <span className={styles.drawerCount}>{filed.length} filed</span>
        </div>
        <div className={styles.drawerBody}>
          {DEMO_VERSIONS.map((v) => {
            const rows = filed.filter((r) => r.version === v.key);
            return (
              <div key={v.key} className={styles.drawerRow}>
                <div className={styles.guide}>
                  <span className={styles.guideKey}>{v.key}</span>
                  <span className={styles.guideMeta}>{v.schema.fields.length} fields</span>
                </div>
                <ol className={styles.slips} aria-label={`Responses to ${v.key}`}>
                  {rows.map((r) => (
                    <li
                      key={r.id}
                      id={r.id}
                      className={r.id === lastFiledId ? `${styles.slip} ${styles.slipNew}` : styles.slip}
                    >
                      <span className={styles.slipName}>{String(r.answers.name ?? "Response")}</span>
                      <span className={styles.slipSummary}>{summarize(v.schema.fields, r.answers)}</span>
                      <span className={styles.stamp}>
                        {r.sample ? "sample · " : ""}filed {formatDate(r.stamped)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
        <p role="status" aria-live="polite" className="visually-hidden">
          {announcement}
        </p>
      </section>
    </div>
  );
}

/** One line of the answers after the name, in the version's own field order. */
function summarize(fields: Field[], answers: FiledResponse["answers"]): string {
  return fields
    .filter((f) => f.id !== "name" && answers[f.id] !== undefined)
    .map((f) => (f.type === "select" ? (f.options.find((o) => o.value === answers[f.id])?.label ?? "") : String(answers[f.id])))
    .join(" · ");
}
