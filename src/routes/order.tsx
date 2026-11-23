import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell } from "@/components/app/AppShell";
import { PaymentSheet } from "@/components/app/PaymentSheet";
import { PrimaryButton, RadioCard, SectionTitle, StatusBadge } from "@/components/app/parts";
import { ProductCard, PurifierShowcase } from "@/components/app/product";
import {
  BULK_MIN_QTY,
  BULK_PRICE,
  RETAIL_PRICE,
  baht,
  clampQty,
  orderTotal,
  profitPerUnit,
  unitPrice,
} from "@/lib/pricing";
import { useAppState, type PaymentMethod } from "@/lib/store";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "สั่งซื้อด่วน Saijo Denki 12,000 BTU ราคาส่งช่าง | แอร์ช่างพะเยา" },
      {
        name: "description",
        content: "สั่งแอร์ Saijo Denki Inverter 12,000 BTU ฟอกอากาศไฟฟ้า PM 2.5 ราคาส่งช่าง ฿11,500 รับเองที่คลังพะเยา สแกนจ่าย PromptPay",
      },
      { property: "og:title", content: "สั่งซื้อด่วน Saijo Denki 12,000 BTU | แอร์ช่างพะเยา" },
      { property: "og:description", content: "ราคาส่งช่าง ฿11,500 สั่ง 3 เครื่องขึ้นไปเหลือ ฿11,300 รับของที่คลังพะเยาได้ทันที" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { stock, hydrated } = useAppState();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<PaymentMethod>("promptpay");
  const [payOpen, setPayOpen] = useState(false);

  useEffect(() => {
    if (hydrated) setQty((q) => clampQty(q, stock));
  }, [stock, hydrated]);

  const soldOut = hydrated && stock <= 0;
  const price = unitPrice(Math.max(qty, 1));
  const total = orderTotal(qty);
  const ctaLabel = soldOut
    ? "สินค้าหมดชั่วคราว"
    : method === "promptpay"
      ? "สแกน QR จ่ายเพื่อรับรหัสรับของ"
      : "โอนเงินแนบสลิปเพื่อรับรหัสรับของ";

  const summary = (
    <>
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <span className="text-[13px] text-mute">ยอดรวม</span>
        <span className="text-[22px] font-bold text-deep tabular-nums">{baht(total)}</span>
      </div>
      <PrimaryButton disabled={soldOut || !hydrated || qty < 1} onClick={() => setPayOpen(true)}>
        {ctaLabel}
      </PrimaryButton>
    </>
  );

  return (
    <AppShell tabs={false} wide>
      <AppHeader title="สั่งซื้อด่วน" subtitle="ช่างพาร์ทเนอร์ Saijo Denki" back backTo="/" />
      <div className="px-5 pb-48 lg:pb-0">
        {soldOut ? (
          <StatusBadge tone="mute">📍 คลังหลักพะเยา (อ.เมือง) • สินค้าหมดชั่วคราว กำลังเติมสต็อก</StatusBadge>
        ) : (
          <StatusBadge>
            📍 คลังหลักพะเยา (อ.เมือง) • พร้อมส่ง {stock} เครื่อง (รับของได้ทันที)
          </StatusBadge>
        )}

        <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-6">
          <div className="space-y-5">
            <ProductCard />
            <PurifierShowcase />
          </div>

          <div className="mt-5 space-y-5 lg:mt-0">
            <section className="rounded-[24px] border border-mint/25 bg-surface p-5">
              <p className="text-[13px] text-mute">ราคาส่งช่าง</p>
              <p className="text-[32px] font-bold leading-tight text-deep tabular-nums">{baht(price)}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] text-mute">
                  ราคาแนะนำขายหน้าร้าน <span className="line-through">{baht(RETAIL_PRICE)}</span>
                </p>
                <span className="rounded-full bg-mint px-3.5 py-2 text-[13px] font-semibold text-on-mint">
                  กำไรช่าง {baht(profitPerUnit(Math.max(qty, 1)))}
                </span>
              </div>
            </section>

            <section className="flex items-center gap-4 rounded-[24px] border border-mint/25 bg-surface p-5">
              <div className="flex shrink-0 items-center rounded-full bg-ground p-1">
                <button
                  type="button"
                  aria-label="ลดจำนวน"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => clampQty(q - 1, stock))}
                  className="grid h-11 w-11 place-items-center rounded-full bg-surface text-[20px] text-mute shadow-soft disabled:opacity-50"
                >
                  −
                </button>
                <span aria-live="polite" className="w-10 text-center text-[18px] font-semibold text-ink tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="เพิ่มจำนวน"
                  disabled={qty >= stock}
                  onClick={() => setQty((q) => clampQty(q + 1, stock))}
                  className="grid h-11 w-11 place-items-center rounded-full bg-mint text-[20px] text-on-mint shadow-mint disabled:bg-mute/40 disabled:shadow-none"
                >
                  +
                </button>
              </div>
              <p className="min-w-0 text-[13px] leading-relaxed text-deep">
                {qty >= BULK_MIN_QTY
                  ? `ได้ราคาส่งพิเศษ เครื่องละ ${baht(BULK_PRICE)} แล้ว`
                  : qty >= stock && stock > 0
                    ? `สั่งได้สูงสุด ${stock} เครื่องตามสต็อก`
                    : `สั่ง ${BULK_MIN_QTY} เครื่องขึ้นไป เหลือเครื่องละ ${baht(BULK_PRICE)}`}
              </p>
            </section>

            <div>
              <SectionTitle>จุดรับสินค้า</SectionTitle>
              <RadioCard name="pickup" selected onSelect={() => {}}>
                🚗 รับเองที่คลังพะเยา (ซอยร่องห้า อ.เมือง) • คลังจัดเตรียมของรอทันที
              </RadioCard>
            </div>

            <div>
              <SectionTitle>ชำระเงิน</SectionTitle>
              <div className="space-y-3">
                <RadioCard name="pay" selected={method === "promptpay"} onSelect={() => setMethod("promptpay")}>
                  ⚡ สแกน QR PromptPay (ตัดยอดอัตโนมัติ 0 นาที)
                </RadioCard>
                <RadioCard name="pay" selected={method === "slip"} onSelect={() => setMethod("slip")}>
                  โอนเงินแนบสลิป
                </RadioCard>
              </div>
            </div>

            <div className="hidden rounded-[24px] border border-mint/25 bg-surface p-5 shadow-soft lg:sticky lg:bottom-6 lg:block">{summary}</div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[640px] rounded-t-[24px] border-t border-mint/20 bg-surface px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 shadow-[0_-10px_30px_-20px_color-mix(in_oklab,var(--ink)_40%,transparent)] lg:hidden">
        {summary}
      </div>

      <PaymentSheet
        open={payOpen}
        onOpenChange={setPayOpen}
        qty={qty}
        method={method}
        onPaid={(order) => {
          setPayOpen(false);
          void navigate({ to: "/pickup/$code", params: { code: order.code } });
        }}
      />
    </AppShell>
  );
}
