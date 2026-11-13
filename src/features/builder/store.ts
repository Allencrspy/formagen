import { createStore } from "zustand/vanilla";
import type { Field, FieldType, FormSchema, SchemaIssue } from "@/lib/schema/types";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
/** Editable properties of a field; `type` changes go through changeFieldType. */
export type FieldPatch = Partial<DistributiveOmit<Field, "id" | "type">>;

export type BuilderState = {
  schema: FormSchema;
  selectedId: string | null;
  /** True when the draft differs from what was last saved. */
  dirty: boolean;
  issues: SchemaIssue[];

  addField: (type: FieldType, afterId?: string) => void;
  updateField: (id: string, patch: FieldPatch) => void;
  changeFieldType: (id: string, type: FieldType) => void;
  removeField: (id: string) => void;
  moveField: (id: string, toIndex: number) => void;
  select: (id: string | null) => void;
  setTitle: (title: string) => void;
  /**
   * Call when a save succeeds. Pass the schema that was sent: if the draft changed
   * while the save was in flight, it stays dirty so the newer edits aren't lost.
   */
  markSaved: (saved?: FormSchema) => void;
  setIssues: (issues: SchemaIssue[]) => void;
};

export const FIELD_TYPE_LABEL: Record<FieldType, string> = {
  shortText: "Short text",
  longText: "Long text",
  email: "Email",
  number: "Number",
  select: "Choice",
  checkbox: "Checkbox",
  date: "Date",
};

const ID_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function newFieldId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return `f_${Array.from(bytes, (b) => ID_CHARS[b % ID_CHARS.length]).join("")}`;
}

/** A field of the given type with only the shared properties carried over from `from`. */
function fieldOfType(type: FieldType, from: Pick<Field, "id" | "label" | "required" | "helpText" | "showIf">): Field {
  const shared = {
    id: from.id,
    label: from.label,
    required: from.required,
    ...(from.helpText !== undefined ? { helpText: from.helpText } : {}),
    ...(from.showIf !== undefined ? { showIf: from.showIf } : {}),
  };
  if (type === "select") return { ...shared, type, options: [{ value: "option_1", label: "Option 1" }] };
  return { ...shared, type } as Field;
}

/**
 * Builder state as a vanilla Zustand store, so it can be tested without React and
 * shared by the field list, property panel and preview through useStore.
 */
export function createBuilderStore(initial: FormSchema) {
  return createStore<BuilderState>()((set, get) => {
    /** Replace the field list and mark the draft dirty. */
    const setFields = (fields: Field[], extra: Partial<BuilderState> = {}) =>
      set((s) => ({ schema: { ...s.schema, fields }, dirty: true, ...extra }));

    return {
      schema: initial,
      selectedId: null,
      dirty: false,
      issues: [],

      addField: (type, afterId) => {
        const field = fieldOfType(type, { id: newFieldId(), label: FIELD_TYPE_LABEL[type], required: false });
        const fields = [...get().schema.fields];
        const at = afterId ? fields.findIndex((f) => f.id === afterId) + 1 : fields.length;
        fields.splice(at > 0 ? at : fields.length, 0, field);
        setFields(fields, { selectedId: field.id });
      },

      updateField: (id, patch) =>
        setFields(get().schema.fields.map((f) => (f.id === id ? ({ ...f, ...patch } as Field) : f))),

      changeFieldType: (id, type) =>
        setFields(get().schema.fields.map((f) => (f.id === id && f.type !== type ? fieldOfType(type, f) : f))),

      removeField: (id) => {
        const fields = get()
          .schema.fields.filter((f) => f.id !== id)
          .map((f) => {
            if (f.showIf?.fieldId !== id) return f;
            const rest = { ...f };
            delete rest.showIf;
            return rest;
          });
        setFields(fields, { selectedId: get().selectedId === id ? null : get().selectedId });
      },

      moveField: (id, toIndex) => {
        const fields = [...get().schema.fields];
        const from = fields.findIndex((f) => f.id === id);
        if (from < 0 || toIndex < 0 || toIndex >= fields.length || toIndex === from) return;
        const [field] = fields.splice(from, 1);
        fields.splice(toIndex, 0, field!);
        setFields(fields);
      },

      select: (id) => set({ selectedId: id }),

      setTitle: (title) => set((s) => ({ schema: { ...s.schema, title }, dirty: true })),

      markSaved: (saved) => set((s) => ({ dirty: saved !== undefined && saved !== s.schema, issues: [] })),

      setIssues: (issues) => set({ issues }),
    };
  });
}

export type BuilderStore = ReturnType<typeof createBuilderStore>;
