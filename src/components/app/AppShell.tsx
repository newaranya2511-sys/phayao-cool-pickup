import type { ReactNode } from "react";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SideRail, TabBar } from "./TabBar";

/** Page frame: side rail on desktop, bottom tabs on phone (hidden on full-screen flows). */
export function AppShell({
  children,
  tabs = true,
  wide = false,
}: {
  children: ReactNode;
  tabs?: boolean;
  wide?: boolean;
}) {
  const { orders } = useAppState();
  const ready = orders.filter((o) => o.status === "ready").length;
  return (
    <div className="flex min-h-screen bg-ground">
      <SideRail badge={ready} />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "mx-auto w-full max-w-[640px]",
            wide && "lg:max-w-[1040px] lg:px-6",
            !wide && "lg:max-w-[720px] lg:px-6",
            tabs ? "pb-28 lg:pb-10" : "pb-10",
          )}
        >
          {children}
        </div>
      </div>
      {tabs ? <TabBar badge={ready} /> : null}
    </div>
  );
}
