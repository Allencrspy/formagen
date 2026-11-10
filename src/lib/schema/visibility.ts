import type { Field } from "./types";

/** A field is visible when it has no condition, or its trigger field's answer matches exactly. */
export function isFieldVisible(field: Field, answers: Record<string, unknown>): boolean {
  if (!field.showIf) return true;
  return answers[field.showIf.fieldId] === field.showIf.equals;
}
