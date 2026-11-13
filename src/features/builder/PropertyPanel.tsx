"use client";

import { Plus, X } from "lucide-react";
import { useStore } from "zustand";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { FIELD_TYPES, type Field, type ShowIf } from "@/lib/schema/types";
import { FIELD_TYPE_LABEL, type BuilderStore } from "./store";
import styles from "./builder.module.css";

const toNumber = (v: string) => (v.trim() === "" || Number.isNaN(Number(v)) ? undefined : Number(v));
const CONDITION_TYPES = new Set<Field["type"]>(["checkbox", "select", "shortText"]);

/** Edits the selected field. Every change applies immediately (and autosaves). */
export function PropertyPanel({ store }: { store: BuilderStore }) {
  const fields = useStore(store, (s) => s.schema.fields);
  const selectedId = useStore(store, (s) => s.selectedId);
  const issues = useStore(store, (s) => s.issues);
  const index = fields.findIndex((f) => f.id === selectedId);
  const field = fields[index];

  if (!field) {
    return (
      <aside aria-label="Field settings" className={styles.panel}>
        <p className={styles.empty}>Select a field to edit it, or add one.</p>
      </aside>
    );
  }

  const { updateField, changeFieldType } = store.getState();
  const fieldIssues = issues.filter((i) => i.fieldId === field.id).map((i) => i.message);
  const errorFor = (match: string) => fieldIssues.find((m) => m.toLowerCase().includes(match));

  return (
    <aside aria-label="Field settings" className={styles.panel}>
      <h2 className={styles.panelTitle}>Field settings</h2>
      <TextField
        id="prop-label"
        name="label"
        label="Label"
        value={field.label}
        error={errorFor("label")}
        onChange={(e) => updateField(field.id, { label: e.target.value })}
      />
      <TextField
        id="prop-help"
        name="helpText"
        label="Help text (optional)"
        value={field.helpText ?? ""}
        onChange={(e) => updateField(field.id, { helpText: e.target.value || undefined })}
      />
      <Select
        id="prop-type"
        name="type"
        label="Type"
        value={field.type}
        placeholder="Type"
        options={FIELD_TYPES.map((t) => ({ value: t, label: FIELD_TYPE_LABEL[t] }))}
        onChange={(e) => changeFieldType(field.id, e.target.value as Field["type"])}
      />
      <Checkbox
        id="prop-required"
        name="required"
        label="Required"
        checked={field.required}
        onChange={(e) => updateField(field.id, { required: e.target.checked })}
      />

      {field.type === "shortText" || field.type === "longText" ? (
        <div className={styles.pair}>
          <TextField
            id="prop-minlength"
            name="minLength"
            label="Min length"
            type="number"
            inputMode="numeric"
            value={field.minLength ?? ""}
            error={errorFor("minimum")}
            onChange={(e) => updateField(field.id, { minLength: toNumber(e.target.value) })}
          />
          <TextField
            id="prop-maxlength"
            name="maxLength"
            label="Max length"
            type="number"
            inputMode="numeric"
            value={field.maxLength ?? ""}
            onChange={(e) => updateField(field.id, { maxLength: toNumber(e.target.value) })}
          />
        </div>
      ) : null}

      {field.type === "number" ? (
        <div className={styles.pair}>
          <TextField
            id="prop-min"
            name="min"
            label="Minimum"
            type="number"
            value={field.min ?? ""}
            error={errorFor("minimum")}
            onChange={(e) => updateField(field.id, { min: toNumber(e.target.value) })}
          />
          <TextField
            id="prop-max"
            name="max"
            label="Maximum"
            type="number"
            value={field.max ?? ""}
            onChange={(e) => updateField(field.id, { max: toNumber(e.target.value) })}
          />
        </div>
      ) : null}

      {field.type === "select" ? <OptionsEditor field={field} store={store} error={errorFor("option")} /> : null}

      <ConditionEditor field={field} earlier={fields.slice(0, index)} store={store} error={errorFor("condition")} />
    </aside>
  );
}

