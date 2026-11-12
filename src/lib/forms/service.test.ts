// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/lib/db/client";
import { responses, users } from "@/lib/db/schema";
import { createTestDb } from "@/lib/db/test-db";
import type { FormSchema } from "@/lib/schema/types";
import { ForbiddenError, NotFoundError, ValidationError } from "./errors";
import { createFormsService } from "./service";
import { makeSlug } from "./slug";

const contact: FormSchema = {
  schemaVersion: 1,
  title: "Contact",
  fields: [{ id: "name", type: "shortText", label: "Name", required: true }],
};
const withEmail: FormSchema = {
  ...contact,
  fields: [...contact.fields, { id: "email", type: "email", label: "Email", required: false }],
};

let db: Db;
let svc: ReturnType<typeof createFormsService>;

beforeEach(async () => {
  db = await createTestDb();
  await db.insert(users).values([
    { id: "u1", email: "a@example.com" },
    { id: "u2", email: "b@example.com" },
  ]);
  svc = createFormsService(db);
});

async function publishedForm(schema: FormSchema = contact) {
  const form = await svc.createForm("u1", schema.title);
  expect(await svc.updateDraft("u1", form.id, schema)).toEqual({ ok: true });
  const version = await svc.publishForm("u1", form.id);
  return { form, version };
}

describe("makeSlug", () => {
  it("is a kebab-case title plus 6 random characters", () => {
    expect(makeSlug("Contact Us!")).toMatch(/^contact-us-[a-z0-9]{6}$/);
  });

  it("caps the title part at 40 characters and handles symbol-only titles", () => {
    expect(makeSlug("x".repeat(60)).length).toBe(40 + 7);
    expect(makeSlug("!!!")).toMatch(/^form-[a-z0-9]{6}$/);
  });
});

