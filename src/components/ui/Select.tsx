import type { SelectHTMLAttributes } from "react";
import { FieldShell, fieldAria, type FieldBaseProps } from "./Field";
import styles from "./Field.module.css";

type Props = FieldBaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "required"> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

/** A native <select>: keyboard, screen-reader and mobile support come for free. */
export function Select({
  id,
  name,
  label,
  helpText,
  error,
  required,
  options,
  placeholder = "Choose…",
  defaultValue = "",
  ...rest
}: Props) {
  return (
    <FieldShell id={id} label={label} helpText={helpText} error={error} required={required}>
      <select
        {...rest}
        id={id}
        name={name}
        defaultValue={rest.value === undefined ? defaultValue : undefined}
        className={styles.control}
        {...fieldAria({ id, helpText, error, required })}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
