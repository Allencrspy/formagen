import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { FormSchema } from "@/lib/schema/types";
import { FormRenderer } from "./FormRenderer";

const everyType: FormSchema = {
  schemaVersion: 1,
  title: "All fields",
  fields: [
    { id: "name", type: "shortText", label: "Name", required: true },
    { id: "bio", type: "longText", label: "Bio", required: false },
    { id: "email", type: "email", label: "Email", required: false, helpText: "Work email" },
    { id: "age", type: "number", label: "Age", required: false },
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
    { id: "news", type: "checkbox", label: "Send news", required: false },
    { id: "start", type: "date", label: "Start", required: false },
  ],
};

const conditional: FormSchema = {
  schemaVersion: 1,
  title: "Conditional",
  fields: [
    { id: "hasCompany", type: "checkbox", label: "I have a company", required: false },
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
      required: false,
      showIf: { fieldId: "company", equals: "Acme" },
    },
  ],
};

describe("FormRenderer", () => {
  it("renders one correctly typed control per field type", () => {
    render(<FormRenderer schema={everyType} />);
    expect(screen.getByLabelText(/Name/)).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Age")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Start")).toHaveAttribute("type", "date");
    expect(screen.getByRole("checkbox", { name: "Send news" })).toBeInTheDocument();
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Choose…", "Free", "Pro"]);
  });

  it("uses field ids as input names so a plain form post matches the schema", () => {
    render(<FormRenderer schema={everyType} />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
  });

  it("passes help text, required and errors through to the controls", () => {
    render(<FormRenderer schema={everyType} errors={{ email: "Enter a valid email address" }} />);
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("Work email Error: Enter a valid email address");
    expect(screen.getByLabelText(/Name/)).toHaveAttribute("aria-required", "true");
  });

  it("fills in previously submitted values", () => {
    render(<FormRenderer schema={everyType} values={{ name: "Al", age: 30, plan: "pro", news: true }} />);
    expect(screen.getByLabelText(/Name/)).toHaveValue("Al");
    expect(screen.getByLabelText("Age")).toHaveValue(30);
    expect(screen.getByLabelText("Plan")).toHaveValue("pro");
    expect(screen.getByRole("checkbox", { name: "Send news" })).toBeChecked();
  });

  it("renders a fallback for an unknown field type and keeps the rest of the form", () => {
    const broken = {
      ...everyType,
      fields: [{ id: "x", type: "rating", label: "Rate us", required: false }, everyType.fields[0]!],
    } as unknown as FormSchema;
    render(<FormRenderer schema={broken} />);
    expect(screen.getByText("This field can't be displayed")).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
  });

  it("renders every field when not interactive (no-JS public page)", () => {
    render(<FormRenderer schema={conditional} />);
    expect(screen.getByLabelText(/Company$|Company \(required\)/)).toBeInTheDocument();
    expect(screen.getByLabelText("Company size")).toBeInTheDocument();
  });

  it("interactive mode hides a conditional field until its trigger matches", async () => {
    render(<FormRenderer schema={conditional} interactive />);
    expect(screen.queryByLabelText(/^Company/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("checkbox", { name: "I have a company" }));
    const company = screen.getByLabelText(/^Company/);
    expect(screen.queryByLabelText("Company size")).not.toBeInTheDocument();

    await userEvent.type(company, "Acme");
    expect(screen.getByLabelText("Company size")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("checkbox", { name: "I have a company" }));
    expect(screen.queryByLabelText(/^Company/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Company size")).not.toBeInTheDocument();
  });

  it("interactive mode starts from submitted values", () => {
    render(<FormRenderer schema={conditional} values={{ hasCompany: true }} interactive />);
    expect(screen.getByLabelText(/^Company/)).toBeInTheDocument();
  });
});
