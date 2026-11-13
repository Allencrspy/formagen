import type { Field, FormSchema } from "@/lib/schema/types";
import type { ResponseRow } from "./service";

export type Column = { id: string; label: string; field: Field };
export type VersionSchema = { id: string; version: number; schema: FormSchema };

/**
 * Columns for a responses table or export.
 * One version: that version's fields. All versions: the latest version's fields, then any
 * fields only older versions had, so no answer is ever hidden by a later edit.
 */
export function columnsFor(versions: VersionSchema[], versionId?: string): Column[] {
  const newestFirst = [...versions].sort((a, b) => b.version - a.version);
  const chosen = versionId ? newestFirst.filter((v) => v.id === versionId) : newestFirst;
  const columns: Column[] = [];
  const seen = new Set<string>();
  for (const v of chosen) {
    for (const field of v.schema.fields) {
      if (seen.has(field.id)) continue;
      seen.add(field.id);
      columns.push({ id: field.id, label: field.label, field });
    }
  }
  return columns;
}

/** How an answer reads to a person: choice labels, Yes/No, plain text. */
export function displayAnswer(field: Field, value: string | number | boolean | undefined): string {
  if (value === undefined) return "";
  if (field.type === "select") return field.options.find((o) => o.value === value)?.label ?? String(value);
  if (field.type === "checkbox") return value ? "Yes" : "No";
  return String(value);
}

/**
 * Spreadsheet-safe CSV (RFC 4180, CRLF). Every cell is quoted; text that a spreadsheet
 * would run as a formula (=, +, -, @, tab, CR) is prefixed with ' (CSV injection).
 */
export function toCsv(columns: Column[], rows: ResponseRow[]): string {
  const header = ["Submitted at", "Version", ...columns.map((c) => c.label)].map(cell).join(",");
  const lines = rows.map((r) =>
    [
      cell(r.submittedAt.toISOString()),
      cell(`v${r.version}`),
      ...columns.map((c) => {
        const value = r.answers[c.id];
        return typeof value === "number" ? cell(String(value)) : cell(neutralise(displayAnswer(c.field, value)));
      }),
    ].join(","),
  );
  return [header, ...lines].join("\r\n");
}

function neutralise(text: string): string {
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

function cell(text: string): string {
  return `"${text.replace(/"/g, '""')}"`;
}
