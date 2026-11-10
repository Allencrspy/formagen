// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

const request = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost:3000${path}`, { headers: cookie ? { cookie } : {} });

describe("proxy (optimistic sign-in check)", () => {
  it("redirects /app to sign-in when there is no session cookie", () => {
    const response = proxy(request("/app/forms/1"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/api/auth/signin?callbackUrl=%2Fapp%2Fforms%2F1",
    );
  });

  it("lets the request through with a session cookie", () => {
    expect(proxy(request("/app", "authjs.session-token=abc")).headers.get("x-middleware-next")).toBe("1");
  });

  it("accepts the secure cookie name used over HTTPS", () => {
    expect(proxy(request("/app", "__Secure-authjs.session-token=abc")).headers.get("x-middleware-next")).toBe("1");
  });
});
