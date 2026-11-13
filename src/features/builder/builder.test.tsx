import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { FormSchema } from "@/lib/schema/types";
import { Workspace } from "./Workspace";
import { createBuilderStore } from "./store";

const schema: FormSchema = {
  schemaVersion: 1,
  title: "Contact",
  fields: [
    { id: "a", type: "checkbox", label: "Has company", required: false },
    { id: "b", type: "shortText", label: "Company", required: false },
    { id: "c", type: "email", label: "Email", required: true },
  ],
};

function setup(initial: FormSchema = schema) {
  const store = createBuilderStore(initial);
  const user = userEvent.setup();
  render(<Workspace store={store} />);
  const preview = screen.getByRole("region", { name: "Preview" });
  return {
    store,
    user,
    preview,
    get list() {
      return screen.getByRole("list", { name: "Fields" });
    },
  };
}

describe("builder workspace", () => {
  it("adds a field in one click and opens it for editing", async () => {
    const { store, user } = setup();
    await user.click(screen.getByRole("button", { name: "Add Choice field" }));
    const added = store.getState().schema.fields.at(-1)!;
    expect(added.type).toBe("select");
    expect(store.getState().selectedId).toBe(added.id);
    expect(screen.getByRole("textbox", { name: "Label" })).toHaveValue("Choice");
  });

  it("reorders with keyboard buttons and announces the move", async () => {
    const { store, user } = setup();
    await user.click(screen.getByRole("button", { name: "Move Email up" }));
    expect(store.getState().schema.fields.map((f) => f.id)).toEqual(["a", "c", "b"]);
    // dnd-kit adds its own live region, so find ours by its text.
    expect(screen.getByText("Moved Email to position 2 of 3")).toHaveAttribute("role", "status");
  });

  it("disables moving the first field up and the last field down", () => {
    setup();
    expect(screen.getByRole("button", { name: "Move Has company up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move Email down" })).toBeDisabled();
  });

  it("editing the label in the panel updates the live preview", async () => {
    const { user, list, preview } = setup();
    await user.click(within(list).getByRole("button", { name: "Edit Email" }));
    const label = screen.getByRole("textbox", { name: "Label" });
    await user.clear(label);
    await user.type(label, "Work email");
    expect(within(preview).getByLabelText(/Work email/)).toBeInTheDocument();
  });

  it("clicking into a field in the preview selects it for editing", async () => {
    const { store, user, preview } = setup();
    await user.click(within(preview).getByLabelText(/Email/));
    expect(store.getState().selectedId).toBe("c");
    expect(screen.getByRole("textbox", { name: "Label" })).toHaveValue("Email");
  });

  it("shows schema problems next to the field they belong to", () => {
    const { store, list } = setup();
    act(() => store.getState().setIssues([{ fieldId: "c", message: "Label is required" }]));
    const row = within(list).getByRole("button", { name: "Edit Email" }).closest("li")!;
    expect(within(row).getByText("Label is required")).toBeInTheDocument();
  });

  it("removes a field", async () => {
    const { store, user } = setup();
    await user.click(screen.getByRole("button", { name: "Remove Company" }));
    expect(store.getState().schema.fields.map((f) => f.id)).toEqual(["a", "c"]);
  });

  it("sets a condition: show Company only when 'Has company' is ticked", async () => {
    const { store, user, list, preview } = setup();
    await user.click(within(list).getByRole("button", { name: "Edit Company" }));
    await user.click(screen.getByRole("checkbox", { name: "Only show this field when…" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Earlier field" }), "a");
    expect(store.getState().schema.fields[1]!.showIf).toEqual({ fieldId: "a", equals: true });
    expect(within(preview).queryByLabelText(/^Company/)).not.toBeInTheDocument();
    await user.click(within(preview).getByRole("checkbox", { name: "Has company" }));
    expect(within(preview).getByLabelText(/^Company/)).toBeInTheDocument();
  });

  it("defaults a new condition to the nearest earlier field", async () => {
    const { store, user, list } = setup();
    await user.click(within(list).getByRole("button", { name: "Edit Email" }));
    await user.click(screen.getByRole("checkbox", { name: "Only show this field when…" }));
    expect(store.getState().schema.fields[2]!.showIf?.fieldId).toBe("b");
  });

  it("offers only earlier fields as condition triggers", async () => {
    const { user, list } = setup();
    await user.click(within(list).getByRole("button", { name: "Edit Has company" }));
    expect(screen.getByRole("checkbox", { name: "Only show this field when…" })).toBeDisabled();
  });

  it("edits choice options", async () => {
    const { store, user } = setup({ ...schema, fields: [] });
    await user.click(screen.getByRole("button", { name: "Add Choice field" }));
    await user.click(screen.getByRole("button", { name: "Add option" }));
    const second = screen.getByRole("textbox", { name: "Option 2" });
    await user.clear(second);
    await user.type(second, "Pro plan");
    const field = store.getState().schema.fields[0]!;
    expect(field.type === "select" && field.options.map((o) => o.label)).toEqual(["Option 1", "Pro plan"]);
  });

  it("changes a field's type", async () => {
    const { store, user, list } = setup();
    await user.click(within(list).getByRole("button", { name: "Edit Company" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Type" }), "longText");
    expect(store.getState().schema.fields[1]!.type).toBe("longText");
  });
});
