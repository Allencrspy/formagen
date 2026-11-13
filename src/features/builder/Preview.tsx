"use client";

import type { FocusEvent } from "react";
import { useStore } from "zustand";
import { FormRenderer } from "@/components/renderer/FormRenderer";
import type { BuilderStore } from "./store";
import styles from "./builder.module.css";

/**
 * The real form, rendered by the same renderer as the public page. Clicking (or tabbing)
 * into any field selects it for editing, so there's no separate "edit" step.
 */
export function Preview({ store }: { store: BuilderStore }) {
  const schema = useStore(store, (s) => s.schema);

  function onFocus(event: FocusEvent<HTMLDivElement>) {
    const id = (event.target as HTMLElement).id;
    if (schema.fields.some((f) => f.id === id)) store.getState().select(id);
  }

  return (
    <section aria-label="Preview" className={styles.previewPane}>
      <div className={styles.previewCard} onFocusCapture={onFocus}>
        <h2 className={styles.previewTitle}>{schema.title || "Untitled form"}</h2>
        {schema.fields.length === 0 ? (
          <p className={styles.empty}>Your form will appear here as you add fields.</p>
        ) : (
          <form noValidate onSubmit={(e) => e.preventDefault()}>
            <FormRenderer schema={schema} interactive />
          </form>
        )}
      </div>
    </section>
  );
}
