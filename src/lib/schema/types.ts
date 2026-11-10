import { z } from "zod";

/**
 * The form schema is the single source of truth for a form: the builder edits it,
 * the renderer draws it, and the server validates submissions against it.
 */

export const FIELD_TYPES = [
  "shortText",
  "longText",
  "email",
  "number",
  "select",
  "checkbox",
  "date",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

const showIf = z.object({
  fieldId: z.string().min(1),
  equals: z.union([z.string(), z.number(), z.boolean()]),
});

const base = {
  id: z.string().min(1),
  label: z.string().trim().min(1, "Label is required"),
  helpText: z.string().optional(),
  required: z.boolean(),
  showIf: showIf.optional(),
};

const lengthLimits = {
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().positive().optional(),
};

const option = z.object({
  value: z.string().min(1),
  label: z.string().trim().min(1, "Option label is required"),
});

export const fieldSchema = z.discriminatedUnion("type", [
  z.object({ ...base, type: z.literal("shortText"), ...lengthLimits }),
  z.object({ ...base, type: z.literal("longText"), ...lengthLimits }),
  z.object({ ...base, type: z.literal("email") }),
  z.object({
    ...base,
    type: z.literal("number"),
    min: z.number().optional(),
    max: z.number().optional(),
  }),
  z.object({
    ...base,
    type: z.literal("select"),
    options: z.array(option).min(1, "Add at least one option"),
  }),
  z.object({ ...base, type: z.literal("checkbox") }),
  z.object({ ...base, type: z.literal("date") }),
]);

export const formSchemaSchema = z.object({
  schemaVersion: z.literal(1),
  title: z.string().trim().min(1, "Title is required"),
  fields: z.array(fieldSchema),
});

export type Field = z.infer<typeof fieldSchema>;
export type ShowIf = z.infer<typeof showIf>;
export type FormSchema = z.infer<typeof formSchemaSchema>;

/** A problem found in a schema. `fieldId` is absent for form-level problems. */
export type SchemaIssue = { fieldId?: string; message: string };
