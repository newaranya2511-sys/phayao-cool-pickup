/** Business settings for the Phayao warehouse. Replace the demo values before going live. */
export const PROMPTPAY_ID = "0812345678";
/** True while PROMPTPAY_ID is a placeholder: the payment sheet warns not to transfer real money. */
export const PROMPTPAY_IS_DEMO = true;
export const MERCHANT_NAME = "แอร์ช่างพะเยา";

export const WAREHOUSE = {
  name: "คลังหลักพะเยา",
  address: "ถ.พหลโยธิน ใกล้แยกแม่ต๋ำ อ.เมือง",
  phone: "0812345678",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("แยกแม่ต๋ำ ถนนพหลโยธิน อำเภอเมืองพะเยา พะเยา"),
};

export const PRODUCT = {
  brand: "Saijo Denki",
  fullName: "Saijo Denki Turbo A.P.S Inverter 12,000 BTU",
};

/** A QR / slip payment window. */
export const PAYMENT_WINDOW_MS = 15 * 60 * 1000;
