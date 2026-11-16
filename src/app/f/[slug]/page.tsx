import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPublishedForm, STATIC_PARAMS_PLACEHOLDER } from "./data";
import { FormView } from "./FormView";

/**
 * The public form, identical for every visitor, so it is rendered once per slug, cached,
 * and served from the CDN edge. It reads no cookies or headers: a failed submit goes to
 * ./retry, which is the per-visitor page. Publishing revalidates the cache and invalidates
 * the CDN (see the GraphQL route).
 */
export function generateStaticParams() {
  // Cache Components needs one sample param to validate the route at build time. Real
  // slugs are rendered on their first visit and kept (ISR).
  return [{ slug: STATIC_PARAMS_PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/f/[slug]">): Promise<Metadata> {
  const form = await loadPublishedForm((await params).slug);
  return { title: form ? form.title : "Form not found", robots: { index: false } };
}

export default async function PublicFormPage({ params }: PageProps<"/f/[slug]">) {
  const { slug } = await params;
  const form = await loadPublishedForm(slug);
  if (!form) notFound();
  return <FormView slug={slug} form={form} flash={null} />;
}
