/** EMVCo PromptPay payload builder (Thai QR Payment standard). */

function field(id: string, value: string): string {
  return id + value.length.toString().padStart(2, "0") + value;
}

/** CRC-16/CCITT-FALSE, as required by the Thai QR spec. */
export function crc16(input: string): string {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function formatTarget(id: string): { tag: string; value: string } {
  const digits = id.replace(/\D/g, "");
  if (digits.length >= 13) return { tag: "02", value: digits }; // tax / national ID
  // mobile number: 0812345678 -> 0066812345678
  const local = digits.replace(/^0/, "");
  return { tag: "01", value: ("0000000000000" + "66" + local).slice(-13) };
}

export function promptPayPayload(promptPayId: string, amount?: number): string {
  const target = formatTarget(promptPayId);
  const merchant = field("00", "A000000677010111") + field(target.tag, target.value);
  let payload =
    field("00", "01") +
    field("01", amount ? "12" : "11") +
    field("29", merchant) +
    field("58", "TH") +
    field("53", "764");
  if (amount) payload += field("54", amount.toFixed(2));
  payload += "6304";
  return payload + crc16(payload);
}
