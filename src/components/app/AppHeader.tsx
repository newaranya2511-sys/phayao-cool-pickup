import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppIcon } from "./AppIcon";

interface Props {
  title: string;
  subtitle?: string;
  /** Show the kit's back button (detail screens). Top-level tabs show the app icon instead. */
  back?: boolean;
  backTo?: string;
  right?: ReactNode;
}

export function AppHeader({ title, subtitle, back = false, backTo = "/", right }: Props) {
  const router = useRouter();
  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else void router.navigate({ to: backTo });
  };
  return (
    <header className="flex items-center gap-3 px-5 pb-3 pt-4">
      {back ? (
        <button
          type="button"
          onClick={goBack}
          aria-label="ย้อนกลับ"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-mint/25 bg-surface transition hover:bg-mintsoft"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
            <path d="M11 4 6 9l5 5" />
          </svg>
        </button>
      ) : (
        <AppIcon className="shrink-0 lg:hidden" />
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-semibold text-ink">{title}</h1>
        {subtitle ? <p className="truncate text-[12px] text-mute">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
