import { GraphQLError } from "graphql";
import { ForbiddenError, NotFoundError, ValidationError } from "@/lib/forms/errors";
import type { FormRow, FormSummary, ResponseRow, VersionRow } from "@/lib/forms/service";
import type { SchemaIssue } from "@/lib/schema/types";
import { builder } from "./builder";
import type { GraphQLContext } from "./context";

// ── Errors: service errors become standard GraphQL error codes ──────────────────

function signedIn(ctx: GraphQLContext): string {
  if (!ctx.userId) throw new GraphQLError("Sign in to continue", { extensions: { code: "UNAUTHENTICATED" } });
  return ctx.userId;
}

async function guard<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    if (error instanceof NotFoundError) throw new GraphQLError(error.message, { extensions: { code: "NOT_FOUND" } });
    if (error instanceof ForbiddenError) throw new GraphQLError(error.message, { extensions: { code: "FORBIDDEN" } });
    if (error instanceof ValidationError) {
      throw new GraphQLError(error.message, { extensions: { code: "BAD_USER_INPUT", issues: error.issues } });
    }
    throw error;
  }
}

// ── Types ───────────────────────────────────────────────────────────────────────

type FormParent = FormRow | FormSummary;

const User = builder.objectRef<{ id: string; email: string | null; name: string | null }>("User").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email", { nullable: true }),
    name: t.exposeString("name", { nullable: true }),
  }),
});

const Issue = builder.objectRef<SchemaIssue>("SchemaIssue").implement({
  description: "A problem in a form schema; fieldId is null for form-level problems.",
  fields: (t) => ({
    fieldId: t.exposeString("fieldId", { nullable: true }),
    message: t.exposeString("message"),
  }),
});

const UpdateDraftResult = builder.objectRef<{ ok: boolean; issues: SchemaIssue[] }>("UpdateDraftResult").implement({
  fields: (t) => ({
    ok: t.exposeBoolean("ok"),
    issues: t.field({ type: [Issue], resolve: (r) => r.issues }),
  }),
});

const FormVersion = builder.objectRef<VersionRow>("FormVersion").implement({
  description: "An immutable published snapshot of a form.",
  fields: (t) => ({
    id: t.exposeID("id"),
    version: t.exposeInt("version"),
    schema: t.field({ type: "JSON", resolve: (v) => v.schema }),
    publishedAt: t.field({ type: "DateTime", resolve: (v) => v.publishedAt }),
  }),
});

const Response = builder.objectRef<ResponseRow>("Response").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    versionId: t.exposeID("versionId"),
    version: t.exposeInt("version"),
    answers: t.field({ type: "JSON", resolve: (r) => r.answers }),
    submittedAt: t.field({ type: "DateTime", resolve: (r) => r.submittedAt }),
  }),
});

const ResponsePage = builder.objectRef<{ items: ResponseRow[]; total: number }>("ResponsePage").implement({
  fields: (t) => ({
    items: t.field({ type: [Response], resolve: (p) => p.items }),
    total: t.exposeInt("total"),
  }),
});

const Form = builder.objectRef<FormParent>("Form").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    slug: t.exposeString("slug"),
    updatedAt: t.field({ type: "DateTime", resolve: (f) => f.updatedAt }),
    draftSchema: t.field({
      type: "JSON",
      resolve: (f, _args, ctx) =>
        "draftSchema" in f ? f.draftSchema : guard(async () => (await ctx.forms.getForm(signedIn(ctx), f.id)).draftSchema),
    }),
    latestVersion: t.int({
      nullable: true,
      resolve: (f, _args, ctx) =>
        "latestVersion" in f
          ? f.latestVersion
          : guard(async () => (await ctx.forms.listVersions(signedIn(ctx), f.id))[0]?.version ?? null),
    }),
    responseCount: t.int({
      resolve: (f, _args, ctx) =>
        "responseCount" in f
          ? f.responseCount
          : guard(async () => (await ctx.forms.listResponses(signedIn(ctx), f.id, { page: 1 })).total),
    }),
    versions: t.field({
      type: [FormVersion],
      resolve: (f, _args, ctx) => guard(() => ctx.forms.listVersions(signedIn(ctx), f.id)),
    }),
    responses: t.field({
      type: ResponsePage,
      args: {
        versionId: t.arg.id({ required: false }),
        page: t.arg.int({ required: false, defaultValue: 1 }),
      },
      resolve: (f, args, ctx) =>
        guard(() =>
          ctx.forms.listResponses(signedIn(ctx), f.id, {
            versionId: args.versionId ? String(args.versionId) : undefined,
            page: args.page ?? 1,
          }),
        ),
    }),
  }),
});

// ── Queries ─────────────────────────────────────────────────────────────────────

builder.queryFields((t) => ({
  me: t.field({
    type: User,
    resolve: (_root, _args, ctx) =>
      guard(async () => {
        const user = await ctx.forms.getUser(signedIn(ctx));
        if (!user) throw new GraphQLError("Sign in to continue", { extensions: { code: "UNAUTHENTICATED" } });
        return user;
      }),
  }),
  forms: t.field({
    type: [Form],
    resolve: (_root, _args, ctx) => guard(() => ctx.forms.listForms(signedIn(ctx))),
  }),
  form: t.field({
    type: Form,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_root, args, ctx) => guard(() => ctx.forms.getForm(signedIn(ctx), String(args.id))),
  }),
}));

// ── Mutations ───────────────────────────────────────────────────────────────────

builder.mutationFields((t) => ({
  createForm: t.field({
    type: Form,
    args: { title: t.arg.string({ required: true }) },
    resolve: (_root, args, ctx) =>
      guard(() => {
        const title = args.title.trim();
        if (!title) throw new GraphQLError("Give the form a title", { extensions: { code: "BAD_USER_INPUT" } });
        return ctx.forms.createForm(signedIn(ctx), title);
      }),
  }),
  updateDraft: t.field({
    type: UpdateDraftResult,
    description: "Saves the draft if it is a valid schema; otherwise returns the problems and saves nothing.",
    args: { id: t.arg.id({ required: true }), schema: t.arg({ type: "JSON", required: true }) },
    resolve: (_root, args, ctx) =>
      guard(async () => {
        const result = await ctx.forms.updateDraft(signedIn(ctx), String(args.id), args.schema);
        return result.ok ? { ok: true, issues: [] } : result;
      }),
  }),
  publishForm: t.field({
    type: FormVersion,
    description: "Freezes the current draft as the next version and refreshes the public page.",
    args: { id: t.arg.id({ required: true }) },
    resolve: (_root, args, ctx) =>
      guard(async () => {
        const userId = signedIn(ctx);
        const form = await ctx.forms.getForm(userId, String(args.id));
        const version = await ctx.forms.publishForm(userId, form.id);
        ctx.onPublished(form.slug);
        return version;
      }),
  }),
  deleteForm: t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: (_root, args, ctx) =>
      guard(async () => {
        await ctx.forms.deleteForm(signedIn(ctx), String(args.id));
        return true;
      }),
  }),
}));

export const schema = builder.toSchema();
