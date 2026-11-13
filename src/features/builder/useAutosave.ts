"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormSchema, SchemaIssue } from "@/lib/schema/types";
import type { BuilderStore } from "./store";

export type SaveResult = { ok: true } | { ok: false; issues: SchemaIssue[] };
export type SaveStatus = "saved" | "unsaved" | "saving" | "invalid" | "error";

/**
 * Saves the draft a moment after the last edit: no Save button.
 * - Only one save runs at a time; edits made during a save trigger another one after it.
 * - An invalid draft isn't saved; its problems are shown on the fields instead.
 * - flush() saves now (used before publishing) and resolves true if everything is saved.
 */
export function useAutosave({
  store,
  save,
  delay = 800,
}: {
  store: BuilderStore;
  save: (schema: FormSchema) => Promise<SaveResult>;
  delay?: number;
}) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef<Promise<void> | null>(null);
  const saveRef = useRef(save);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  const run = useCallback(async (): Promise<void> => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    // One save at a time: wait for any save in flight, then save whatever is newest.
    while (inFlight.current) await inFlight.current;
    if (!store.getState().dirty) return;

    const sent = store.getState().schema;
    setStatus("saving");
    const attempt = (async () => {
      try {
        const result = await saveRef.current(sent);
        if (result.ok) {
          store.getState().markSaved(sent);
          setStatus(store.getState().dirty ? "unsaved" : "saved");
        } else {
          store.getState().setIssues(result.issues);
          setStatus("invalid");
        }
      } catch {
        setStatus("error");
      }
    })();
    inFlight.current = attempt;
    await attempt;
    inFlight.current = null;
  }, [store]);

  useEffect(() => {
    return store.subscribe((state, prev) => {
      if (state.schema === prev.schema || !state.dirty) return;
      setStatus((s) => (s === "saving" ? s : "unsaved"));
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void run(), delay);
    });
  }, [store, delay, run]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const flush = useCallback(async () => {
    await run();
    const s = store.getState();
    return !s.dirty && s.issues.length === 0;
  }, [run, store]);

  return { status, flush };
}
