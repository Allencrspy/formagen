import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormSchema, SchemaIssue } from "@/lib/schema/types";
import { createBuilderStore } from "./store";
import { useAutosave, type SaveResult } from "./useAutosave";

const schema: FormSchema = { schemaVersion: 1, title: "T", fields: [] };

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function setup(save: (s: FormSchema) => Promise<SaveResult>) {
  const store = createBuilderStore(schema);
  const hook = renderHook(() => useAutosave({ store, save, delay: 800 }));
  return { store, hook };
}

const ok = () => Promise.resolve<SaveResult>({ ok: true });
const saveFn = () => vi.fn<(s: FormSchema) => Promise<SaveResult>>(ok);

describe("useAutosave", () => {
  it("debounces edits into one save after the delay", async () => {
    const save = saveFn();
    const { store, hook } = setup(save);
    act(() => {
      store.getState().setTitle("a");
      store.getState().setTitle("ab");
    });
    expect(hook.result.current.status).toBe("unsaved");
    await act(async () => vi.advanceTimersByTimeAsync(799));
    expect(save).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0]![0].title).toBe("ab");
    expect(hook.result.current.status).toBe("saved");
    expect(store.getState().dirty).toBe(false);
  });

  it("reports problems instead of saving an invalid draft", async () => {
    const issues: SchemaIssue[] = [{ fieldId: "x", message: "Label is required" }];
    const { store, hook } = setup(() => Promise.resolve({ ok: false, issues }));
    act(() => store.getState().setTitle("a"));
    await act(async () => vi.advanceTimersByTimeAsync(800));
    expect(hook.result.current.status).toBe("invalid");
    expect(store.getState().issues).toEqual(issues);
    expect(store.getState().dirty).toBe(true);
  });

  it("saves again when the draft changed while a save was in flight", async () => {
    let resolveFirst!: (r: SaveResult) => void;
    const save = vi
      .fn<(s: FormSchema) => Promise<SaveResult>>()
      .mockImplementationOnce(() => new Promise((r) => (resolveFirst = r)))
      .mockImplementation(ok);
    const { store, hook } = setup(save);
    act(() => store.getState().setTitle("one"));
    await act(async () => vi.advanceTimersByTimeAsync(800));
    expect(hook.result.current.status).toBe("saving");
    act(() => store.getState().setTitle("two"));
    await act(async () => resolveFirst({ ok: true }));
    expect(store.getState().dirty).toBe(true);
    await act(async () => vi.advanceTimersByTimeAsync(800));
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1]![0].title).toBe("two");
    expect(hook.result.current.status).toBe("saved");
  });

  it("flush saves immediately and reports whether everything is saved", async () => {
    const save = saveFn();
    const { store, hook } = setup(save);
    act(() => store.getState().setTitle("a"));
    let saved = false;
    await act(async () => {
      saved = await hook.result.current.flush();
    });
    expect(saved).toBe(true);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("shows an error status when the save request fails, and retries on the next edit", async () => {
    const save = vi.fn<(s: FormSchema) => Promise<SaveResult>>().mockRejectedValueOnce(new Error("offline")).mockImplementation(ok);
    const { store, hook } = setup(save);
    act(() => store.getState().setTitle("a"));
    await act(async () => vi.advanceTimersByTimeAsync(800));
    expect(hook.result.current.status).toBe("error");
    act(() => store.getState().setTitle("ab"));
    await act(async () => vi.advanceTimersByTimeAsync(800));
    expect(hook.result.current.status).toBe("saved");
  });
});
