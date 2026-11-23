import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("rounded-[24px] border border-mint/25 bg-surface", className)}>{children}</section>;
}

export function StatusBadge({ children, className, tone = "mint" }: { children: ReactNode; className?: string; tone?: "mint" | "mute" }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-[22px] border px-3.5 py-2.5 text-[13px] font-medium leading-snug",
        tone === "mint" ? "border-mint/30 bg-mintsoft text-deep" : "border-line bg-surface text-mute",
        className,
      )}
    >
      <span
        className={cn(
          "mt-[5px] h-2 w-2 shrink-0 rounded-full",
          tone === "mint" ? "bg-mint shadow-[0_0_0_4px_color-mix(in_oklab,var(--mint)_25%,transparent)]" : "bg-mute",
        )}
      />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 px-1 text-[14px] font-semibold text-ink">{children}</h3>;
}

export function NumberRow({ n, active, children }: { n: number; active?: boolean; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2 text-[14px] leading-relaxed">
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold",
          active ? "bg-mint text-on-mint" : "bg-mintsoft text-deep",
        )}
      >
        {n}
      </span>
      <span className="text-ink">{children}</span>
    </div>
  );
}

export function RadioCard({
  selected,
  onSelect,
  children,
  name,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  name: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-[24px] bg-surface p-5 text-[14px] leading-relaxed transition",
        selected ? "border-2 border-mint font-medium text-ink" : "border border-mint/25 text-mute hover:border-mint/50",
      )}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
          selected ? "bg-mint" : "border-2 border-mute/30",
        )}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-surface" /> : null}
      </span>
      <span className="min-w-0">{children}</span>
    </label>
  );
}

export function PrimaryButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "h-14 w-full rounded-full bg-mint px-5 text-[15px] font-semibold text-on-mint shadow-mint transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-mute/40 disabled:shadow-none",
        className,
      )}
    />
  );
}

export function SecondaryButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "min-h-12 w-full rounded-full border-2 border-mint bg-surface px-4 py-2 text-[14px] font-semibold text-deep transition hover:bg-mintsoft disabled:opacity-50",
        className,
      )}
    />
  );
}
