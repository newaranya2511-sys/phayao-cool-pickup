import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell } from "@/components/app/AppShell";
import { PrimaryButton, SectionTitle } from "@/components/app/parts";
import { Switch } from "@/components/ui/switch";
import { baht } from "@/lib/pricing";
import { resetTestData, saveProfile, setStaffMode, useAppState } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "บัญชีช่าง | แอร์ช่างพะเยา" },
      { name: "description", content: "ข้อมูลช่างผู้สั่งซื้อและสรุปยอดสั่งแอร์ Saijo Denki จากคลังพะเยา" },
      { property: "og:title", content: "บัญชีช่าง | แอร์ช่างพะเยา" },
      { property: "og:description", content: "แก้ไขข้อมูลผู้มารับสินค้าและดูยอดสั่งซื้อ" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const inputCls =
  "h-12 w-full rounded-[16px] border border-mint/25 bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-mute focus:border-mint focus:ring-2 focus:ring-mint/20";

function ProfilePage() {
  const { profile, orders, staffMode, hydrated, stock } = useAppState();
  const [form, setForm] = useState(profile);
  useEffect(() => {
    if (hydrated) setForm(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const units = orders.reduce((n, o) => n + o.qty, 0);
  const spent = orders.reduce((n, o) => n + o.total, 0);
  const initial = (form.name || "ช").trim().charAt(0);

  return (
    <AppShell>
      <AppHeader title="บัญชี" subtitle="ข้อมูลช่างผู้สั่งซื้อ" />
      <div className="space-y-5 px-5">
        <section className="flex items-center gap-4 rounded-[24px] border border-mint/25 bg-surface p-5">
          <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-mint to-sky p-[2px]">
            <div className="grid h-full w-full place-items-center rounded-full bg-surface text-[18px] font-bold text-deep">{initial}</div>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold text-ink">{profile.name || "ช่างพาร์ทเนอร์"}</p>
            <p className="truncate text-[12px] text-mute">{profile.shop || "ช่างแอร์พื้นที่จังหวัดพะเยา"}</p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <section className="rounded-[24px] border border-mint/25 bg-surface p-4">
            <p className="text-[12px] text-mute">สั่งไปแล้ว</p>
            <p className="text-[22px] font-bold text-deep">{units} เครื่อง</p>
          </section>
          <section className="rounded-[24px] border border-mint/25 bg-surface p-4">
            <p className="text-[12px] text-mute">ยอดสั่งซื้อรวม</p>
            <p className="text-[22px] font-bold text-deep">{baht(spent)}</p>
          </section>
        </div>

        <form
          className="space-y-3 rounded-[24px] border border-mint/25 bg-surface p-5"
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile({ name: form.name.trim(), shop: form.shop.trim(), phone: form.phone.replace(/\D/g, "") });
            toast.success("บันทึกข้อมูลแล้ว");
          }}
        >
          <SectionTitle>ข้อมูลผู้มารับสินค้า</SectionTitle>
          <label className="block">
            <span className="mb-1 block px-1 text-[12px] text-mute">ชื่อช่าง</span>
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="เช่น ช่างต้น" />
          </label>
          <label className="block">
            <span className="mb-1 block px-1 text-[12px] text-mute">ชื่อร้าน</span>
            <input className={inputCls} value={form.shop} onChange={(e) => setForm({ ...form, shop: e.target.value })} placeholder="เช่น ต้นแอร์เซอร์วิส แม่ใจ" />
          </label>
          <label className="block">
            <span className="mb-1 block px-1 text-[12px] text-mute">เบอร์โทร</span>
            <input className={inputCls} value={form.phone} inputMode="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08x-xxx-xxxx" />
          </label>
          <PrimaryButton type="submit">บันทึกข้อมูล</PrimaryButton>
        </form>

        <section className="space-y-4 rounded-[24px] border-2 border-dashed border-sky/50 bg-surface p-5">
          <div>
            <p className="text-[12px] font-semibold tracking-wide text-sky">สำหรับทดสอบระบบ</p>
            <p className="mt-1 text-[13px] text-mute">ข้อมูลออเดอร์และสต็อก ({stock} เครื่อง) เก็บไว้ในเครื่องนี้เท่านั้น</p>
          </div>
          <label className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block text-[14px] font-medium text-ink">โหมดเจ้าหน้าที่คลัง</span>
              <span className="block text-[12px] text-mute">แสดงปุ่มจำลองสแกนจ่ายของบนบัตรรับของ</span>
            </span>
            <Switch checked={staffMode} onCheckedChange={setStaffMode} aria-label="โหมดเจ้าหน้าที่คลัง" />
          </label>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("ล้างออเดอร์ทั้งหมดและคืนสต็อกเป็น 28 เครื่อง?")) {
                resetTestData();
                toast.success("ล้างข้อมูลทดสอบแล้ว");
              }
            }}
            className="min-h-12 w-full rounded-full border border-destructive/30 px-4 text-[14px] font-semibold text-destructive hover:bg-destructive/5"
          >
            ล้างข้อมูลทดสอบ
          </button>
        </section>
      </div>
    </AppShell>
  );
}
