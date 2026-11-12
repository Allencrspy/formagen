import type { ReactNode } from "react";
import styles from "./Field.module.css";

/** Props every form control shares. */
export type FieldBaseProps = {
  id: string;
  name: string;
  label: string;
  helpText?: string;
  error?: string;
  required?: boolean;
};

/**
 * ARIA wiring shared by every control: help and error text are linked with
 * aria-describedby, errors set aria-invalid, and `required` becomes aria-required.
 * We deliberately don't use the native `required` attribute: forms post with
 * noValidate and the server's messages are the single source of truth.
 */
export function fieldAria({ id, helpText, error, required }: Pick<FieldBaseProps, "id" | "helpText" | "error" | "required">) {
  const describedBy = [helpText && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ");
  return {
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-required": required ? (true as const) : undefined,
  };
}

export function FieldMessages({ id, helpText, error }: Pick<FieldBaseProps, "id" | "helpText" | "error">) {
  return (
    <>
      {helpText && (
        <p id={`${id}-help`} className={styles.help}>
          {helpText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <span className="visually-hidden">Error:</span> {error}
        </p>
      )}
    </>
  );
}

export function RequiredMarker({ required }: { required?: boolean }) {
  return required ? <span className={styles.required}> (required)</span> : null;
}

/** Label above, then help/error text, then the control (GOV.UK-style order). */
export function FieldShell({
  id,
  label,
  helpText,
  error,
  required,
  children,
}: Omit<FieldBaseProps, "name"> & { children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        <RequiredMarker required={required} />
      </label>
      <FieldMessages id={id} helpText={helpText} error={error} />
      {children}
    </div>
  );
}
