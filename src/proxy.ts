import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

/**
 * Optimistic check only: sends visitors with no session cookie straight to sign-in,
 * so signed-out requests never start rendering /app. It doesn't verify the cookie;
 * requireUser() in the /app layout is the real check.
 */
export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
  if (hasSession) return NextResponse.next();

  const signIn = new URL("/api/auth/signin", request.url);
  signIn.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signIn);
}

export const config = { matcher: ["/app", "/app/:path*"] };
