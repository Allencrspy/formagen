// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { GqlError, gql } from "./client";

const doc = Object.assign(new String("query Me { me { id } }"), { __apiType: undefined }) as never;

function mockFetch(body: unknown, status = 200) {
  const fn = vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe("gql", () => {
  it("posts the query and variables to /api/graphql and returns data", async () => {
    const fetchMock = mockFetch({ data: { me: { id: "u1" } } });
    await expect(gql(doc, { a: 1 } as never)).resolves.toEqual({ me: { id: "u1" } });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/graphql");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ query: "query Me { me { id } }", variables: { a: 1 } });
  });

  it("throws a GqlError carrying the error code and schema issues", async () => {
    mockFetch({ errors: [{ message: "Fix the problems", extensions: { code: "BAD_USER_INPUT", issues: [{ message: "x" }] } }] });
    const error = await gql(doc).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(GqlError);
    expect(error).toMatchObject({ code: "BAD_USER_INPUT", message: "Fix the problems", issues: [{ message: "x" }] });
  });

  it("throws on a non-JSON server failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("oops", { status: 502 })));
    await expect(gql(doc)).rejects.toMatchObject({ code: "NETWORK", message: "Request failed (502)" });
  });
});
