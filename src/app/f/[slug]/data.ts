import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getFormsService } from "@/lib/forms";
import { parseFormSchema } from "@/lib/schema/parse";
import type { FormSchema } from "@/lib/schema/types";

export type PublishedForm = { title: string; version: number; schema: FormSchema };

/** Tag to revalidate when a form is published (used by the publish mutation). */
export const formTag = (slug: string) => `form:${slug}`;

/**
 * The latest published version of a form, cached per slug.
 * Publishing a new version calls revalidateTag(formTag(slug)), so visitors see it straight away.
 */
export async function loadPublishedForm(slug: string): Promise<PublishedForm | null> {
  "use cache";
  cacheTag(formTag(slug));
  cacheLife("hours");

  const published = await getFormsService().getPublishedForm(slug);
  if (!published) return null;

  const parsed = parseFormSchema(published.version.schema);
  if (!parsed.ok) throw new Error(`Stored schema for version ${published.version.id} is invalid`);
  return { title: parsed.schema.title, version: published.version.version, schema: parsed.schema };
}
