import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Column } from "@/lib/forms/csv";
import { ResponsesTable, type TableRow } from "./ResponsesTable";

const columns: Column[] = [
  { id: "name", label: "Name", field: { id: "name", type: "shortText", label: "Name", required: true } },
  {
    id: "plan",
    label: "Plan",
    field: { id: "plan", type: "select", label: "Plan", required: false, options: [{ value: "pro", label: "Pro plan" }] },
  },
  { id: "news", label: "Newsletter", field: { id: "news", type: "checkbox", label: "Newsletter", required: false } },
];

const rows: TableRow[] = [
  { id: "r1", version: 2, answers: { name: "Al", plan: "pro", news: true }, submittedAt: "2026-11-13T09:30:00.000Z" },
  { id: "r2", version: 1, answers: { name: "Bo" }, submittedAt: "2026-11-01T09:30:00.000Z" },
];

function renderTable(props: Partial<Parameters<typeof ResponsesTable>[0]> = {}) {
  const onPage = vi.fn();
  render(<ResponsesTable columns={columns} rows={rows} total={30} page={1} onPage={onPage} {...props} />);
  return { onPage };
}

describe("ResponsesTable", () => {
  it("has one column per field plus version and submitted date", () => {
    renderTable();
    const headers = screen.getAllByRole("columnheader").map((h) => h.textContent);
    expect(headers).toEqual(["Submitted", "Version", "Name", "Plan", "Newsletter"]);
  });

  it("shows answers the way people read them", () => {
    renderTable();
    const first = screen.getAllByRole("row")[1]!;
    expect(within(first).getByText("Pro plan")).toBeInTheDocument();
    expect(within(first).getByText("Yes")).toBeInTheDocument();
    expect(within(first).getByText("v2")).toBeInTheDocument();
  });

  it("marks fields a response didn't have with a dash", () => {
    renderTable();
    const second = screen.getAllByRole("row")[2]!;
    expect(within(second).getAllByText("—")).toHaveLength(2);
  });

  it("shows the range and pages forward and back", async () => {
    const { onPage } = renderTable({ page: 2, rows: rows.slice(0, 1) });
    expect(screen.getByText("26–30 of 30")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPage).toHaveBeenCalledWith(1);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("shows the first page range", () => {
    renderTable();
    expect(screen.getByText("1–25 of 30")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("renders nothing tabular when there are no responses", () => {
    renderTable({ rows: [], total: 0 });
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("No responses yet.")).toBeInTheDocument();
  });
});
