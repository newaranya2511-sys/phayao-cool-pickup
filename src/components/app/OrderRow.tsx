import { Link } from "@tanstack/react-router";
import { baht } from "@/lib/pricing";
import type { Order } from "@/lib/store";

export function OrderRow({ order }: { order: Order }) {
  const ready = order.status === "ready";
  return (
    <Link
      to="/pickup/$code"
      params={{ code: order.code }}
      className="flex items-center gap-4 rounded-[24px] border border-mint/25 bg-surface p-4 transition hover:border-mint/60"
    >
      <div
        className={
          ready
            ? "grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-mint text-[20px] text-on-mint"
            : "grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-ground text-[20px] text-mute"
        }
      >
        ▣
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold tracking-wide text-ink">#{order.code}</p>
        <p className="truncate text-[12px] text-mute">
          {order.qty} ชุด • {baht(order.total)} •{" "}
          {new Date(order.status === "picked_up" && order.pickedUpAt ? order.pickedUpAt : order.paidAt).toLocaleString("th-TH", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <span
        className={
          ready
            ? "shrink-0 rounded-full bg-mintsoft px-2.5 py-1 text-[11px] font-semibold text-deep"
            : "shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-mute"
        }
      >
        {ready ? "พร้อมรับ" : "รับแล้ว"}
      </span>
    </Link>
  );
}
