import { Link, createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell } from "@/components/app/AppShell";
import { OrderRow } from "@/components/app/OrderRow";
import { SectionTitle, StatusBadge } from "@/components/app/parts";
import { AcIllustration, PurifierShowcase } from "@/components/app/product";
import { BULK_MIN_QTY, BULK_PRICE, WHOLESALE_PRICE, baht } from "@/lib/pricing";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "แอร์ช่างพะเยา — ราคาส่ง Saijo Denki ฟอกอากาศ PM 2.5 สำหรับช่าง" },
      {
        name: "description",
        content: "แอปสั่งแอร์ Saijo Denki 12,000 BTU ฟอกอากาศไฟฟ้า PM 2.5 ราคาส่งสำหรับช่างแอร์พะเยา รับเองที่คลังพะเยา จ่ายผ่าน PromptPay",
      },
      { property: "og:title", content: "แอร์ช่างพะเยา — ราคาส่งช่าง Saijo Denki PM 2.5" },
      { property: "og:description", content: "สั่งแอร์ราคาส่ง สแกนจ่าย รับบัตร QR แล้วมารับของที่คลังพะเยาได้ทันที" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { stock, orders, profile, hydrated } = useAppState();
  const ready = orders.filter((o) => o.status === "ready");

  return (
    <AppShell wide>
      <AppHeader
        title={hydrated && profile.name ? `สวัสดี ${profile.name}` : "แอร์ช่างพะเยา"}
        subtitle="ช่างพาร์ทเนอร์ Saijo Denki"
      />
      <div className="space-y-5 px-5">
        <StatusBadge>
          📍 คลังหลักพะเยา (อ.เมือง) •{" "}
          {hydrated && stock <= 0 ? "สินค้าหมดชั่วคราว" : `พร้อมส่ง ${stock} เครื่อง (รับของได้ทันที)`}
        </StatusBadge>

        <div className="space-y-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
          <div className="space-y-5">
            {ready.length ? (
              <div>
                <SectionTitle>ของพร้อมรับที่คลัง</SectionTitle>
                <div className="space-y-3">
                  {ready.slice(0, 3).map((o) => (
                    <OrderRow key={o.code} order={o} />
                  ))}
                </div>
              </div>
            ) : null}

            <section className="rounded-[24px] border border-mint/25 bg-surface p-3">
              <AcIllustration />
              <div className="px-3 pb-2 pt-4">
                <p className="text-[13px] text-mute">Saijo Denki</p>
                <h2 className="text-[22px] font-bold leading-tight text-ink">Turbo A.P.S Inverter 12,000 BTU</h2>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-mute">ราคาส่งช่าง</p>
                    <p className="text-[26px] font-bold leading-tight text-deep">{baht(WHOLESALE_PRICE)}</p>
                  </div>
                  <p className="text-right text-[12px] text-deep">
                    {BULK_MIN_QTY} เครื่องขึ้นไป
                    <br />
                    เครื่องละ {baht(BULK_PRICE)}
                  </p>
                </div>
                <Link
                  to="/order"
                  className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-mint text-[15px] font-semibold text-on-mint shadow-mint"
                >
                  สั่งซื้อด่วน
                </Link>
              </div>
            </section>
          </div>

          <div>
            <SectionTitle>เปิดให้ลูกค้าดูหน้างาน</SectionTitle>
            <PurifierShowcase />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
