import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { ErrorSummary } from "./ErrorSummary";
import { Select } from "./Select";
import { TextArea } from "./TextArea";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("associates the label with the input", () => {
    render(<TextField id="email" name="email" label="Email" type="email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });

  it("puts help text in the accessible description", () => {
    render(<TextField id="email" name="email" label="Email" helpText="We never share it" />);
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("We never share it");
  });

  it("marks the input invalid and describes it with the error", () => {
    render(<TextField id="email" name="email" label="Email" helpText="Work email" error="Enter a valid email address" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Work email Error: Enter a valid email address");
  });

  it("is not marked invalid without an error", () => {
    render(<TextField id="name" name="name" label="Name" />);
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });

  it("shows a visible required marker and sets aria-required, without native browser validation", () => {
    render(<TextField id="name" name="name" label="Name" required />);
    const input = screen.getByLabelText(/Name/);
    expect(screen.getByText("(required)")).toBeVisible();
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).not.toHaveAttribute("required");
  });

  it("keeps a default value for re-rendering a form after a failed submit", () => {
    render(<TextField id="name" name="name" label="Name" defaultValue="Al" />);
    expect(screen.getByLabelText("Name")).toHaveValue("Al");
  });
});

describe("TextArea", () => {
  it("is a labelled multi-line input with error description", () => {
    render(<TextArea id="msg" name="msg" label="Message" error="This field is required" />);
    const area = screen.getByLabelText("Message");
    expect(area.tagName).toBe("TEXTAREA");
    expect(area).toHaveAccessibleDescription("Error: This field is required");
  });
});

describe("Select", () => {
  const options = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
  ];

  it("renders a native select with a placeholder option first", () => {
    render(<Select id="plan" name="plan" label="Plan" options={options} />);
    const select = screen.getByLabelText("Plan");
    expect(select.tagName).toBe("SELECT");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Choose…", "Free", "Pro"]);
    expect(select).toHaveValue("");
  });

  it("selects the default value and shows errors", () => {
    render(<Select id="plan" name="plan" label="Plan" options={options} defaultValue="pro" error="Choose one of the options" />);
    const select = screen.getByLabelText("Plan");
    expect(select).toHaveValue("pro");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Checkbox", () => {
  it("is a labelled checkbox that can be ticked", async () => {
    render(<Checkbox id="terms" name="terms" label="I agree" />);
    const box = screen.getByRole("checkbox", { name: "I agree" });
    await userEvent.click(box);
    expect(box).toBeChecked();
  });

  it("describes errors", () => {
    render(<Checkbox id="terms" name="terms" label="I agree" error="This field is required" />);
    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription("Error: This field is required");
  });
});

describe("ErrorSummary", () => {
  const errors = [
    { fieldId: "name", label: "Name", message: "This field is required" },
    { fieldId: "email", label: "Email", message: "Enter a valid email address" },
  ];

  it("is an alert titled 'There is a problem' and takes focus", () => {
    render(<ErrorSummary errors={errors} />);
    const summary = screen.getByRole("alert");
    expect(summary).toHaveTextContent("There is a problem");
    expect(summary).toHaveFocus();
  });

  it("links each message to its field", () => {
    render(<ErrorSummary errors={errors} />);
    expect(screen.getByRole("link", { name: "Email: Enter a valid email address" })).toHaveAttribute("href", "#email");
  });

  it("renders nothing when there are no errors", () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("can be a submit button and handles clicks", async () => {
    const onClick = vi.fn();
    render(
      <Button type="submit" onClick={onClick}>
        Send
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
