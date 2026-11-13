"use client";

import { AddFieldBar } from "./AddFieldBar";
import { FieldList } from "./FieldList";
import { Preview } from "./Preview";
import { PropertyPanel } from "./PropertyPanel";
import type { BuilderStore } from "./store";
import styles from "./builder.module.css";

/** Fields | live preview | settings for the selected field. */
export function Workspace({ store }: { store: BuilderStore }) {
  return (
    <div className={styles.workspace}>
      <section aria-labelledby="fields-heading" className={styles.fieldsPane}>
        <h2 id="fields-heading" className={styles.paneTitle}>
          Fields
        </h2>
        <FieldList store={store} />
        <h3 className={styles.paneSubtitle}>Add a field</h3>
        <AddFieldBar store={store} />
      </section>
      <Preview store={store} />
      <PropertyPanel store={store} />
    </div>
  );
}
