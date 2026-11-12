import type { InputHTMLAttributes } from "react";
import { FieldShell, fieldAria, type FieldBaseProps } from "./Field";
import styles from "./Field.module.css";

type Props = FieldBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "required"> & {
    type?: "text" | "email" | "number" | "date" | "url" | "tel";
  };

export function TextField({ id, name, label, helpText, error, required, type = "text", ...rest }: Props) {
  return (
    <FieldShell id={id} label={label} helpText={helpText} error={error} required={required}>
      <input
        {...rest}
        id={id}
        name={name}
        type={type}
        className={styles.control}
        {...fieldAria({ id, helpText, error, required })}
      />
    </FieldShell>
  );
}
