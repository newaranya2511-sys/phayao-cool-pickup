import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell } from "@/components/app/AppShell";
import { OrderRow } from "@/components/app/OrderRow";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pickup/")({
  head: () => ({
    meta: [
      { title: "บัตรรับของ คลังพะเยา | แอร์ช่างพะเยา" },
      { name: "description", content: "บัตรรับของที่พร้อมรับและประวัติการรับสินค้าที่คลังหลักพะเยา" },
      { property: "og:title", content: "บัตรรับของ คลังพะเยา | แอร์ช่างพะเยา" },
      { property: "og:description", content: "ดูบัตร QR รับสินค้าและประวัติการรับของของช่าง" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PickupListPage,
});

function PickupListPage() {
  const { orders, hydrated } = useAppState();
  const [tab, setTab] = useState<"ready" | "done">("ready");
  const ready = orders.filter((o) => o.status === "ready");
  const done = orders.filter((o) => o.status === "picked_up");
  const list = tab === "ready" ? ready : done;

  return (
    <AppShell>
      <AppHeader title="รับของ" subtitle="บัตรรับสินค้า คลังหลักพะเยา" />
      <div className="px-5">
        <div role="tablist" className="flex gap-1 rounded-full border border-mint/25 bg-surface p-1">
          {(
            [
              ["ready", `พร้อมรับ (${ready.length})`],
              ["done", `รับแล้ว (${done.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "h-10 flex-1 rounded-full text-[13px] font-medium transition",
                tab === key ? "bg-mintsoft font-semibold text-deep" : "text-mute",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {!hydrated ? (
            <div className="h-20 animate-pulse rounded-[24px] bg-surface" />
          ) : list.length ? (
            list.map((o) => <OrderRow key={o.code} order={o} />)
          ) : (
            <div className="rounded-[24px] border border-mint/25 bg-surface p-8 text-center">
              <p className="text-[32px]">{tab === "ready" ? "📦" : "🗂️"}</p>
              <p className="mt-2 text-[15px] font-semibold text-ink">
                {tab === "ready" ? "ยังไม่มีของรอรับ" : "ยังไม่มีประวัติการรับของ"}
              </p>
              <p className="mt-1 text-[13px] text-mute">
                {tab === "ready"
                  ? "สั่งซื้อและชำระเงินแล้ว บัตร QR รับของจะขึ้นที่นี่ทันที"
                  : "เมื่อเจ้าหน้าที่คลังสแกนจ่ายของแล้ว ออเดอร์จะย้ายมาอยู่ที่นี่"}
              </p>
              {tab === "ready" ? (
                <Link
                  to="/order"
                  className="mt-5 inline-flex h-12 items-center rounded-full bg-mint px-6 text-[14px] font-semibold text-on-mint shadow-mint"
                >
                  สั่งซื้อด่วน
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
