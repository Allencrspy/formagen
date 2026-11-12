// @vitest-environment node
import { describe, expect, it } from "vitest";
import { decodeFlash, encodeFlash, flashCookieName } from "./flash";

describe("flash cookie", () => {
  it("round-trips errors, values and the attempt counter", () => {
    const flash = { errors: { name: "This field is required" }, values: { email: "a@b.co", news: true }, attempt: 2 };
    expect(decodeFlash(encodeFlash(flash))).toEqual({ ...flash, formError: undefined });
  });

  it("drops the typed values when they would make the cookie too large", () => {
    const big = { errors: { notes: "Too long" }, values: { notes: "x".repeat(5000) }, attempt: 1 };
    expect(decodeFlash(encodeFlash(big))?.values).toBeUndefined();
    expect(decodeFlash(encodeFlash(big))?.errors).toEqual({ notes: "Too long" });
  });

  it("ignores missing or tampered cookies", () => {
    expect(decodeFlash(undefined)).toBeNull();
    expect(decodeFlash("not-base64-json")).toBeNull();
    expect(decodeFlash(Buffer.from('{"errors":{"a":1}}').toString("base64url"))?.errors).toBeUndefined();
  });

  it("builds a cookie name only from safe slug characters", () => {
    expect(flashCookieName("contact-ab12cd")).toBe("fg_flash_contact-ab12cd");
    expect(flashCookieName("a;b=c")).toBe("fg_flash_abc");
  });
});
