"use client";

import { useCurve } from "$/contexts/curve";
import { cn } from "$/lib/utils";

export default function CoordinatesBadge() {
  const { curve, activePoint, hoveredPoint } = useCurve();
  const [x1, y1, x2, y2] = curve;
  const p1 = activePoint === 0 || hoveredPoint === 0;
  const p2 = activePoint === 1 || hoveredPoint === 1;

  return (
    <div className="pointer-events-none absolute right-2.5 top-2.5 z-10 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-2.5 py-1 font-mono text-[11px] tabular-nums shadow-2xs backdrop-blur-md">
      <span
        className={cn(
          "rounded px-1.5 py-0.5 transition-colors duration-150",
          p1
            ? "bg-secondary text-foreground font-medium"
            : "text-muted-foreground",
        )}
      >
        P1 ({x1.toFixed(2)}, {y1.toFixed(2)})
      </span>
      <span className="text-border">/</span>
      <span
        className={cn(
          "rounded px-1.5 py-0.5 transition-colors duration-150",
          p2
            ? "bg-secondary text-foreground font-medium"
            : "text-muted-foreground",
        )}
      >
        P2 ({x2.toFixed(2)}, {y2.toFixed(2)})
      </span>
    </div>
  );
}
