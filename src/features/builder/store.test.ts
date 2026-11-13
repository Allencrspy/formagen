// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseFormSchema } from "@/lib/schema/parse";
import type { FormSchema } from "@/lib/schema/types";
import { createBuilderStore } from "./store";

const base: FormSchema = {
  schemaVersion: 1,
  title: "Contact",
  fields: [
    { id: "a", type: "checkbox", label: "Has company", required: false },
    { id: "b", type: "shortText", label: "Company", required: true, maxLength: 40, showIf: { fieldId: "a", equals: true } },
    { id: "c", type: "email", label: "Email", required: true },
  ],
};

const make = (schema: FormSchema = base) => createBuilderStore(schema);
const ids = (store: ReturnType<typeof make>) => store.getState().schema.fields.map((f) => f.id);

describe("builder store", () => {
  it("starts clean with nothing selected", () => {
    const s = make().getState();
    expect(s).toMatchObject({ dirty: false, selectedId: null, issues: [] });
    expect(s.schema).toEqual(base);
  });

  it("adds a field at the end, selects it and marks the draft dirty", () => {
    const store = make();
    store.getState().addField("shortText");
    const { schema, selectedId, dirty } = store.getState();
    const added = schema.fields.at(-1)!;
    expect(added).toMatchObject({ type: "shortText", label: "Short text", required: false });
    expect(added.id).toMatch(/^f_[a-z0-9]{8}$/);
    expect(selectedId).toBe(added.id);
    expect(dirty).toBe(true);
  });

  it("adds a select field with a starting option so the schema stays valid", () => {
    const store = make({ ...base, fields: [] });
    store.getState().addField("select");
    expect(parseFormSchema(store.getState().schema).ok).toBe(true);
  });

  it("can insert a field after another one", () => {
    const store = make();
    store.getState().addField("date", "a");
    expect(store.getState().schema.fields[1]?.type).toBe("date");
  });

  it("updates a field", () => {
    const store = make();
    store.getState().updateField("c", { label: "Work email", helpText: "We reply here" });
    expect(store.getState().schema.fields[2]).toMatchObject({ label: "Work email", helpText: "We reply here" });
    expect(store.getState().dirty).toBe(true);
  });

  it("moves a field to a new position", () => {
    const store = make();
    store.getState().moveField("c", 0);
    expect(ids(store)).toEqual(["c", "a", "b"]);
  });

  it("ignores a move to the same position or out of range", () => {
    const store = make();
    store.getState().moveField("a", 0);
    store.getState().moveField("a", 99);
    expect(ids(store)).toEqual(["a", "b", "c"]);
    expect(store.getState().dirty).toBe(false);
  });

  it("removes a field, clears conditions that pointed at it and the selection", () => {
    const store = make();
    store.getState().select("a");
    store.getState().removeField("a");
    const { schema, selectedId } = store.getState();
    expect(schema.fields.map((f) => f.id)).toEqual(["b", "c"]);
    expect(schema.fields[0]!.showIf).toBeUndefined();
    expect(selectedId).toBeNull();
    expect(parseFormSchema(schema).ok).toBe(true);
  });

  it("changing a field's type keeps id, label, required and condition but drops type-specific settings", () => {
    const store = make();
    store.getState().changeFieldType("b", "number");
    expect(store.getState().schema.fields[1]).toEqual({
      id: "b",
      type: "number",
      label: "Company",
      required: true,
      showIf: { fieldId: "a", equals: true },
    });
  });

  it("changing to select adds a starting option", () => {
    const store = make();
    store.getState().changeFieldType("c", "select");
    const field = store.getState().schema.fields[2]!;
    expect(field.type === "select" && field.options.length).toBe(1);
  });

  it("sets the title", () => {
    const store = make();
    store.getState().setTitle("Support request");
    expect(store.getState().schema.title).toBe("Support request");
    expect(store.getState().dirty).toBe(true);
  });

  it("markSaved clears dirty and issues; setIssues stores problems", () => {
    const store = make();
    store.getState().setTitle("x");
    store.getState().setIssues([{ fieldId: "c", message: "Label is required" }]);
    expect(store.getState().issues).toHaveLength(1);
    store.getState().markSaved();
    expect(store.getState()).toMatchObject({ dirty: false, issues: [] });
  });

  it("markSaved keeps dirty if the draft changed after the save started", () => {
    const store = make();
    store.getState().setTitle("one");
    const saving = store.getState().schema;
    store.getState().setTitle("two");
    store.getState().markSaved(saving);
    expect(store.getState().dirty).toBe(true);
  });
});
