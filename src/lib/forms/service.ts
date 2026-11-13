import { and, count, desc, eq, sql } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { formVersions, forms, responses, users } from "@/lib/db/schema";
import { parseFormSchema } from "@/lib/schema/parse";
import { validateSubmission, type Answers } from "@/lib/schema/submission";
import type { FormSchema, SchemaIssue } from "@/lib/schema/types";
import { ForbiddenError, NotFoundError, ValidationError } from "./errors";
import { makeSlug as defaultMakeSlug, slugBase } from "./slug";

export type FormRow = typeof forms.$inferSelect;
export type VersionRow = typeof formVersions.$inferSelect;
export type FormSummary = Pick<FormRow, "id" | "title" | "slug" | "updatedAt"> & {
  latestVersion: number | null;
  responseCount: number;
};
export type ResponseRow = {
  id: string;
  versionId: string;
  version: number;
  answers: Answers;
  submittedAt: Date;
};

export const PAGE_SIZE = 25;
const SLUG_ATTEMPTS = 3;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * All form business rules in one place. Admin GraphQL resolvers and the public page's
 * Server Action both call these functions, so ownership and validation can't drift apart.
 * `db` is injected: Neon in production, in-memory PGlite in tests.
 */
export function createFormsService(db: Db, options: { makeSlug?: (title: string) => string } = {}) {
  const makeSlug = options.makeSlug ?? defaultMakeSlug;

  /** Loads a form the caller owns; NotFound if missing, Forbidden if someone else's. */
  async function getOwned(ownerId: string, formId: string): Promise<FormRow> {
    if (!UUID.test(formId)) throw new NotFoundError();
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    if (!form) throw new NotFoundError();
    if (form.ownerId !== ownerId) throw new ForbiddenError();
    return form;
  }

  /** Public: the latest published version for a slug, or null. No ownership check. */
  async function getPublishedForm(slug: string): Promise<{ form: FormRow; version: VersionRow } | null> {
    const [row] = await db
      .select({ form: forms, version: formVersions })
      .from(forms)
      .innerJoin(formVersions, eq(formVersions.formId, forms.id))
      .where(eq(forms.slug, slug))
      .orderBy(desc(formVersions.version))
      .limit(1);
    return row ?? null;
  }

  return {
    /** The signed-in user's public profile (for the admin UI header). */
    async getUser(userId: string): Promise<{ id: string; email: string | null; name: string | null } | null> {
      const [row] = await db
        .select({ id: users.id, email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, userId));
      return row ?? null;
    },

    async createForm(ownerId: string, title: string): Promise<FormRow> {
      const draftSchema: FormSchema = { schemaVersion: 1, title, fields: [] };
      for (let attempt = 1; ; attempt++) {
        try {
          const [form] = await db
            .insert(forms)
            .values({ ownerId, title, slug: makeSlug(title), draftSchema })
            .returning();
          return form!;
        } catch (error) {
          if (!isUniqueViolation(error) || attempt >= SLUG_ATTEMPTS) throw error;
        }
      }
    },

    async listForms(ownerId: string): Promise<FormSummary[]> {
      return db
        .select({
          id: forms.id,
          title: forms.title,
          slug: forms.slug,
          updatedAt: forms.updatedAt,
          // Correlated subqueries use explicit aliases: inside a subquery Drizzle renders
          // bare column names, so "id" would bind to the inner table, not forms.id.
          latestVersion: sql<number | null>`(select max(fv.version) from form_versions fv where fv.form_id = "forms"."id")`,
          responseCount: sql<number>`(select count(*)::int from responses r where r.form_id = "forms"."id")`,
        })
        .from(forms)
        .where(eq(forms.ownerId, ownerId))
        .orderBy(desc(forms.updatedAt));
    },

    getForm: getOwned,

    async updateDraft(
      ownerId: string,
      formId: string,
      schema: unknown,
    ): Promise<{ ok: true } | { ok: false; issues: SchemaIssue[] }> {
      await getOwned(ownerId, formId);
      const parsed = parseFormSchema(schema);
      if (!parsed.ok) return parsed;

      await db
        .update(forms)
        .set({ draftSchema: parsed.schema, title: parsed.schema.title, updatedAt: new Date() })
        .where(eq(forms.id, formId));
      return { ok: true };
    },

    /**
     * Freezes the current draft as the next version number, atomically.
     * The first publish also refreshes the public link if the title changed since the form was
     * created (forms start as "Untitled form"); after that the link never changes, so shared
     * links keep working.
     */
    async publishForm(ownerId: string, formId: string): Promise<VersionRow & { slug: string }> {
      const form = await getOwned(ownerId, formId);
      const parsed = parseFormSchema(form.draftSchema);
      if (!parsed.ok) throw new ValidationError("Fix the problems in this form before publishing", parsed.issues);
      if (parsed.schema.fields.length === 0) throw new ValidationError("Add at least one field before publishing");

      return db.transaction(async (tx) => {
        const [latest] = await tx
          .select({ max: sql<number | null>`max(${formVersions.version})` })
          .from(formVersions)
          .where(eq(formVersions.formId, formId));
        const isFirst = (latest?.max ?? null) === null;

        // Only when the title no longer matches the link (e.g. "untitled-form-…" -> "team-offsite-rsvp-…").
        let slug = form.slug;
        const titleChanged = form.slug.replace(/-[a-z0-9]{6}$/, "") !== slugBase(parsed.schema.title);
        if (isFirst && titleChanged) {
          for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
            const candidate = makeSlug(parsed.schema.title);
            const [taken] = await tx.select({ id: forms.id }).from(forms).where(eq(forms.slug, candidate));
            if (!taken) {
              slug = candidate;
              break;
            }
          }
        }

        const [version] = await tx
          .insert(formVersions)
          .values({ formId, version: (latest?.max ?? 0) + 1, schema: parsed.schema })
          .returning();
        await tx.update(forms).set({ slug, updatedAt: new Date() }).where(eq(forms.id, formId));
        return { ...version!, slug };
      });
    },

    async listVersions(ownerId: string, formId: string): Promise<VersionRow[]> {
      await getOwned(ownerId, formId);
      return db
        .select()
        .from(formVersions)
        .where(eq(formVersions.formId, formId))
        .orderBy(desc(formVersions.version));
    },

    getPublishedForm,

    /** Public: validates against the latest published version and stores the cleaned answers. */
    async submitResponse(
      slug: string,
      raw: Record<string, unknown>,
    ): Promise<{ ok: true; responseId: string } | { ok: false; errors: Record<string, string> }> {
      const published = await getPublishedForm(slug);
      if (!published) throw new NotFoundError();

      const parsed = parseFormSchema(published.version.schema);
      if (!parsed.ok) throw new Error(`Stored schema for version ${published.version.id} is invalid`);

      const result = validateSubmission(parsed.schema, raw);
      if (!result.ok) return result;

      const [row] = await db
        .insert(responses)
        .values({ formId: published.form.id, versionId: published.version.id, answers: result.answers })
        .returning({ id: responses.id });
      return { ok: true, responseId: row!.id };
    },

    async listResponses(
      ownerId: string,
      formId: string,
      opts: { versionId?: string; page: number },
    ): Promise<{ items: ResponseRow[]; total: number }> {
      await getOwned(ownerId, formId);
      if (opts.versionId !== undefined && !UUID.test(opts.versionId)) return { items: [], total: 0 };

      const where = and(
        eq(responses.formId, formId),
        opts.versionId ? eq(responses.versionId, opts.versionId) : undefined,
      );
      const page = Math.max(1, Math.floor(opts.page));

      const [{ total } = { total: 0 }] = await db.select({ total: count() }).from(responses).where(where);
      const items = await db
        .select({
          id: responses.id,
          versionId: responses.versionId,
          version: formVersions.version,
          answers: responses.answers,
          submittedAt: responses.submittedAt,
        })
        .from(responses)
        .innerJoin(formVersions, eq(formVersions.id, responses.versionId))
        .where(where)
        .orderBy(desc(responses.submittedAt), desc(responses.id))
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE);

      return { items: items.map((r) => ({ ...r, answers: r.answers as Answers })), total };
    },

    async deleteForm(ownerId: string, formId: string): Promise<void> {
      await getOwned(ownerId, formId);
      await db.delete(forms).where(eq(forms.id, formId));
    },
  };
}

export type FormsService = ReturnType<typeof createFormsService>;

/** Postgres unique_violation (23505), possibly wrapped by Drizzle in `cause`. */
function isUniqueViolation(error: unknown): boolean {
  for (let e: unknown = error; e; e = (e as { cause?: unknown }).cause) {
    if ((e as { code?: unknown }).code === "23505") return true;
  }
  return false;
}
