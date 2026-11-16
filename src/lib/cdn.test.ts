import { describe, expect, it, vi } from "vitest";
import { createCdnInvalidator, formPaths, type CdnClient } from "./cdn";

function fakeClient(distributions: Record<string, string>): CdnClient & { invalidate: ReturnType<typeof vi.fn> } {
  return {
    findDistributionId: vi.fn(async (host: string) => distributions[host] ?? null),
    invalidate: vi.fn(async () => {}),
  };
}

describe("formPaths", () => {
  it("covers the form, its thanks and retry pages, and their RSC variants", () => {
    expect(formPaths("beta-sign-up-1abc23")).toEqual(["/f/beta-sign-up-1abc23*"]);
  });
});

describe("createCdnInvalidator", () => {
  it("invalidates the form's paths on the distribution serving the host", async () => {
    const client = fakeClient({ "d123.cloudfront.net": "E1" });
    const invalidate = createCdnInvalidator({ enabled: true, client: async () => client });
    await invalidate("d123.cloudfront.net", "contact-1abc23");
    expect(client.invalidate).toHaveBeenCalledWith("E1", ["/f/contact-1abc23*"]);
  });

  it("looks the distribution up once", async () => {
    const client = fakeClient({ "d123.cloudfront.net": "E1" });
    const invalidate = createCdnInvalidator({ enabled: true, client: async () => client });
    await invalidate("d123.cloudfront.net", "a");
    await invalidate("d123.cloudfront.net", "b");
    expect(client.findDistributionId).toHaveBeenCalledTimes(1);
    expect(client.invalidate).toHaveBeenCalledTimes(2);
  });

  it("does nothing when disabled (local dev, CI)", async () => {
    const client = vi.fn();
    await createCdnInvalidator({ enabled: false, client })("localhost:3000", "a");
    expect(client).not.toHaveBeenCalled();
  });

  it("logs and carries on when the host has no distribution or AWS fails", async () => {
    const log = vi.fn();
    const missing = fakeClient({});
    await createCdnInvalidator({ enabled: true, client: async () => missing, log })("unknown.example", "a");
    expect(missing.invalidate).not.toHaveBeenCalled();

    const failing = fakeClient({ h: "E1" });
    failing.invalidate.mockRejectedValue(new Error("AccessDenied"));
    await expect(createCdnInvalidator({ enabled: true, client: async () => failing, log })("h", "a")).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledTimes(2);
  });
});
