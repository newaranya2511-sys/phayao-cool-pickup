import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { MERCHANT_NAME, PAYMENT_WINDOW_MS, PROMPTPAY_ID, PROMPTPAY_IS_DEMO } from "@/lib/config";
import { baht, orderTotal, unitPrice } from "@/lib/pricing";
import { promptPayPayload } from "@/lib/promptpay";
import {
  OutOfStockError,
  confirmPaidOrder,
  newOrderCode,
  saveProfile,
  useAppState,
  type Order,
  type PaymentMethod,
} from "@/lib/store";
import { PrimaryButton, SecondaryButton } from "./parts";
import { QrCode } from "./QrCode";

type Step = "buyer" | "pay" | "verifying" | "expired" | "success" | "soldout";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qty: number;
  method: PaymentMethod;
  onPaid: (order: Order) => void;
}

function formatClock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

const inputCls =
  "h-12 w-full rounded-[16px] border border-mint/25 bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-mute focus:border-mint focus:ring-2 focus:ring-mint/20";

export function PaymentSheet({ open, onOpenChange, qty, method, onPaid }: Props) {
  const { profile, orders } = useAppState();
  const [step, setStep] = useState<Step>("pay");
  const [code, setCode] = useState("");
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slip, setSlip] = useState<{ name: string; url: string } | null>(null);
  const [available, setAvailable] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const total = orderTotal(qty);

  // fresh session each time the sheet opens
  useEffect(() => {
    if (!open) return;
    setName(profile.name);
    setPhone(profile.phone);
    setSlip(null);
    setCode(newOrderCode(orders));
    setDeadline(Date.now() + PAYMENT_WINDOW_MS);
    setNow(Date.now());
    setStep(profile.name && profile.phone ? "pay" : "buyer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || step !== "pay") return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [open, step]);

  useEffect(() => {
    if (step === "pay" && deadline && now >= deadline) setStep("expired");
  }, [now, deadline, step]);

  const payload = useMemo(() => promptPayPayload(PROMPTPAY_ID, total), [total]);
  const remaining = deadline - now;

  const finish = () => {
    try {
      const order = confirmPaidOrder({
        code,
        qty,
        unitPrice: unitPrice(qty),
        total,
        paymentMethod: method,
        buyerName: name.trim() || profile.name,
        buyerPhone: phone.trim() || profile.phone,
        createdAt: Date.now(),
      });
      setStep("success");
      window.setTimeout(() => onPaid(order), 1400);
    } catch (e) {
      if (e instanceof OutOfStockError) {
        setAvailable(e.available);
        setStep("soldout");
      } else throw e;
    }
  };

  const submitSlip = () => {
    setStep("verifying");
    window.setTimeout(finish, 2500);
  };

  const phoneOk = /^0\d{8,9}$/.test(phone.replace(/\D/g, ""));
  const nameOk = name.trim().length >= 2;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        if (step === "verifying" || step === "success") return;
        onOpenChange(o);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[24px] bg-surface px-5 pb-6 pt-3 outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[24px] md:data-[state=open]:slide-in-from-bottom-4"
        >
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line md:hidden" />
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-[17px] font-semibold text-ink">
                {step === "buyer"
                  ? "ข้อมูลผู้มารับสินค้า"
                  : method === "promptpay"
                    ? "สแกนจ่ายด้วย PromptPay"
                    : "โอนเงินแนบสลิป"}
              </DialogPrimitive.Title>
              <p className="text-[12px] text-mute">
                ออเดอร์ #{code} • {qty} เครื่อง
              </p>
            </div>
            {step !== "verifying" && step !== "success" ? (
              <DialogPrimitive.Close
                aria-label="ปิด"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-mint/25 text-ink hover:bg-mintsoft"
              >
                ✕
              </DialogPrimitive.Close>
            ) : null}
          </div>

          {step === "buyer" ? (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!nameOk || !phoneOk) return;
                saveProfile({ ...profile, name: name.trim(), phone: phone.replace(/\D/g, "") });
                setDeadline(Date.now() + PAYMENT_WINDOW_MS);
                setNow(Date.now());
                setStep("pay");
              }}
            >
              <p className="text-[13px] text-mute">ใช้แสดงบนบัตรรับของ ให้เจ้าหน้าที่คลังตรวจสอบตอนจ่ายของ (กรอกครั้งเดียว)</p>
              <label className="block">
                <span className="mb-1 block px-1 text-[12px] text-mute">ชื่อช่าง / ชื่อร้าน</span>
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น ช่างต้น แอร์เซอร์วิส" autoComplete="name" />
              </label>
              <label className="block">
                <span className="mb-1 block px-1 text-[12px] text-mute">เบอร์โทร</span>
                <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08x-xxx-xxxx" inputMode="tel" autoComplete="tel" />
              </label>
              {phone && !phoneOk ? <p className="px-1 text-[12px] text-destructive">กรุณากรอกเบอร์โทร 9–10 หลัก</p> : null}
              <PrimaryButton type="submit" disabled={!nameOk || !phoneOk}>
                ไปหน้าชำระเงิน {baht(total)}
              </PrimaryButton>
            </form>
          ) : null}

          {step === "pay" || step === "expired" ? (
            <div className="space-y-4">
              {PROMPTPAY_IS_DEMO ? (
                <div className="rounded-[16px] border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-[12px] font-medium text-destructive">
                  ⚠️ ข้อมูลทดสอบ: เลขพร้อมเพย์ {PROMPTPAY_ID} เป็นเลขตัวอย่าง ห้ามโอนเงินจริง
                </div>
              ) : null}

              <div className="rounded-[24px] border border-mint/25 bg-ground p-4 text-center">
                <p className="text-[12px] text-mute">ยอดชำระ</p>
                <p className="text-[30px] font-bold leading-tight text-deep">{baht(total)}</p>
                <div className="relative mx-auto mt-3 w-[210px] rounded-[20px] border-2 border-mint/40 bg-surface p-3 text-ink">
                  <QrCode value={payload} label={`QR PromptPay ยอด ${baht(total)}`} className={step === "expired" ? "opacity-15" : ""} />
                  {step === "expired" ? (
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="rounded-full bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink shadow-soft">QR หมดอายุแล้ว</span>
                    </div>
                  ) : null}
                </div>
                <p className="mt-3 text-[12px] text-mute">
                  PromptPay • {MERCHANT_NAME} • {PROMPTPAY_ID.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
                </p>
                {step === "pay" ? (
                  <p className="mt-1 text-[13px] font-medium text-deep">
                    QR ใช้ได้อีก <span className="tabular-nums">{formatClock(remaining)}</span> นาที
                  </p>
                ) : null}
              </div>

              {step === "expired" ? (
                <PrimaryButton
                  onClick={() => {
                    setDeadline(Date.now() + PAYMENT_WINDOW_MS);
                    setNow(Date.now());
                    setStep("pay");
                  }}
                >
                  สร้าง QR ใหม่
                </PrimaryButton>
              ) : method === "promptpay" ? (
                <>
                  <div className="flex items-center gap-3 rounded-[16px] bg-mintsoft px-4 py-3 text-[13px] text-deep">
                    <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-mint border-t-transparent" />
                    รอยอดเงินเข้า… ระบบจะออกบัตรรับของให้อัตโนมัติ
                  </div>
                  <SecondaryButton onClick={finish}>จำลองว่าธนาคารแจ้งยอดเข้าแล้ว (ทดสอบ)</SecondaryButton>
                </>
              ) : (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-label="แนบสลิปโอนเงิน"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setSlip({ name: f.name, url: URL.createObjectURL(f) });
                    }}
                  />
                  {slip ? (
                    <div className="flex items-center gap-3 rounded-[16px] border border-mint/25 p-2.5">
                      <img src={slip.url} alt="สลิปที่แนบ" className="h-16 w-12 shrink-0 rounded-[10px] object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-ink">{slip.name}</p>
                        <p className="text-[12px] text-mute">พร้อมส่งตรวจสอบ</p>
                      </div>
                      <button type="button" onClick={() => fileRef.current?.click()} className="shrink-0 px-2 text-[13px] font-semibold text-deep">
                        เปลี่ยน
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex w-full flex-col items-center gap-1 rounded-[16px] border-2 border-dashed border-mint/40 bg-ground px-4 py-5 text-[14px] font-semibold text-deep hover:bg-mintsoft"
                    >
                      <span className="text-[22px]">🧾</span>
                      แนบสลิปโอนเงิน
                      <span className="text-[12px] font-normal text-mute">โอนแล้วถ่ายภาพหรือแคปหน้าจอสลิป</span>
                    </button>
                  )}
                  <PrimaryButton disabled={!slip} onClick={submitSlip}>
                    ส่งสลิปเพื่อรับรหัสรับของ
                  </PrimaryButton>
                </>
              )}
            </div>
          ) : null}

          {step === "verifying" ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-mint border-t-transparent" />
              <p className="text-[15px] font-semibold text-ink">กำลังตรวจสอบสลิป…</p>
              <p className="text-[13px] text-mute">ยอด {baht(total)} • ใช้เวลาไม่กี่วินาที</p>
            </div>
          ) : null}

          {step === "success" ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="pass-pop grid h-16 w-16 place-items-center rounded-full bg-mint text-[30px] text-on-mint shadow-mint">✓</span>
              <p className="text-[17px] font-semibold text-ink">ชำระเงินเรียบร้อยแล้ว</p>
              <p className="text-[13px] text-mute">กำลังออกบัตรรับของ #{code}…</p>
            </div>
          ) : null}

          {step === "soldout" ? (
            <div className="space-y-4 py-4 text-center">
              <p className="text-[16px] font-semibold text-ink">สต็อกไม่พอสำหรับ {qty} เครื่อง</p>
              <p className="text-[13px] text-mute">ตอนนี้คลังพะเยาเหลือ {available} เครื่อง ยังไม่มีการตัดเงิน กรุณาปรับจำนวนแล้วสั่งใหม่</p>
              <PrimaryButton onClick={() => onOpenChange(false)}>กลับไปแก้จำนวน</PrimaryButton>
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
