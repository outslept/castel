"use client";
import BezierCanvas from "$/components/BezierCanvas";
import { useCurve } from "$/contexts/curve";
import { NAMED, type NamedEasing } from "$/lib/bezier";
import { RotateOverlay } from "$/components/RotateOverlay";
import { cn } from "$/lib/utils";

const QUICK_PRESETS: Array<{ label: string; key: NamedEasing }> = [
  { label: "out-quint", key: "ease-out-quint" },
  { label: "out-expo", key: "ease-out-expo" },
  { label: "in-out-quart", key: "ease-in-out-quart" },
  { label: "in-out-cubic", key: "ease-in-out-cubic" },
  { label: "ease", key: "ease" },
  { label: "linear", key: "linear" },
];

export default function BezierCurveEditor() {
  const { curve, setCurve } = useCurve();

  return (
    <div className="space-y-2.5">
      <RotateOverlay />

      <div className="relative overflow-hidden rounded-xl border border-border bg-surface/60">
        <BezierCanvas />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <div className="flex flex-wrap items-center gap-1">
          {QUICK_PRESETS.map(({ label, key }) => {
            const target = NAMED[key];
            const active =
              target[0] === curve[0] &&
              target[1] === curve[1] &&
              target[2] === curve[2] &&
              target[3] === curve[3];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCurve([...target])}
                className={cn(
                  "btn-press rounded-lg px-2.5 py-1 font-mono text-[11px]",
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <span className="hidden sm:inline font-mono text-[11px] text-muted-foreground/70">
          Click anchor to reset · Arrows to nudge
        </span>
      </div>
    </div>
  );
}
