import { describe, expect, it } from "vitest";
import { parseFormSchema } from "./parse";

const name = { id: "f1", type: "shortText", label: "Name", required: true };
const email = { id: "f2", type: "email", label: "Email", required: false };

const form = (fields: unknown[]) => ({ schemaVersion: 1, title: "Contact", fields });

function issuesOf(input: unknown) {
  const result = parseFormSchema(input);
  if (result.ok) throw new Error("expected the schema to be rejected");
  return result.issues;
}

function expectIssue(input: unknown, fieldId: string, message?: string) {
  const issues = issuesOf(input);
  const match = issues.find(
    (i) => i.fieldId === fieldId && (message === undefined || i.message === message),
  );
  expect(match, JSON.stringify(issues)).toBeDefined();
}

describe("parseFormSchema", () => {
  it("accepts a valid schema with every field type", () => {
    const result = parseFormSchema(
      form([
        name,
        email,
        { id: "f3", type: "longText", label: "Message", required: false, maxLength: 500 },
        { id: "f4", type: "number", label: "Age", required: false, min: 0, max: 120 },
        {
          id: "f5",
          type: "select",
          label: "Plan",
          required: true,
          options: [
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" },
          ],
        },
        { id: "f6", type: "checkbox", label: "Has company", required: false },
        {
          id: "f7",
          type: "shortText",
          label: "Company",
          required: true,
          showIf: { fieldId: "f6", equals: true },
        },
        { id: "f8", type: "date", label: "Start date", required: false },
      ]),
    );
    expect(result.ok).toBe(true);
  });

  it("returns the typed schema when valid", () => {
    const result = parseFormSchema(form([name]));
    expect(result).toEqual({ ok: true, schema: form([name]) });
  });

  it("rejects an unknown field type", () => {
    expectIssue(form([{ ...name, type: "rating" }]), "f1");
  });

  it("rejects a field with an empty label", () => {
    expectIssue(form([{ ...name, label: "  " }]), "f1", "Label is required");
  });

  it("rejects duplicate field ids", () => {
    expectIssue(form([name, { ...email, id: "f1" }]), "f1", "Field id must be unique");
  });

  it("rejects a select with no options", () => {
    expectIssue(
      form([{ id: "f1", type: "select", label: "Plan", required: false, options: [] }]),
      "f1",
      "Add at least one option",
    );
  });

  it("rejects duplicate option values", () => {
    expectIssue(
      form([
        {
          id: "f1",
          type: "select",
          label: "Plan",
          required: false,
          options: [
            { value: "a", label: "A" },
            { value: "a", label: "B" },
          ],
        },
      ]),
      "f1",
      "Option values must be unique",
    );
  });

  it("rejects minLength greater than maxLength", () => {
    expectIssue(form([{ ...name, minLength: 5, maxLength: 2 }]), "f1", "Minimum is greater than maximum");
  });

  it("rejects min greater than max on numbers", () => {
    expectIssue(
      form([{ id: "f1", type: "number", label: "Age", required: false, min: 10, max: 1 }]),
      "f1",
      "Minimum is greater than maximum",
    );
  });

  it("rejects showIf pointing at a field that does not exist", () => {
    expectIssue(
      form([name, { ...email, showIf: { fieldId: "nope", equals: "x" } }]),
      "f2",
      "Condition refers to a field that does not exist",
    );
  });

  it("rejects showIf pointing at a later field", () => {
    expectIssue(
      form([{ ...name, showIf: { fieldId: "f2", equals: "x" } }, email]),
      "f1",
      "Condition must refer to an earlier field",
    );
  });

  it("rejects showIf pointing at itself", () => {
    expectIssue(
      form([{ ...name, showIf: { fieldId: "f1", equals: "x" } }]),
      "f1",
      "Condition must refer to an earlier field",
    );
  });

  it("rejects schemaVersion other than 1", () => {
    expect(parseFormSchema({ ...form([name]), schemaVersion: 2 }).ok).toBe(false);
  });

  it("rejects input that is not an object", () => {
    expect(parseFormSchema("hello").ok).toBe(false);
    expect(parseFormSchema(null).ok).toBe(false);
  });

  it("reports form-level problems without a fieldId", () => {
    const issues = issuesOf({ schemaVersion: 1, title: "", fields: [] });
    expect(issues).toContainEqual({ message: "Title is required" });
  });
});
