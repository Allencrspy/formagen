import type { RateLimiter } from "@/lib/rate-limit";
import { parseFormSchema } from "@/lib/schema/parse";
import { formDataToAnswers } from "@/lib/schema/submission";
import type { FormsService } from "./service";

export type SubmissionOutcome =
  | { status: "ok" }
  | { status: "invalid"; errors: Record<string, string>; values: Record<string, unknown> }
  | { status: "not-found" }
  | { status: "rate-limited" };

/**
 * The public form's submit logic, free of Next.js so it can be tested directly.
 * The Server Action supplies the client key (IP) and turns the outcome into a redirect or page state.
 */
export async function handleSubmission({
  service,
  slug,
  formData,
  clientKey,
  limiter,
}: {
  service: FormsService;
  slug: string;
  formData: FormData;
  clientKey: string;
  limiter: RateLimiter;
}): Promise<SubmissionOutcome> {
  if (!limiter.check(clientKey)) return { status: "rate-limited" };

  const published = await service.getPublishedForm(slug);
  if (!published) return { status: "not-found" };

  const parsed = parseFormSchema(published.version.schema);
  if (!parsed.ok) throw new Error(`Stored schema for version ${published.version.id} is invalid`);

  const raw = formDataToAnswers(parsed.schema, formData);
  const result = await service.submitResponse(slug, raw);
  return result.ok ? { status: "ok" } : { status: "invalid", errors: result.errors, values: raw };
}
