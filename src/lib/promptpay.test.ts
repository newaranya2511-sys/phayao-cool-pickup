import { describe, expect, it } from "vitest";
import { crc16, promptPayPayload } from "./promptpay";

describe("PromptPay payload", () => {
  it("uses CRC-16/CCITT-FALSE", () => {
    expect(crc16("123456789")).toBe("29B1");
  });

  it("encodes a mobile number with the order amount", () => {
    const p = promptPayPayload("081-234-5678", 11500);
    expect(p).toContain("0113" + "0066812345678");
    expect(p).toContain("540811500.00");
    expect(p.slice(-4)).toBe(crc16(p.slice(0, -4)));
  });
});
