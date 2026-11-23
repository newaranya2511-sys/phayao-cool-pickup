import { describe, expect, it } from "vitest";
import { boxCount, clampQty, orderTotal, profitPerUnit, unitPrice } from "./pricing";

describe("wholesale pricing", () => {
  it("charges ฿11,500 per unit below 3 units", () => {
    expect(unitPrice(1)).toBe(11500);
    expect(orderTotal(2)).toBe(23000);
  });

  it("drops to ฿11,300 per unit from 3 units", () => {
    expect(unitPrice(3)).toBe(11300);
    expect(orderTotal(3)).toBe(33900);
  });

  it("shows ฿5,400 technician profit against the ฿16,900 shelf price", () => {
    expect(profitPerUnit(1)).toBe(5400);
  });

  it("never lets the quantity exceed warehouse stock", () => {
    expect(clampQty(30, 28)).toBe(28);
    expect(clampQty(0, 28)).toBe(1);
    expect(clampQty(1, 0)).toBe(0);
  });

  it("counts 2 boxes per set (indoor + outdoor)", () => {
    expect(boxCount(2)).toBe(4);
  });
});
