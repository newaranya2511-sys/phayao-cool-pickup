import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell } from "@/components/app/AppShell";
import { NumberRow, StatusBadge } from "@/components/app/parts";
import { QrCode } from "@/components/app/QrCode";
import warehouseImg from "@/assets/phayao_warehouse_docks.jpg";
import { PRODUCT, WAREHOUSE } from "@/lib/config";
import { boxCount } from "@/lib/pricing";
import {
  decodeSharedPass,
  encodeSharedPass,
  markPickedUp,
  useAppState,
  type SharedPass,
} from "@/lib/store";

export const Route = createFileRoute("/pickup/$code")({
  validateSearch: (search: Record<string, unknown>): { d?: string } =>
    typeof search["d"] === "string" ? { d: search["d"] } : {},
  head: ({ params }) => ({
    meta: [
      { title: `บัตรรับสินค้าดิจิทัล #${params.code} | แอร์ช่างพะเยา` },
      { name: "description", content: "แสดง QR นี้ให้เจ้าหน้าที่คลังพะเยาสแกนเพื่อรับแอร์ Saijo Denki ที่ชำระเงินแล้ว" },
      { property: "og:title", content: `บัตรรับสินค้า #${params.code} | คลังหลักพะเยา` },
      { property: "og:description", content: "บัตรรับของดิจิทัลสำหรับรับสินค้าที่คลังหลักพะเยา" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PickupPassPage,
});

const thDate = (t: number) =>
  new Date(t).toLocaleString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function PickupPassPage() {
  const { code } = Route.useParams();
  const { d } = Route.useSearch();
  const { orders, hydrated, staffMode } = useAppState();
  const own = orders.find((o) => o.code === code);
  const shared = !own && d ? decodeSharedPass(d) : null;
  const pass: SharedPass | null = own ?? (shared && shared.code === code ? shared : null);

  if (!hydrated) {
    return (
      <AppShell tabs={false}>
        <AppHeader title="บัตรรับสินค้าดิจิทัล" subtitle={`ออเดอร์ #${code}`} back backTo="/pickup" />
        <div className="space-y-5 px-5">
          <div className="h-10 animate-pulse rounded-full bg-mintsoft" />
          <div className="h-[420px] animate-pulse rounded-[24px] bg-surface" />
        </div>
      </AppShell>
    );
  }

  if (!pass) {
    return (
      <AppShell tabs={false}>
        <AppHeader title="บัตรรับสินค้าดิจิทัล" subtitle={`ออเดอร์ #${code}`} back backTo="/pickup" />
        <div className="mx-5 rounded-[24px] border border-mint/25 bg-surface p-8 text-center">
          <p className="text-[32px]">🔍</p>
          <p className="mt-2 text-[16px] font-semibold text-ink">ไม่พบบัตรรับของ #{code}</p>
          <p className="mt-1 text-[13px] text-mute">บัตรนี้อาจอยู่ในมือถือเครื่องอื่น ขอให้ผู้สั่งซื้อกดส่งต่อบัตรมาให้อีกครั้ง</p>
          <Link to="/pickup" className="mt-5 inline-flex h-12 items-center rounded-full bg-mint px-6 text-[14px] font-semibold text-on-mint shadow-mint">
            ดูบัตรรับของทั้งหมด
          </Link>
        </div>
      </AppShell>
    );
  }

  const pickedUp = pass.status === "picked_up";

  const share = async () => {
    if (!own) return;
    const url = `${window.location.origin}/pickup/${own.code}?d=${encodeSharedPass(own)}`;
    const text = `บัตรรับของ #${own.code} • ${PRODUCT.fullName} ${own.qty} ชุด — เปิดลิงก์แล้วให้เจ้าหน้าที่คลังพะเยาสแกน QR`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `บัตรรับของ #${own.code}`, text, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success("คัดลอกลิงก์บัตรรับของแล้ว", { description: "วางส่งใน LINE ให้ลูกน้องหรือคนขับรถได้เลย" });
    } catch {
      toast.error("คัดลอกลิงก์ไม่สำเร็จ ลองอีกครั้ง");
    }
  };

  const qrCard = (
    <section className="rounded-[24px] border border-mint/25 bg-surface p-6 text-center">
      <div className="relative mx-auto w-full max-w-[300px] rounded-[20px] border-2 border-mint/40 p-5 text-ink">
        <QrCode value={`PICKUP:${pass.code}`} label={`QR รับสินค้า ${pass.code}`} className={pickedUp ? "opacity-15" : ""} />
        {pickedUp ? (
          <div className="absolute inset-0 grid place-items-center">
            <span className="-rotate-6 rounded-[14px] border-2 border-deep bg-surface px-4 py-2 text-[16px] font-bold text-deep">
              จ่ายของแล้ว
            </span>
          </div>
        ) : null}
      </div>
      <p className="mt-5 text-[12px] tracking-[0.25em] text-mute">รหัสรับสินค้า</p>
      <p className="mt-1 text-[34px] font-bold leading-none tracking-[0.15em] text-ink">{pass.code}</p>
      <p className="mx-auto mt-5 rounded-[20px] bg-mintsoft px-4 py-3 text-[14px] leading-relaxed text-deep">
        {pickedUp ? `รับสินค้าเรียบร้อยแล้ว ${own?.pickedUpAt ? thDate(own.pickedUpAt) : ""}` : "แสดงหน้าจอนี้ให้เจ้าหน้าที่คลังยิงสแกนเพื่อจ่ายของ"}
      </p>
    </section>
  );

  return (
    <AppShell tabs={false} wide>
      <AppHeader title="บัตรรับสินค้าดิจิทัล" subtitle={`ออเดอร์ #${pass.code}`} back backTo="/pickup" />
      <div className="px-5">
        <div className="px-1 lg:px-0">
          {pickedUp ? (
            <StatusBadge tone="mute">รับสินค้าแล้ว • ออเดอร์นี้ปิดเรียบร้อย</StatusBadge>
          ) : (
            <StatusBadge>พร้อมรับสินค้าทันที • สินค้าถูกล็อกและแพ็กเรียบร้อย</StatusBadge>
          )}
        </div>
        {shared ? (
          <p className="mt-3 px-1 text-[13px] text-mute">
            บัตรที่ส่งต่อมาจาก {shared.buyerName} • {shared.buyerPhone}
          </p>
        ) : null}

        <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
          <div className="space-y-5 lg:sticky lg:top-6">
            {qrCard}
            {staffMode && own && !pickedUp ? (
              <section className="rounded-[24px] border-2 border-dashed border-sky/50 bg-surface p-5">
                <p className="text-[12px] font-semibold tracking-wide text-sky">โหมดเจ้าหน้าที่คลัง (ทดสอบ)</p>
                <p className="mt-1 text-[13px] text-mute">ใช้ทดลองว่าเจ้าหน้าที่ยิงสแกน QR นี้และจ่ายของแล้ว</p>
                <button
                  type="button"
                  onClick={() => {
                    markPickedUp(own.code);
                    toast.success(`จ่ายของ #${own.code} เรียบร้อย`);
                  }}
                  className="mt-3 min-h-12 w-full rounded-full bg-deep px-4 text-[14px] font-semibold text-on-mint"
                >
                  จำลองเจ้าหน้าที่คลังสแกนจ่ายของ
                </button>
              </section>
            ) : null}
          </div>

          <div className="mt-5 space-y-5 lg:mt-0">
            <section className="rounded-[24px] border border-mint/25 bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-[16px] font-semibold leading-snug text-ink">{PRODUCT.fullName}</p>
                <span className="shrink-0 rounded-full bg-mintsoft px-2.5 py-1 text-[11px] font-semibold text-deep">ชำระเงินเรียบร้อยแล้ว</span>
              </div>
              <p className="mt-2 text-[14px] text-mute">
                {pass.qty} ชุด (คอยล์เย็น {pass.qty} + คอยล์ร้อน {pass.qty} รวม {boxCount(pass.qty)} กล่อง)
              </p>
              {own ? (
                <p className="mt-1 text-[12px] text-mute">
                  ผู้รับ: {own.buyerName} • {own.buyerPhone} • ชำระ {thDate(own.paidAt)}
                </p>
              ) : null}
            </section>

            <section className="rounded-[24px] border border-mint/25 bg-surface p-3">
              <img
                src={warehouseImg}
                alt="จุดรับสินค้าคลังหลักพะเยา"
                width={1536}
                height={1024}
                className="h-[140px] w-full rounded-[16px] object-cover lg:h-[180px]"
              />
              <div className="px-2 pb-1 pt-3">
                <p className="text-[16px] font-bold text-ink">{WAREHOUSE.name}</p>
                <p className="text-[14px] text-mute">{WAREHOUSE.address}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={WAREHOUSE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-deep px-2 text-[13px] font-semibold text-on-mint"
                >
                  <PinIcon /> นำทาง Google Maps
                </a>
                <a
                  href={`tel:${WAREHOUSE.phone}`}
                  className="flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-mintsoft px-2 text-[13px] font-semibold text-deep"
                >
                  <PhoneIcon /> ติดต่อคลังสินค้า
                </a>
              </div>
            </section>

            <section className="rounded-[24px] border border-mint/25 bg-surface px-5 py-3">
              <NumberRow n={1} active={!pickedUp}>ขับรถเข้าจุดรับสินค้าหน้าร้านคลังพะเยา</NumberRow>
              <NumberRow n={2}>เปิด QR นี้ให้เจ้าหน้าที่สแกนจ่ายเครื่อง</NumberRow>
              <NumberRow n={3}>ตรวจสอบ Serial Number และยกของขึ้นกระบะ</NumberRow>
            </section>

            {own && !pickedUp ? (
              <button
                type="button"
                onClick={share}
                className="flex min-h-[60px] w-full items-center gap-3 rounded-full border-2 border-deep/25 bg-surface px-6 py-2 text-[14px] font-semibold text-deep transition hover:bg-mintsoft"
              >
                <ShareIcon />
                <span className="flex-1 text-center">ส่งต่อบัตรรับของให้ลูกน้องหรือคนขับรถมารับแทน</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0" aria-hidden>
      <path d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5" />
    </svg>
  );
}
