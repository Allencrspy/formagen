"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/** Friendly fallback for unexpected errors. console.error reaches CloudWatch from Lambda. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page">
      <h1>Something went wrong</h1>
      <p>This page hit an unexpected problem. Nothing you entered was lost on our side; try again.</p>
      {error.digest ? <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>Reference: {error.digest}</p> : null}
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
