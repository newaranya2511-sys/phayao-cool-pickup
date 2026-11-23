import { useMemo } from "react";
import { create } from "qrcode/lib/core/qrcode";
import { cn } from "@/lib/utils";

/** Scannable QR drawn as SVG in the current text color. */
export function QrCode({ value, className, label }: { value: string; className?: string; label: string }) {
  const { size, path } = useMemo(() => {
    const { modules } = create(value, { errorCorrectionLevel: "M" });
    let d = "";
    for (let r = 0; r < modules.size; r++) {
      for (let c = 0; c < modules.size; c++) {
        if (modules.get(r, c)) d += `M${c} ${r}h1v1h-1z`;
      }
    }
    return { size: modules.size, path: d };
  }, [value]);

  return (
    <svg
      viewBox={`-1 -1 ${size + 2} ${size + 2}`}
      role="img"
      aria-label={label}
      className={cn("block h-auto w-full", className)}
      shapeRendering="crispEdges"
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}
