"use client";

import { useFormStatus } from "react-dom";
import { FormRenderer } from "@/components/renderer/FormRenderer";
import { Button } from "@/components/ui/Button";
import { ErrorSummary } from "@/components/ui/ErrorSummary";
import type { FormSchema } from "@/lib/schema/types";
import { submitForm } from "./actions";
import type { Flash } from "./flash";
import styles from "./public.module.css";

/**
 * The respondent's form. A plain form posting to a Server Action, so it works without
 * JavaScript; with JavaScript it adds live conditional fields and a pending state.
 * Errors and typed values arrive from the server after a failed submit (see flash.ts).
 */
export function PublicForm({ slug, schema, flash }: { slug: string; schema: FormSchema; flash: Flash | null }) {
  const errors = flash?.errors ?? {};
  const summary = schema.fields
    .filter((f) => errors[f.id])
    .map((f) => ({ fieldId: f.id, label: f.label, message: errors[f.id]! }));

  return (
    <form action={submitForm.bind(null, slug)} noValidate className={styles.form}>
      <ErrorSummary errors={summary} />
      {flash?.formError ? (
        <p role="alert" className={styles.formError}>
          {flash.formError}
        </p>
      ) : null}
      <FormRenderer key={flash?.attempt ?? 0} schema={schema} errors={errors} values={flash?.values} interactive />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending…" : "Submit"}
    </Button>
  );
}
