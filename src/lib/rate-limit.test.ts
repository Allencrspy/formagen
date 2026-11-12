import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit within the window, then blocks", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 });
    expect([1, 2, 3].map(() => limiter.check("ip-a", 1_000))).toEqual([true, true, true]);
    expect(limiter.check("ip-a", 2_000)).toBe(false);
  });

  it("counts each key separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(limiter.check("ip-a", 0)).toBe(true);
    expect(limiter.check("ip-b", 0)).toBe(true);
    expect(limiter.check("ip-a", 0)).toBe(false);
  });

  it("allows again once old hits leave the window", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
    limiter.check("ip-a", 0);
    limiter.check("ip-a", 30_000);
    expect(limiter.check("ip-a", 59_999)).toBe(false);
    expect(limiter.check("ip-a", 60_001)).toBe(true);
  });

  it("does not record blocked attempts against the window", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });
    limiter.check("ip-a", 0);
    limiter.check("ip-a", 500);
    expect(limiter.check("ip-a", 1_001)).toBe(true);
  });
});
