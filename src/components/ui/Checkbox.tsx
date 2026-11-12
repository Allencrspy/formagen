import type { InputHTMLAttributes } from "react";
import { FieldMessages, RequiredMarker, fieldAria, type FieldBaseProps } from "./Field";
import styles from "./Field.module.css";

type Props = FieldBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "required" | "type">;

/** Checkbox with its label to the right; messages sit above, like other fields. */
export function Checkbox({ id, name, label, helpText, error, required, ...rest }: Props) {
  return (
    <div className={error ? `${styles.field} ${styles.hasError}` : styles.field}>
      <FieldMessages id={id} helpText={helpText} error={error} />
      <div className={styles.checkboxRow}>
        <input
          {...rest}
          id={id}
          name={name}
          type="checkbox"
          className={styles.checkbox}
          {...fieldAria({ id, helpText, error, required })}
        />
        <label htmlFor={id}>
          {label}
          <RequiredMarker required={required} />
        </label>
      </div>
    </div>
  );
}
