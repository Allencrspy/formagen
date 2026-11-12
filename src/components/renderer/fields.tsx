import type { ComponentType } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
import type { Field, FieldType } from "@/lib/schema/types";

export type FieldProps<T extends Field = Field> = {
  field: T;
  error?: string;
  /** A previously submitted value, echoed back after a failed submit. */
  value?: unknown;
};

type FieldOf<K extends FieldType> = Extract<Field, { type: K }>;

const text = (value: unknown) => (value === undefined || value === null ? undefined : String(value));

const common = ({ field, error }: FieldProps) => ({
  id: field.id,
  name: field.id,
  label: field.label,
  helpText: field.helpText,
  required: field.required,
  error,
});

/**
 * One component per field type. Adding a field type means adding a schema variant
 * and one entry here; TypeScript fails the build if a type has no component.
 */
export const fieldRegistry: { [K in FieldType]: ComponentType<FieldProps<FieldOf<K>>> } = {
  shortText: (p) => <TextField {...common(p)} defaultValue={text(p.value)} />,
  longText: (p) => <TextArea {...common(p)} defaultValue={text(p.value)} />,
  email: (p) => <TextField {...common(p)} type="email" autoComplete="email" defaultValue={text(p.value)} />,
  number: (p) => <TextField {...common(p)} type="number" inputMode="decimal" defaultValue={text(p.value)} />,
  date: (p) => <TextField {...common(p)} type="date" defaultValue={text(p.value)} />,
  select: (p) => <Select {...common(p)} options={p.field.options} defaultValue={text(p.value) ?? ""} />,
  checkbox: (p) => <Checkbox {...common(p)} defaultChecked={p.value === true} />,
};

export function FallbackField({ label }: { label?: string }) {
  return (
    <div role="note" style={{ marginBlockEnd: "var(--space-5)", color: "var(--color-text-muted)" }}>
      {label ? <strong>{label}: </strong> : null}
      This field can&apos;t be displayed
    </div>
  );
}
