import { useId } from "react";
import { cn } from "@/lib/utils";

/** Clean air flow with an electrostatic spark. */
export function AppIcon({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={cn("h-11 w-11", className)} aria-hidden>
      <defs>
        <linearGradient id={`aero-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--mint)" />
          <stop offset="1" stopColor="var(--sky)" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#aero-${id})`} />
      <path d="M9 19c6-4 11 4 18 0s9-3 12-1" fill="none" stroke="var(--surface)" strokeWidth="3" strokeLinecap="round" />
      <path d="M9 28c6-4 11 4 18 0s9-3 12-1" fill="none" stroke="var(--surface)" strokeWidth="3" strokeLinecap="round" opacity=".75" />
      <path d="M33 31l-4 7h4l-2 6 6-8h-4l2-5z" fill="var(--surface)" />
    </svg>
  );
}
