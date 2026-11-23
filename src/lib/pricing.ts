/** Wholesale pricing rules for Saijo Denki Turbo A.P.S Inverter 12,000 BTU. */
export const WHOLESALE_PRICE = 11500;
export const BULK_PRICE = 11300;
export const BULK_MIN_QTY = 3;
export const RETAIL_PRICE = 16900;
/** Opening stock at the Phayao main warehouse. */
export const INITIAL_STOCK = 28;

export function unitPrice(qty: number): number {
  return qty >= BULK_MIN_QTY ? BULK_PRICE : WHOLESALE_PRICE;
}

export function orderTotal(qty: number): number {
  return unitPrice(qty) * qty;
}

export function profitPerUnit(qty: number): number {
  return RETAIL_PRICE - unitPrice(qty);
}

/** Keep the stepper between 1 and what is in stock (0 when sold out). */
export function clampQty(qty: number, stock: number): number {
  if (stock <= 0) return 0;
  return Math.max(1, Math.min(Math.floor(qty), stock));
}

/** Each set ships as 2 boxes: indoor (cold coil) + outdoor (hot coil). */
export function boxCount(qty: number): number {
  return qty * 2;
}

export function baht(n: number): string {
  return `฿${n.toLocaleString("en-US")}`;
}
