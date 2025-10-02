"use client";

import { useMemo, useState } from "react";
import { Popover } from "@base-ui-components/react/popover";
import { GitCompare } from "lucide-react";
import { PresetAutocomplete } from "$/components/presets/PresetAutocomplete";
import { formatCss, parseCurve, type Bezier } from "$/lib/bezier";

export function CompareMenu({
  enabled,
  onEnabledChange,
  refCurve,
  onRefCurveChange,
  onApplyRefToCurrent,
  onUseCurrentAsRef,
  color,
  onColorChange,
  opacity,
  onOpacityChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  refCurve: Bezier;
  onRefCurveChange: (c: Bezier) => void;
  onApplyRefToCurrent: () => void;
  onUseCurrentAsRef: () => void;
  color: string;
  onColorChange: (c: string) => void;
  opacity: number;
  onOpacityChange: (n: number) => void;
}) {
  const [text, setText] = useState(formatCss(refCurve));
  const css = useMemo(() => formatCss(refCurve), [refCurve]);

  const commit = () => {
    const parsed = parseCurve(text);
    if (parsed) onRefCurveChange(parsed);
    else setText(css);
  };

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Compare"
        className={[
          "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 text-xs font-medium transition-colors",
          enabled
            ? "bg-primary/10 text-primary hover:bg-primary/15"
            : "hover:bg-accent hover:text-accent-foreground",
        ].join(" ")}
      >
        <GitCompare className="h-4 w-4" />
        <span className="hidden md:inline">Compare</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          sideOffset={10}
          align="end"
          className="outline-none"
        >
          <Popover.Popup className="z-50 w-[min(92vw,360px)] rounded-xl border border-border bg-card/95 text-foreground shadow-lg backdrop-blur-md p-2">
            <div className="flex items-center justify-between gap-2 p-1">
              <div className="text-sm font-medium">Compare</div>
              <button
                type="button"
                onClick={() => onEnabledChange(!enabled)}
                className={[
                  "h-8 rounded-md px-2 text-xs font-medium transition-colors",
                  enabled
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:bg-accent hover:text-accent-foreground",
                ].join(" ")}
              >
                {enabled ? "On" : "Off"}
              </button>
            </div>

            <div className="my-2 h-px bg-border/60" />

            <div className="p-1">
              <PresetAutocomplete
                value={text}
                onValueChange={setText}
                onCommit={commit}
                onPick={(c, s) => {
                  onRefCurveChange(c);
                  setText(s);
                }}
                label="Reference"
                placeholder='e.g. "ease-out" or cubic-bezier(...)'
              />
            </div>

            <div className="my-2 h-px bg-border/60" />

            <div className="grid grid-cols-[auto,1fr] items-center gap-2 p-1">
              <div className="text-xs text-muted-foreground">Opacity</div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              />
              <div className="text-xs text-muted-foreground">Color</div>
              <div className="flex items-center gap-1.5">
                {[
                  "var(--muted-foreground)",
                  "oklch(0.72 0.2 30)",
                  "oklch(0.72 0.2 200)",
                  "oklch(0.76 0.24 140)",
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onColorChange(c)}
                    className="h-5 w-5 rounded-full border border-border"
                    style={{
                      background: c,
                      boxShadow:
                        color === c ? "0 0 0 2px var(--ring) inset" : undefined,
                    }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1">
              <button
                type="button"
                onClick={onUseCurrentAsRef}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Use current as ref
              </button>
              <button
                type="button"
                onClick={onApplyRefToCurrent}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Apply ref to current
              </button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
