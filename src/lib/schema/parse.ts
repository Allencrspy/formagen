import { formSchemaSchema, type Field, type FormSchema, type SchemaIssue } from "./types";

export type ParseResult =
  | { ok: true; schema: FormSchema }
  | { ok: false; issues: SchemaIssue[] };

/**
 * Validates an unknown value as a form schema.
 * Step 1 checks the shape with Zod; step 2 checks rules that span fields
 * (unique ids, ranges, conditions pointing at earlier fields).
 */
export function parseFormSchema(input: unknown): ParseResult {
  const shape = formSchemaSchema.safeParse(input);
  if (!shape.success) {
    return { ok: false, issues: shape.error.issues.map((i) => toIssue(input, i.path, i.message)) };
  }

  const issues = crossFieldIssues(shape.data.fields);
  return issues.length > 0 ? { ok: false, issues } : { ok: true, schema: shape.data };
}

/** Turns a Zod path like ["fields", 2, "label"] into an issue on that field's id. */
function toIssue(input: unknown, path: PropertyKey[], message: string): SchemaIssue {
  if (path[0] === "fields" && typeof path[1] === "number") {
    const raw = (input as { fields?: unknown[] }).fields?.[path[1]];
    const id = (raw as { id?: unknown } | undefined)?.id;
    if (typeof id === "string") return { fieldId: id, message };
  }
  return { message };
}

function crossFieldIssues(fields: Field[]): SchemaIssue[] {
  const issues: SchemaIssue[] = [];
  const positions = new Map<string, number>();

  fields.forEach((field, index) => {
    if (positions.has(field.id)) {
      issues.push({ fieldId: field.id, message: "Field id must be unique" });
    } else {
      positions.set(field.id, index);
    }
  });

  fields.forEach((field, index) => {
    const issue = (message: string) => issues.push({ fieldId: field.id, message });

    if ((field.type === "shortText" || field.type === "longText") && isReversed(field.minLength, field.maxLength)) {
      issue("Minimum is greater than maximum");
    }
    if (field.type === "number" && isReversed(field.min, field.max)) {
      issue("Minimum is greater than maximum");
    }
    if (field.type === "select") {
      const values = field.options.map((o) => o.value);
      if (new Set(values).size !== values.length) issue("Option values must be unique");
    }
    if (field.showIf) {
      const target = positions.get(field.showIf.fieldId);
      if (target === undefined) issue("Condition refers to a field that does not exist");
      else if (target >= index) issue("Condition must refer to an earlier field");
    }
  });

  return issues;
}

function isReversed(min: number | undefined, max: number | undefined): boolean {
  return min !== undefined && max !== undefined && min > max;
}
