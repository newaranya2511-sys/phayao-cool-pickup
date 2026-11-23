import { beforeEach, describe, expect, it } from "vitest";

describe("order store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("takes paid units out of the 28-unit warehouse stock and refuses more than is left", async () => {
    const store = await import("./store");
    store.resetTestData();
    const base = {
      code: "PY-10001",
      qty: 2,
      unitPrice: 11500,
      total: 23000,
      paymentMethod: "promptpay" as const,
      buyerName: "ช่างเอ",
      buyerPhone: "0890000000",
      createdAt: Date.now(),
    };
    store.confirmPaidOrder(base);
    const raw = JSON.parse(window.localStorage.getItem("aircharng-phayao:v1") ?? "{}");
    expect(raw.stock).toBe(26);
    expect(() => store.confirmPaidOrder({ ...base, code: "PY-10002", qty: 27 })).toThrow();
  });

  it("round-trips a shared pickup pass link", async () => {
    const store = await import("./store");
    const order = {
      code: "PY-88219",
      qty: 2,
      unitPrice: 11500,
      total: 23000,
      paymentMethod: "slip" as const,
      status: "ready" as const,
      buyerName: "ช่างสมชาย",
      buyerPhone: "0812345678",
      createdAt: 1,
      paidAt: 2,
    };
    const decoded = store.decodeSharedPass(store.encodeSharedPass(order));
    expect(decoded?.code).toBe("PY-88219");
    expect(decoded?.buyerName).toBe("ช่างสมชาย");
  });
});
