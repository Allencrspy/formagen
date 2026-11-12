import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" };

/** Defaults to type="button" so a button inside a form never submits it by accident. */
export function Button({ variant = "primary", type = "button", className, ...rest }: Props) {
  return <button {...rest} type={type} className={[styles.button, styles[variant], className].filter(Boolean).join(" ")} />;
}
