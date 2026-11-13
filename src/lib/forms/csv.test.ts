import { describe, expect, it } from "vitest";
import type { FormSchema } from "@/lib/schema/types";
import { columnsFor, toCsv } from "./csv";

const v1: FormSchema = {
  schemaVersion: 1,
  title: "T",
  fields: [
    { id: "name", type: "shortText", label: "Name", required: true },
    { id: "old", type: "shortText", label: "Removed later", required: false },
    { id: "plan", type: "select", label: "Plan", required: false, options: [{ value: "pro", label: "Pro plan" }] },
  ],
};
const v2: FormSchema = {
  ...v1,
  fields: [
    { id: "name", type: "shortText", label: "Full name", required: true },
    { id: "plan", type: "select", label: "Plan", required: false, options: [{ value: "pro", label: "Pro plan" }] },
    { id: "news", type: "checkbox", label: "Newsletter", required: false },
  ],
};
const versions = [
  { id: "ver2", version: 2, schema: v2 },
  { id: "ver1", version: 1, schema: v1 },
];

describe("columnsFor", () => {
  it("uses the selected version's fields", () => {
    expect(columnsFor(versions, "ver1").map((c) => c.label)).toEqual(["Name", "Removed later", "Plan"]);
  });

  it("for all versions, uses the latest fields then fields only older versions had", () => {
    expect(columnsFor(versions).map((c) => [c.id, c.label])).toEqual([
      ["name", "Full name"],
      ["plan", "Plan"],
      ["news", "Newsletter"],
      ["old", "Removed later"],
    ]);
  });
});

describe("toCsv", () => {
  const columns = columnsFor(versions);
  const row = (answers: Record<string, string | number | boolean>, version = 2) => ({
    id: "r",
    versionId: `ver${version}`,
    version,
    answers,
    submittedAt: new Date("2026-11-13T09:30:00.000Z"),
  });

  it("writes a header and one quoted line per response, CRLF separated", () => {
    const csv = toCsv(columns, [row({ name: "Al", plan: "pro", news: true })]);
    expect(csv.split("\r\n")).toEqual([
      '"Submitted at","Version","Full name","Plan","Newsletter","Removed later"',
      '"2026-11-13T09:30:00.000Z","v2","Al","Pro plan","Yes",""',
    ]);
  });

  it("escapes quotes, commas and newlines", () => {
    const line = toCsv(columns, [row({ name: 'Al "the pal", Jr\nIII' })]).split("\r\n")[1];
    expect(line).toContain('"Al ""the pal"", Jr\nIII"');
  });

  it("neutralises spreadsheet formulas", () => {
    const csv = toCsv(columns, [row({ name: "=SUM(A1)" }), row({ name: "+1" }), row({ name: "-2" }), row({ name: "@cmd" })]);
    expect(csv).toContain(`"'=SUM(A1)"`);
    expect(csv).toContain(`"'+1"`);
    expect(csv).toContain(`"'-2"`);
    expect(csv).toContain(`"'@cmd"`);
  });

  it("keeps plain negative numbers from number fields readable", () => {
    const numCols = [{ id: "n", label: "N", field: { id: "n", type: "number" as const, label: "N", required: false } }];
    expect(toCsv(numCols, [row({ n: -5 })]).split("\r\n")[1]).toBe('"2026-11-13T09:30:00.000Z","v2","-5"');
  });

  it("starts with a BOM-free header even with no responses", () => {
    expect(toCsv(columns, [])).toBe('"Submitted at","Version","Full name","Plan","Newsletter","Removed later"');
  });
});
