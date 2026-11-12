/**
 * Post/Redirect/Get for the public form. A failed submit stores its errors and the typed
 * values in a short-lived cookie scoped to the form's path, then redirects back to the form.
 * Works identically with and without JavaScript (Next 16 serves cached HTML for no-JS
 * action posts, so returning state from the action can't reach a browser without JS).
 * Values never go in the URL.
 */
export type Flash = {
  errors?: Record<string, string>;
  values?: Record<string, unknown>;
  formError?: string;
  /** Changes on every failed submit so the form remounts with the echoed values. */
  attempt: number;
};

export const flashCookieName = (slug: string) => `fg_flash_${slug.replace(/[^a-z0-9-]/gi, "")}`;
export const FLASH_MAX_AGE_SECONDS = 30;
const MAX_BYTES = 3500;

export function encodeFlash(flash: Flash): string {
  let json = JSON.stringify(flash);
  if (json.length > MAX_BYTES) json = JSON.stringify({ ...flash, values: undefined });
  return Buffer.from(json, "utf8").toString("base64url");
}

export function decodeFlash(raw: string | undefined): Flash | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object") return null;
    const f = parsed as Partial<Flash>;
    return {
      errors: isStringRecord(f.errors) ? f.errors : undefined,
      values: f.values && typeof f.values === "object" ? (f.values as Record<string, unknown>) : undefined,
      formError: typeof f.formError === "string" ? f.formError : undefined,
      attempt: typeof f.attempt === "number" ? f.attempt : 1,
    };
  } catch {
    return null;
  }
}

function isStringRecord(v: unknown): v is Record<string, string> {
  return !!v && typeof v === "object" && Object.values(v).every((x) => typeof x === "string");
}