describe("forms service", () => {
  it("creates a form with an empty draft and a slug", async () => {
    const form = await svc.createForm("u1", "Contact");
    expect(form.draftSchema).toEqual({ schemaVersion: 1, title: "Contact", fields: [] });
    expect(form.slug).toMatch(/^contact-[a-z0-9]{6}$/);
  });

  it("retries slug generation when a slug is already taken", async () => {
    const slugs = ["taken", "taken", "free"];
    const retrying = createFormsService(db, { makeSlug: () => slugs.shift()! });
    await retrying.createForm("u1", "A");
    expect((await retrying.createForm("u1", "B")).slug).toBe("free");
  });

  it("rejects an invalid draft without saving it", async () => {
    const form = await svc.createForm("u1", "Contact");
    const result = await svc.updateDraft("u1", form.id, { ...contact, fields: [{ id: "x", type: "nope" }] });
    expect(result.ok).toBe(false);
    expect((await svc.getForm("u1", form.id)).draftSchema).toEqual(form.draftSchema);
  });

  it("keeps the form title in sync with the draft title", async () => {
    const form = await svc.createForm("u1", "Old");
    await svc.updateDraft("u1", form.id, { ...contact, title: "New title" });
    expect((await svc.getForm("u1", form.id)).title).toBe("New title");
  });

  it("publish creates v1 then v2, and the public page serves the latest", async () => {
    const { form, version } = await publishedForm();
    expect(version.version).toBe(1);

    await svc.updateDraft("u1", form.id, withEmail);
    expect((await svc.publishForm("u1", form.id)).version).toBe(2);

    const published = await svc.getPublishedForm(form.slug);
    expect(published?.version.version).toBe(2);
    expect(published?.version.schema).toEqual(withEmail);
    expect((await svc.listVersions("u1", form.id)).map((v) => v.version)).toEqual([2, 1]);
  });

  it("publish rejects a form with no fields", async () => {
    const form = await svc.createForm("u1", "Empty");
    await expect(svc.publishForm("u1", form.id)).rejects.toBeInstanceOf(ValidationError);
  });

  it("getPublishedForm returns null for unknown or unpublished slugs", async () => {
    const form = await svc.createForm("u1", "Draft only");
    expect(await svc.getPublishedForm(form.slug)).toBeNull();
    expect(await svc.getPublishedForm("does-not-exist")).toBeNull();
  });

  it("stores a submission against the published version", async () => {
    const { form, version } = await publishedForm();
    const result = await svc.submitResponse(form.slug, { name: " Al ", junk: "x" });
    expect(result).toEqual({ ok: true, responseId: expect.any(String) });

    const [stored] = await db.select().from(responses);
    expect(stored).toMatchObject({ formId: form.id, versionId: version.id, answers: { name: "Al" } });
  });

  it("returns field errors and stores nothing for an invalid submission", async () => {
    const { form } = await publishedForm();
    expect(await svc.submitResponse(form.slug, {})).toEqual({
      ok: false,
      errors: { name: "This field is required" },
    });
    expect(await db.select().from(responses)).toEqual([]);
  });

  it("throws NotFoundError when submitting to an unpublished form", async () => {
    const form = await svc.createForm("u1", "Draft only");
    await expect(svc.submitResponse(form.slug, { name: "Al" })).rejects.toBeInstanceOf(NotFoundError);
  });

  it("keeps older-version responses after a new publish and filters by version", async () => {
    const { form, version: v1 } = await publishedForm();
    await svc.submitResponse(form.slug, { name: "Old" });
    await svc.updateDraft("u1", form.id, withEmail);
    const v2 = await svc.publishForm("u1", form.id);
    await svc.submitResponse(form.slug, { name: "New", email: "n@example.com" });

    const all = await svc.listResponses("u1", form.id, { page: 1 });
    expect(all.total).toBe(2);
    expect(all.items.map((r) => r.version)).toEqual([2, 1]);

    const onlyV1 = await svc.listResponses("u1", form.id, { page: 1, versionId: v1.id });
    expect(onlyV1).toMatchObject({ total: 1, items: [{ answers: { name: "Old" }, version: 1 }] });
    expect((await svc.listResponses("u1", form.id, { page: 1, versionId: v2.id })).total).toBe(1);
  });

  it("pages responses 25 at a time, newest first", async () => {
    const { form, version } = await publishedForm();
    const base = Date.UTC(2026, 0, 1);
    await db.insert(responses).values(
      Array.from({ length: 30 }, (_, i) => ({
        formId: form.id,
        versionId: version.id,
        answers: { name: `R${i}` },
        submittedAt: new Date(base + i * 1000),
      })),
    );

    const page1 = await svc.listResponses("u1", form.id, { page: 1 });
    const page2 = await svc.listResponses("u1", form.id, { page: 2 });
    expect(page1.total).toBe(30);
    expect(page1.items).toHaveLength(25);
    expect(page1.items[0]!.answers).toEqual({ name: "R29" });
    expect(page2.items).toHaveLength(5);
    expect(page2.items.at(-1)!.answers).toEqual({ name: "R0" });
  });

  it("lists a user's forms with latest version and response count", async () => {
    const { form } = await publishedForm();
    await svc.submitResponse(form.slug, { name: "Al" });
    await svc.createForm("u1", "Second");
    await svc.createForm("u2", "Someone else's");

    const list = await svc.listForms("u1");
    expect(list).toHaveLength(2);
    expect(list.find((f) => f.id === form.id)).toMatchObject({ latestVersion: 1, responseCount: 1 });
    expect(list.find((f) => f.title === "Second")).toMatchObject({ latestVersion: null, responseCount: 0 });
  });

  it("gives another user ForbiddenError on every owner-scoped call", async () => {
    const { form } = await publishedForm();
    await expect(svc.getForm("u2", form.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(svc.updateDraft("u2", form.id, contact)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(svc.publishForm("u2", form.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(svc.listResponses("u2", form.id, { page: 1 })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(svc.deleteForm("u2", form.id)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("throws NotFoundError for missing or malformed form ids", async () => {
    await expect(svc.getForm("u1", "00000000-0000-0000-0000-000000000000")).rejects.toBeInstanceOf(NotFoundError);
    await expect(svc.getForm("u1", "not-a-uuid")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("deletes a form with its versions and responses", async () => {
    const { form } = await publishedForm();
    await svc.submitResponse(form.slug, { name: "Al" });
    await svc.deleteForm("u1", form.id);
    await expect(svc.getForm("u1", form.id)).rejects.toBeInstanceOf(NotFoundError);
    expect(await db.select().from(responses)).toEqual([]);
  });
});
