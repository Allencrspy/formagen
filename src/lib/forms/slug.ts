const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Public URL slug: kebab-case title (max 40 chars) plus 6 random characters, e.g.
 * "contact-us-k3f9q2". The random part makes slugs unguessable and rarely colliding;
 * the database's unique constraint catches the rare collision.
 */
export function makeSlug(title: string): string {
  const base =
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
      .replace(/-+$/, "") || "form";

  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${base}-${suffix}`;
}
