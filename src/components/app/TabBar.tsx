import { Link } from "@tanstack/react-router";
import { AppIcon } from "./AppIcon";

const tabs = [
  { to: "/", label: "หน้าหลัก", icon: "⌂", exact: true },
  { to: "/order", label: "สั่งซื้อ", icon: "＋", exact: false },
  { to: "/pickup", label: "รับของ", icon: "▣", exact: false },
  { to: "/profile", label: "บัญชี", icon: "○", exact: false },
] as const;

const pill =
  "flex h-11 w-16 flex-col items-center justify-center rounded-full text-[11px] font-medium text-mute transition data-[status=active]:bg-mintsoft data-[status=active]:font-semibold data-[status=active]:text-deep";

/** Bottom tab bar on phone / tablet portrait. */
export function TabBar({ badge }: { badge?: number }) {
  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[640px] justify-around rounded-t-[24px] border-t border-mint/20 bg-surface px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 lg:hidden"
    >
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} activeOptions={{ exact: t.exact }} className={`${pill} relative`}>
          <span className="text-[17px] leading-none">{t.icon}</span>
          {t.label}
          {t.to === "/pickup" && badge ? (
            <span className="absolute right-2 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-mint px-1 text-[10px] font-bold text-on-mint">
              {badge}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}

/** Left rail on tablet landscape / desktop, same pills stacked. */
export function SideRail({ badge }: { badge?: number }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col gap-6 border-r border-mint/20 bg-surface px-4 py-6 lg:flex">
      <div className="flex items-center gap-3 px-1">
        <AppIcon />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink">แอร์ช่างพะเยา</p>
          <p className="truncate text-[11px] text-mute">ช่างพาร์ทเนอร์ Saijo Denki</p>
        </div>
      </div>
      <nav aria-label="เมนูหลัก" className="flex flex-col gap-1">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeOptions={{ exact: t.exact }}
            className="flex h-11 items-center gap-3 rounded-full px-4 text-[14px] font-medium text-mute transition hover:bg-ground data-[status=active]:bg-mintsoft data-[status=active]:font-semibold data-[status=active]:text-deep"
          >
            <span className="w-5 text-center text-[17px] leading-none">{t.icon}</span>
            <span className="flex-1">{t.label}</span>
            {t.to === "/pickup" && badge ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-mint px-1.5 text-[11px] font-bold text-on-mint">
                {badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
