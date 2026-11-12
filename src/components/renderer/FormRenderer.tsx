"use client";

import { useMemo, useState, useSyncExternalStore, type ChangeEvent, type ComponentType } from "react";
import type { Field, FormSchema } from "@/lib/schema/types";
import { isFieldVisible } from "@/lib/schema/visibility";
import { FallbackField, fieldRegistry, type FieldProps } from "./fields";

type Props = {
  schema: FormSchema;
  errors?: Record<string, string>;
  values?: Record<string, unknown>;
  /**
   * Hide fields whose condition isn't met, updating as the person types.
   * Applied only after hydration: the server HTML always contains every field,
   * so the form still works with JavaScript off (the server ignores hidden answers).
   */
  interactive?: boolean;
};

/**
 * Turns a form schema into controls. Renders fields only (no <form>), so the public
 * page and the builder preview can each wrap it in their own form.
 */
export function FormRenderer({ schema, errors = {}, values = {}, interactive = false }: Props) {
  const hydrated = useIsClient();
  const [live, setLive] = useState<Record<string, unknown>>(values);

  const hideHidden = interactive && hydrated;
  const visible = useMemo(() => (hideHidden ? visibleFieldIds(schema.fields, live) : null), [hideHidden, schema, live]);

  function onChange(event: ChangeEvent<HTMLDivElement>) {
    if (!interactive) return;
    const target = event.target as unknown as HTMLInputElement;
    const field = schema.fields.find((f) => f.id === target.name);
    if (field) setLive((prev) => ({ ...prev, [field.id]: readValue(field, target) }));
  }

  return (
    <div onChange={onChange}>
      {schema.fields.map((field) => {
        if (visible && !visible.has(field.id)) return null;
        const Component = fieldRegistry[field.type] as ComponentType<FieldProps> | undefined;
        if (!Component) return <FallbackField key={field.id} label={field.label} />;
        return <Component key={field.id} field={field} error={errors[field.id]} value={values[field.id]} />;
      })}
    </div>
  );
}

const noopSubscribe = () => () => {};

/** false in the server render and during hydration, true afterwards. */
function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Same top-to-bottom rule as server validation: a field is visible if its trigger is. */
function visibleFieldIds(fields: Field[], live: Record<string, unknown>): Set<string> {
  const shown = new Set<string>();
  const accepted: Record<string, unknown> = {};
  for (const field of fields) {
    if (!isFieldVisible(field, accepted)) continue;
    shown.add(field.id);
    if (live[field.id] !== undefined) accepted[field.id] = live[field.id];
  }
  return shown;
}

function readValue(field: Field, input: HTMLInputElement): unknown {
  if (field.type === "checkbox") return input.checked;
  if (field.type === "number") return input.value === "" ? undefined : Number(input.value);
  return input.value === "" ? undefined : input.value;
}
