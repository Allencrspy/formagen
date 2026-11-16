import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { loadPublishedForm } from "../data";
import { decodeFlash, flashCookieName } from "../flash";
import { FormView } from "../FormView";

// Per visitor: shows the errors and typed values from a failed submit (see flash.ts).
export const instant = false;

export const metadata: Metadata = { robots: { index: false } };

export default async function RetryPage({ params }: PageProps<"/f/[slug]/retry">) {
  const { slug } = await params;
  const form = await loadPublishedForm(slug);
  if (!form) notFound();
  const flash = decodeFlash((await cookies()).get(flashCookieName(slug))?.value);
  // Reloaded after the 30-second flash expired: nothing to show, so back to the form.
  if (!flash) redirect(`/f/${slug}`);
  return <FormView slug={slug} form={form} flash={flash} />;
}
