import { NumberRow } from "./parts";

/** Wall-mounted indoor unit with clean airflow lines (drawn, not a photo). */
export function AcIllustration() {
  return (
    <div className="relative h-[192px] overflow-hidden rounded-[16px] bg-[linear-gradient(160deg,var(--mintsoft),color-mix(in_oklab,var(--sky)_10%,var(--surface))_55%,var(--mintsoft))] lg:h-[260px]">
      <svg viewBox="0 0 330 192" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <path className="aero-flow" d="M8 128c40-14 80-10 120-4s100 8 194-10" fill="none" stroke="var(--sky)" strokeOpacity=".45" strokeWidth="2.5" strokeLinecap="round" />
        <path className="aero-flow" style={{ animationDelay: "-2s" }} d="M8 146c50-12 100-2 150-2s110-8 164-4" fill="none" stroke="var(--mint)" strokeOpacity=".55" strokeWidth="2.5" strokeLinecap="round" />
        <path className="aero-flow" style={{ animationDelay: "-4s" }} d="M26 163c60-8 120 4 180 0s80-6 110-6" fill="none" stroke="var(--sky)" strokeOpacity=".4" strokeWidth="2.5" strokeLinecap="round" />
        <path className="aero-flow" d="M210 96c30 0 60-4 104-12" fill="none" stroke="var(--sky)" strokeOpacity=".5" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="absolute left-1/2 top-[34%] h-[56px] w-[208px] -translate-x-1/2 rounded-[14px] border border-line bg-surface shadow-[0_14px_24px_-10px_color-mix(in_oklab,var(--sky)_70%,transparent)] lg:h-[72px] lg:w-[270px]">
        <span className="absolute bottom-2 right-3 h-1.5 w-1.5 rounded-full bg-mint" />
      </div>
    </div>
  );
}

export const PURIFIER_POINTS = [
  "ระบบกรองสนามไฟฟ้า Electrostatic ดักควันไฟป่า ละอองฝุ่น และเชื้อโรค",
  "ถอดล้างทำความสะอาดได้ตลอดอายุการใช้งาน ไม่ต้องเสียเงินซื้อไส้กรองเปลี่ยน",
  "เหมาะสำหรับห้องนอนและห้องพักผ่อนขนาด 16–20 ตร.ม.",
];

/** Customer-showcase card for the PM 2.5 electrostatic purifier. */
export function PurifierShowcase() {
  return (
    <section className="rounded-[24px] border-2 border-mint bg-surface p-5 shadow-showcase">
      <div className="flex items-start gap-4">
        <div className="grid h-[74px] w-[74px] shrink-0 place-items-center rounded-full bg-[conic-gradient(var(--mint),var(--sky),var(--mint))] p-[3px]">
          <div className="grid h-full w-full place-items-center rounded-full bg-surface text-center">
            <div>
              <p className="text-[19px] font-bold leading-none text-deep">0.01</p>
              <p className="mt-1 text-[9px] text-mute">ไมครอน</p>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mint">Electrostatic Air Purifier</p>
          <h2 className="mt-1 text-[16px] font-bold leading-snug text-ink">
            ✨ ระบบฟอกอากาศไฟฟ้าดักฝุ่น PM 2.5 ละเอียด 0.01 ไมครอน
          </h2>
        </div>
      </div>
      <div className="mt-3">
        {PURIFIER_POINTS.map((p, i) => (
          <NumberRow key={p} n={i + 1}>
            {p}
          </NumberRow>
        ))}
      </div>
    </section>
  );
}

export function ProductCard() {
  return (
    <section className="rounded-[24px] border border-mint/25 bg-surface p-3">
      <AcIllustration />
      <div className="px-3 pb-3 pt-4">
        <p className="text-[13px] text-mute">Saijo Denki</p>
        <h2 className="text-[24px] font-bold leading-tight text-ink">Inverter 12,000 BTU</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-mintsoft px-3 py-1.5 text-[12px] font-semibold text-deep">
            ประหยัดไฟเบอร์ 5 สูงสุด
          </span>
          <span className="inline-flex items-center rounded-full border border-sky/40 px-3 py-1.5 text-[12px] font-medium text-deep">
            R32 Inverter
          </span>
        </div>
      </div>
    </section>
  );
}
