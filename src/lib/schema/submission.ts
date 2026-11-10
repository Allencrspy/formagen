import type { Field, FormSchema } from "./types";
import { isFieldVisible } from "./visibility";

export type Answers = Record<string, string | number | boolean>;

export type SubmissionResult =
  | { ok: true; answers: Answers }
  | { ok: false; errors: Record<string, string> };

const REQUIRED = "This field is required";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks a submission against a schema and returns cleaned, typed answers.
 *
 * Fields are checked top to bottom, and each condition is evaluated against the answers
 * accepted so far. Conditions can only point at earlier fields (see parseFormSchema), so
 * one pass is enough, and a field whose trigger is hidden is hidden too.
 * Hidden fields are neither validated nor stored; unknown keys are dropped.
 */
export function validateSubmission(schema: FormSchema, raw: Record<string, unknown>): SubmissionResult {
  const answers: Answers = {};
  const errors: Record<string, string> = {};

  for (const field of schema.fields) {
    if (!isFieldVisible(field, answers)) continue;

    const outcome = checkField(field, raw[field.id]);
    if ("error" in outcome) errors[field.id] = outcome.error;
    else if (outcome.value !== undefined) answers[field.id] = outcome.value;
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, answers };
}

type Outcome = { value: string | number | boolean | undefined } | { error: string };

function checkField(field: Field, input: unknown): Outcome {
  if (field.type === "checkbox") {
    const checked = input === true;
    return field.required && !checked ? { error: REQUIRED } : { value: checked };
  }

  const empty = input === undefined || input === null || (typeof input === "string" && input.trim() === "");
  if (empty) return field.required ? { error: REQUIRED } : { value: undefined };

  switch (field.type) {
    case "shortText":
    case "longText": {
      const text = String(input).trim();
      if (field.minLength !== undefined && text.length < field.minLength)
        return { error: `Must be at least ${field.minLength} characters` };
      if (field.maxLength !== undefined && text.length > field.maxLength)
        return { error: `Must be ${field.maxLength} characters or fewer` };
      return { value: text };
    }
    case "email": {
      const text = String(input).trim();
      return EMAIL.test(text) ? { value: text } : { error: "Enter a valid email address" };
    }
    case "number": {
      const n = typeof input === "number" ? input : Number(String(input).trim());
      if (!Number.isFinite(n)) return { error: "Enter a number" };
      if (field.min !== undefined && n < field.min) return { error: `Must be at least ${field.min}` };
      if (field.max !== undefined && n > field.max) return { error: `Must be ${field.max} or less` };
      return { value: n };
    }
    case "select": {
      const value = String(input);
      return field.options.some((o) => o.value === value) ? { value } : { error: "Choose one of the options" };
    }
    case "date": {
      const value = String(input).trim();
      return isRealDate(value) ? { value } : { error: "Enter a valid date" };
    }
  }
}

/** True for a real calendar date in YYYY-MM-DD form (rejects 2026-02-31). */
function isRealDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/**
 * Converts a posted HTML form into raw answers for validateSubmission.
 * Only fields in the schema are read. Empty inputs are left out, an unticked checkbox
 * (which browsers don't send at all) becomes false, and numeric text becomes a number.
 * Non-numeric text in a number field stays text so validation can report it.
 */
export function formDataToAnswers(schema: FormSchema, fd: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};

  for (const field of schema.fields) {
    if (field.type === "checkbox") {
      raw[field.id] = fd.has(field.id);
      continue;
    }
    const value = fd.get(field.id);
    if (typeof value !== "string" || value === "") continue;

    if (field.type === "number") {
      const n = Number(value);
      raw[field.id] = value.trim() !== "" && Number.isFinite(n) ? n : value;
    } else {
      raw[field.id] = value;
    }
  }

  return raw;
}
