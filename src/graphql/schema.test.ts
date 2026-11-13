// @vitest-environment node
import { graphql } from "graphql";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { createTestDb } from "@/lib/db/test-db";
import { createFormsService } from "@/lib/forms/service";
import type { FormSchema } from "@/lib/schema/types";
import type { GraphQLContext } from "./context";
import { schema } from "./schema";

const contact: FormSchema = {
  schemaVersion: 1,
  title: "Contact",
  fields: [{ id: "name", type: "shortText", label: "Name", required: true }],
};

let db: Db;
let onPublished: ReturnType<typeof vi.fn<(slug: string) => void>>;

beforeEach(async () => {
  db = await createTestDb();
  await db.insert(users).values([
    { id: "u1", email: "a@example.com", name: "Allen" },
    { id: "u2", email: "b@example.com" },
  ]);
  onPublished = vi.fn<(slug: string) => void>();
});

function run(source: string, userId: string | null, variableValues?: Record<string, unknown>) {
  const contextValue: GraphQLContext = { userId, forms: createFormsService(db), onPublished };
  return graphql({ schema, source, contextValue, variableValues });
}

async function ok<T = Record<string, unknown>>(source: string, userId: string | null, vars?: Record<string, unknown>) {
  const result = await run(source, userId, vars);
  if (result.errors?.length) throw new Error(JSON.stringify(result.errors));
  return result.data as T;
}

const codeOf = (result: Awaited<ReturnType<typeof run>>) => result.errors?.[0]?.extensions?.code;

const CREATE = `mutation($title: String!) { createForm(title: $title) { id title slug latestVersion } }`;
const UPDATE = `mutation($id: ID!, $schema: JSON!) { updateDraft(id: $id, schema: $schema) { ok issues { fieldId message } } }`;
const PUBLISH = `mutation($id: ID!) { publishForm(id: $id) { version } }`;

async function createPublished(userId = "u1") {
  const { createForm } = await ok<{ createForm: { id: string; slug: string } }>(CREATE, userId, { title: "Contact" });
  await ok(UPDATE, userId, { id: createForm.id, schema: contact });
  await ok(PUBLISH, userId, { id: createForm.id });
  return createForm;
}

describe("GraphQL admin API", () => {
  it("rejects unauthenticated access with UNAUTHENTICATED", async () => {
    expect(codeOf(await run(`{ forms { id } }`, null))).toBe("UNAUTHENTICATED");
    expect(codeOf(await run(CREATE, null, { title: "x" }))).toBe("UNAUTHENTICATED");
  });

  it("returns the signed-in user", async () => {
    expect(await ok(`{ me { id email name } }`, "u1")).toEqual({ me: { id: "u1", email: "a@example.com", name: "Allen" } });
  });

  it("creates a form with an empty draft and no versions", async () => {
    const { createForm } = await ok<{ createForm: Record<string, unknown> }>(CREATE, "u1", { title: "Contact" });
    expect(createForm).toMatchObject({ title: "Contact", latestVersion: null });
    const data = await ok<{ form: { draftSchema: unknown; versions: unknown[] } }>(
      `query($id: ID!) { form(id: $id) { draftSchema versions { version } } }`,
      "u1",
      { id: createForm.id },
    );
    expect(data.form).toEqual({ draftSchema: { schemaVersion: 1, title: "Contact", fields: [] }, versions: [] });
  });

  it("reports schema problems from updateDraft without saving", async () => {
    const { createForm } = await ok<{ createForm: { id: string } }>(CREATE, "u1", { title: "Contact" });
    const bad = { ...contact, fields: [contact.fields[0], { ...contact.fields[0] }] };
    expect(await ok(UPDATE, "u1", { id: createForm.id, schema: bad })).toEqual({
      updateDraft: { ok: false, issues: [{ fieldId: "name", message: "Field id must be unique" }] },
    });
  });

  it("publishes a version, lists it, and tells the public page to refresh", async () => {
    const form = await createPublished();
    const data = await ok<{ form: { latestVersion: number; versions: { version: number }[] } }>(
      `query($id: ID!) { form(id: $id) { latestVersion versions { version } } }`,
      "u1",
      { id: form.id },
    );
    expect(data.form).toEqual({ latestVersion: 1, versions: [{ version: 1 }] });
    const { form: after } = await ok<{ form: { slug: string } }>(`query($id: ID!) { form(id: $id) { slug } }`, "u1", { id: form.id });
    expect(onPublished).toHaveBeenCalledWith(after.slug);
  });

  it("maps publishing an empty form to BAD_USER_INPUT", async () => {
    const { createForm } = await ok<{ createForm: { id: string } }>(CREATE, "u1", { title: "Empty" });
    expect(codeOf(await run(PUBLISH, "u1", { id: createForm.id }))).toBe("BAD_USER_INPUT");
  });

  it("returns paged responses with the version each one answered", async () => {
    const form = await createPublished();
    await createFormsService(db).submitResponse(form.slug, { name: "Al" });
    const data = await ok<{ form: { responses: { total: number; items: { version: number; answers: unknown }[] } } }>(
      `query($id: ID!) { form(id: $id) { responses(page: 1) { total items { version answers submittedAt } } } }`,
      "u1",
      { id: form.id },
    );
    expect(data.form.responses.total).toBe(1);
    expect(data.form.responses.items[0]).toMatchObject({ version: 1, answers: { name: "Al" } });
  });

  it("lists only the caller's forms with counts", async () => {
    await createPublished("u1");
    await ok(CREATE, "u2", { title: "Other" });
    const data = await ok<{ forms: { title: string; responseCount: number }[] }>(`{ forms { title responseCount } }`, "u1");
    expect(data.forms).toEqual([{ title: "Contact", responseCount: 0 }]);
  });

  it("gives FORBIDDEN for another user's form and NOT_FOUND for a missing one", async () => {
    const form = await createPublished("u1");
    expect(codeOf(await run(`query($id: ID!) { form(id: $id) { id } }`, "u2", { id: form.id }))).toBe("FORBIDDEN");
    expect(codeOf(await run(PUBLISH, "u2", { id: form.id }))).toBe("FORBIDDEN");
    expect(codeOf(await run(`query($id: ID!) { form(id: $id) { id } }`, "u1", { id: "00000000-0000-0000-0000-000000000000" }))).toBe(
      "NOT_FOUND",
    );
  });

  it("deletes a form", async () => {
    const form = await createPublished();
    expect(await ok(`mutation($id: ID!) { deleteForm(id: $id) }`, "u1", { id: form.id })).toEqual({ deleteForm: true });
    expect(codeOf(await run(`query($id: ID!) { form(id: $id) { id } }`, "u1", { id: form.id }))).toBe("NOT_FOUND");
  });
});