function OptionsEditor({ field, store, error }: { field: Extract<Field, { type: "select" }>; store: BuilderStore; error?: string }) {
  const { updateField } = store.getState();
  const options = field.options;

  function addOption() {
    const used = new Set(options.map((o) => o.value));
    let n = options.length + 1;
    while (used.has(`option_${n}`)) n += 1;
    updateField(field.id, { options: [...options, { value: `option_${n}`, label: `Option ${options.length + 1}` }] });
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Options</legend>
      {error ? <p className={styles.inlineError}>{error}</p> : null}
      <ol className={styles.options}>
        {options.map((option, i) => (
          <li key={option.value} className={styles.optionRow}>
            <label htmlFor={`opt-${option.value}`} className="visually-hidden">
              Option {i + 1}
            </label>
            <input
              id={`opt-${option.value}`}
              className={styles.optionInput}
              value={option.label}
              onChange={(e) =>
                updateField(field.id, { options: options.map((o) => (o.value === option.value ? { ...o, label: e.target.value } : o)) })
              }
            />
            <button
              type="button"
              className={styles.iconButton}
              aria-label={`Remove option ${i + 1}`}
              disabled={options.length === 1}
              onClick={() => updateField(field.id, { options: options.filter((o) => o.value !== option.value) })}
            >
              <X size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className={styles.textButton} onClick={addOption}>
        <Plus size={16} strokeWidth={1.75} aria-hidden="true" /> Add option
      </button>
    </fieldset>
  );
}

/** "Only show this field when <earlier field> is <value>". Conditions can only use earlier fields. */
function ConditionEditor({ field, earlier, store, error }: { field: Field; earlier: Field[]; store: BuilderStore; error?: string }) {
  const { updateField } = store.getState();
  const triggers = earlier.filter((f) => CONDITION_TYPES.has(f.type));
  const condition = field.showIf;
  const trigger = triggers.find((f) => f.id === condition?.fieldId);

  const defaultFor = (t: Field): ShowIf => ({
    fieldId: t.id,
    equals: t.type === "checkbox" ? true : t.type === "select" ? (t.options[0]?.value ?? "") : "",
  });

  return (
    <fieldset className={styles.fieldset}>
      <legend className="visually-hidden">Condition</legend>
      <Checkbox
        id="prop-condition"
        name="condition"
        label="Only show this field when…"
        helpText={triggers.length === 0 ? "Add a checkbox, choice or short text field above this one to use conditions." : undefined}
        disabled={triggers.length === 0}
        checked={!!condition}
        // Default to the nearest earlier field: it's almost always the one people mean.
        onChange={(e) => {
          const nearest = triggers.at(-1);
          updateField(field.id, { showIf: e.target.checked && nearest ? defaultFor(nearest) : undefined });
        }}
      />
      {error ? <p className={styles.inlineError}>{error}</p> : null}
      {condition ? (
        <div className={styles.pair}>
          <Select
            id="prop-condition-field"
            name="conditionField"
            label="Earlier field"
            placeholder="Choose a field"
            value={condition.fieldId}
            options={triggers.map((t) => ({ value: t.id, label: t.label || "Untitled field" }))}
            onChange={(e) => {
              const t = triggers.find((x) => x.id === e.target.value);
              if (t) updateField(field.id, { showIf: defaultFor(t) });
            }}
          />
          {trigger?.type === "checkbox" ? (
            <Select
              id="prop-condition-value"
              name="conditionValue"
              label="Is"
              placeholder="Choose"
              value={String(condition.equals)}
              options={[
                { value: "true", label: "Ticked" },
                { value: "false", label: "Not ticked" },
              ]}
              onChange={(e) => updateField(field.id, { showIf: { ...condition, equals: e.target.value === "true" } })}
            />
          ) : trigger?.type === "select" ? (
            <Select
              id="prop-condition-value"
              name="conditionValue"
              label="Equals"
              placeholder="Choose"
              value={String(condition.equals)}
              options={trigger.options}
              onChange={(e) => updateField(field.id, { showIf: { ...condition, equals: e.target.value } })}
            />
          ) : (
            <TextField
              id="prop-condition-value"
              name="conditionValue"
              label="Equals"
              value={String(condition.equals)}
              onChange={(e) => updateField(field.id, { showIf: { ...condition, equals: e.target.value } })}
            />
          )}
        </div>
      ) : null}
    </fieldset>
  );
}
