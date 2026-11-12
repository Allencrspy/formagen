"use server";

import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getFormsService } from "@/lib/forms";
import { handleSubmission } from "@/lib/forms/submit";
import { createRateLimiter } from "@/lib/rate-limit";
import { decodeFlash, encodeFlash, FLASH_MAX_AGE_SECONDS, flashCookieName, type Flash } from "./flash";

// 10 submissions per minute per form per client (per Lambda instance; see rate-limit.ts).
const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 });

/**
 * Public form submission, Post/Redirect/Get: success redirects to the thanks page;
 * failure stores errors and typed values in a short-lived flash cookie and redirects
 * back to the form. Identical with and without JavaScript.
 */
export async function submitForm(slug: string, formData: FormData): Promise<void> {
  const h = await headers();
  const jar = await cookies();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const name = flashCookieName(slug);
  const attempt = (decodeFlash(jar.get(name)?.value)?.attempt ?? 0) + 1;

  const outcome = await handleSubmission({
    service: getFormsService(),
    slug,
    formData,
    clientKey: `${slug}:${ip}`,
    limiter,
  });

  if (outcome.status === "not-found") notFound();
  if (outcome.status === "ok") {
    jar.delete({ name, path: `/f/${slug}` });
    redirect(`/f/${slug}/thanks`);
  }

  const flash: Flash =
    outcome.status === "invalid"
      ? { errors: outcome.errors, values: outcome.values, attempt }
      : { formError: "Too many submissions. Try again in a minute.", attempt };

  jar.set(name, encodeFlash(flash), {
    path: `/f/${slug}`,
    maxAge: FLASH_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  redirect(`/f/${slug}`);
}
