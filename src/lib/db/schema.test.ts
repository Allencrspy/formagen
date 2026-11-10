// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb } from "./test-db";
import { formVersions, forms, responses, users } from "./schema";
import type { Db } from "./client";

const schemaJson = { schemaVersion: 1, title: "Contact", fields: [] };

describe("database schema", () => {
  let db: Db;
  let formId: string;

  beforeEach(async () => {
    db = await createTestDb();
    await db.insert(users).values({ id: "u1", email: "allen@example.com" });
    const [form] = await db
      .insert(forms)
      .values({ ownerId: "u1", title: "Contact", slug: "contact-abc123", draftSchema: schemaJson })
      .returning();
    formId = form!.id;
  });

  it("stores a form with generated id and timestamps", async () => {
    const [row] = await db.select().from(forms).where(eq(forms.id, formId));
    expect(row).toMatchObject({ ownerId: "u1", slug: "contact-abc123", draftSchema: schemaJson });
    expect(row!.createdAt).toBeInstanceOf(Date);
  });

  it("rejects a duplicate slug", async () => {
    await expect(
      db.insert(forms).values({ ownerId: "u1", title: "Other", slug: "contact-abc123", draftSchema: schemaJson }),
    ).rejects.toThrow();
  });

  it("rejects a second version with the same number for one form", async () => {
    await db.insert(formVersions).values({ formId, version: 1, schema: schemaJson });
    await expect(db.insert(formVersions).values({ formId, version: 1, schema: schemaJson })).rejects.toThrow();
  });

  it("deletes versions and responses when the form is deleted", async () => {
    const [version] = await db.insert(formVersions).values({ formId, version: 1, schema: schemaJson }).returning();
    await db.insert(responses).values({ formId, versionId: version!.id, answers: { name: "Al" } });

    await db.delete(forms).where(eq(forms.id, formId));

    expect(await db.select().from(formVersions)).toEqual([]);
    expect(await db.select().from(responses)).toEqual([]);
  });

  it("gives each test its own empty database", async () => {
    expect(await db.select().from(forms)).toHaveLength(1);
  });
});
