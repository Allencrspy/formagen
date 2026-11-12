import type { TextareaHTMLAttributes } from "react";
import { FieldShell, fieldAria, type FieldBaseProps } from "./Field";
import styles from "./Field.module.css";

type Props = FieldBaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name" | "required">;

export function TextArea({ id, name, label, helpText, error, required, ...rest }: Props) {
  return (
    <FieldShell id={id} label={label} helpText={helpText} error={error} required={required}>
      <textarea
        {...rest}
        id={id}
        name={name}
        className={styles.control}
        {...fieldAria({ id, helpText, error, required })}
      />
    </FieldShell>
  );
}
