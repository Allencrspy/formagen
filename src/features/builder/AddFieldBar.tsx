"use client";

import { FieldTypeIcon } from "@/components/FieldTypeIcon";
import { FIELD_TYPES } from "@/lib/schema/types";
import { FIELD_TYPE_LABEL, type BuilderStore } from "./store";
import styles from "./builder.module.css";

/** Every field type one click away; the new field is added after the selected one. */
export function AddFieldBar({ store }: { store: BuilderStore }) {
  return (
    <div className={styles.addBar} role="group" aria-label="Add a field">
      {FIELD_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          className={styles.addButton}
          aria-label={`Add ${FIELD_TYPE_LABEL[type]} field`}
          onClick={() => store.getState().addField(type, store.getState().selectedId ?? undefined)}
        >
          <FieldTypeIcon type={type} />
          <span>{FIELD_TYPE_LABEL[type]}</span>
        </button>
      ))}
    </div>
  );
}
