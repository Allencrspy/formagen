import { describe, expect, it } from "vitest";
import type { Field, FormSchema } from "./types";
import { formDataToAnswers, validateSubmission } from "./submission";
import { isFieldVisible } from "./visibility";

const form = (fields: Field[]): FormSchema => ({ schemaVersion: 1, title: "T", fields });

const contact = form([
  { id: "name", type: "shortText", label: "Name", required: true, minLength: 2, maxLength: 5 },
  { id: "email", type: "email", label: "Email", required: false },
  { id: "age", type: "number", label: "Age", required: false, min: 18, max: 99 },
  {
    id: "plan",
    type: "select",
    label: "Plan",
    required: false,
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
    ],
  },
  { id: "start", type: "date", label: "Start", required: false },
]);

const conditional = form([
  { id: "hasCompany", type: "checkbox", label: "Has company", required: false },
  {
    id: "company",
    type: "shortText",
    label: "Company",
    required: true,
    showIf: { fieldId: "hasCompany", equals: true },
  },
  {
    id: "size",
    type: "number",
    label: "Company size",
    required: true,
    showIf: { fieldId: "company", equals: "Acme" },
  },
]);

function errorsFor(schema: FormSchema, raw: Record<string, unknown>) {
  const result = validateSubmission(schema, raw);
  return result.ok ? {} : result.errors;
}

function answersFor(schema: FormSchema, raw: Record<string, unknown>) {
  const result = validateSubmission(schema, raw);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.answers;
}

describe("isFieldVisible", () => {
  it("shows fields without a condition", () => {
    expect(isFieldVisible(contact.fields[0]!, {})).toBe(true);
  });

  it("shows a conditional field only when its trigger matches", () => {
    const company = conditional.fields[1]!;
    expect(isFieldVisible(company, { hasCompany: true })).toBe(true);
    expect(isFieldVisible(company, { hasCompany: false })).toBe(false);
    expect(isFieldVisible(company, {})).toBe(false);
  });
});

describe("validateSubmission", () => {
  it("requires required visible fields", () => {
    expect(errorsFor(contact, {})).toEqual({ name: "This field is required" });
  });

  it("treats whitespace-only text as empty", () => {
    expect(errorsFor(contact, { name: "   " })).toEqual({ name: "This field is required" });
  });

  it("enforces text length limits", () => {
    expect(errorsFor(contact, { name: "A" }).name).toBe("Must be at least 2 characters");
    expect(errorsFor(contact, { name: "Abcdef" }).name).toBe("Must be 5 characters or fewer");
  });

  it("checks email format", () => {
    expect(errorsFor(contact, { name: "Al", email: "x" }).email).toBe("Enter a valid email address");
  });

  it("enforces number range and type", () => {
    expect(errorsFor(contact, { name: "Al", age: 10 }).age).toBe("Must be at least 18");
    expect(errorsFor(contact, { name: "Al", age: 120 }).age).toBe("Must be 99 or less");
    expect(errorsFor(contact, { name: "Al", age: "abc" }).age).toBe("Enter a number");
  });

  it("rejects a select value that is not an option", () => {
    expect(errorsFor(contact, { name: "Al", plan: "zzz" }).plan).toBe("Choose one of the options");
  });

  it("rejects an invalid date", () => {
    expect(errorsFor(contact, { name: "Al", start: "2026-02-31" }).start).toBe("Enter a valid date");
    expect(errorsFor(contact, { name: "Al", start: "tomorrow" }).start).toBe("Enter a valid date");
  });

  it("returns cleaned answers for a valid submission", () => {
    expect(
      answersFor(contact, { name: " Al ", email: "al@example.com", age: "30", plan: "pro", start: "2026-11-10" }),
    ).toEqual({ name: "Al", email: "al@example.com", age: 30, plan: "pro", start: "2026-11-10" });
  });

  it("skips validation of hidden fields", () => {
    expect(validateSubmission(conditional, { hasCompany: false }).ok).toBe(true);
  });

  it("validates a conditional field once it is visible", () => {
    expect(errorsFor(conditional, { hasCompany: true })).toEqual({ company: "This field is required" });
  });

  it("drops answers for hidden fields", () => {
    expect(answersFor(conditional, { hasCompany: false, company: "Acme", size: 5 })).toEqual({
      hasCompany: false,
    });
  });

  it("hides a field whose trigger is itself hidden", () => {
    expect(answersFor(conditional, { hasCompany: false, company: "Acme" })).toEqual({ hasCompany: false });
  });

  it("drops unknown keys", () => {
    expect(answersFor(contact, { name: "Al", evil: "x" })).toEqual({ name: "Al" });
  });

  it("requires a required checkbox to be ticked", () => {
    const terms = form([{ id: "terms", type: "checkbox", label: "Terms", required: true }]);
    expect(errorsFor(terms, { terms: false })).toEqual({ terms: "This field is required" });
    expect(answersFor(terms, { terms: true })).toEqual({ terms: true });
  });
});

describe("formDataToAnswers", () => {
  it("converts form posts into typed values", () => {
    const fd = new FormData();
    fd.set("name", "Al");
    fd.set("email", "");
    fd.set("age", "30");
    fd.set("evil", "x");
    const schema = form([...contact.fields, ...conditional.fields.slice(0, 1)]);

    expect(formDataToAnswers(schema, fd)).toEqual({ name: "Al", age: 30, hasCompany: false });
  });

  it("marks a checkbox true when it is present", () => {
    const fd = new FormData();
    fd.set("hasCompany", "on");
    expect(formDataToAnswers(conditional, fd)).toEqual({ hasCompany: true });
  });

  it("keeps a non-numeric number input as text so validation can report it", () => {
    const fd = new FormData();
    fd.set("age", "abc");
    expect(formDataToAnswers(contact, fd)).toEqual({ age: "abc" });
  });
});
