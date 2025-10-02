"use client";

import { useMemo, useState } from "react";
import { useCurve } from "$/contexts/curve";
import { formatCss } from "$/lib/bezier";
import { Play } from "lucide-react";

const DURATIONS = [150, 200, 300, 400, 700, 1000];

export function DurationPreview({ className }: { className?: string }) {
  const { curve } = useCurve();
  const easing = useMemo(() => formatCss(curve), [curve]);
  const [dur, setDur] = useState<number>(300);
  const [tick, setTick] = useState(0);

  return (
    <div
      className={[
        "inline-flex flex-col gap-2 rounded-lg border border-border bg-card/80 p-2 backdrop-blur-md shadow-sm",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {DURATIONS.map((d) => (
          <button
            key={d}
            onClick={() => setDur(d)}
            className={[
              "h-8 rounded-md px-2 text-xs font-medium transition-colors",
              dur === d
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-accent hover:text-accent-foreground",
            ].join(" ")}
          >
            {d}ms
          </button>
        ))}
        <button
          onClick={() => setTick((t) => t + 1)}
          className="ml-1 inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          title="Play"
        >
          <Play className="h-3.5 w-3.5" />
          Play
        </button>
      </div>

      <div className="relative h-10 w-[min(85vw,560px)]">
        <div className="absolute inset-x-3 inset-y-0">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-muted-foreground/20" />
          <div
            key={tick}
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary ring-2 ring-background shadow"
            style={
              {
                animation: `preview-move ${dur}ms 0ms 1 both`,
                animationTimingFunction: easing,
              } as React.CSSProperties
            }
          />
        </div>
        <style>{`@keyframes preview-move { from { left: 0; } to { left: calc(100% - 12px); } }`}</style>
      </div>
    </div>
  );
}
