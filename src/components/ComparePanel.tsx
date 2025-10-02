"use client";

import { useMemo, useState } from "react";
import { NAMED, parseCurve, formatCss, type Bezier } from "$/lib/bezier";
import { PresetAutocomplete } from "$/components/presets/PresetAutocomplete";

export function ComparePanel({
  enabled,
  onEnabledChange,
  refCurve,
  onRefCurveChange,
  onApplyRefToCurrent,
  onUseCurrentAsRef,
  color = "var(--muted-foreground)",
  onColorChange,
  opacity = 0.45,
  onOpacityChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  refCurve: Bezier;
  onRefCurveChange: (c: Bezier) => void;
  onApplyRefToCurrent: () => void;
  onUseCurrentAsRef: () => void;
  color?: string;
  onColorChange?: (c: string) => void;
  opacity?: number;
  onOpacityChange?: (n: number) => void;
}) {
  const [text, setText] = useState(formatCss(refCurve));
  const css = useMemo(() => formatCss(refCurve), [refCurve]);

  const commit = () => {
    const parsed = parseCurve(text);
    if (parsed) onRefCurveChange(parsed);
    else setText(css);
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card/80 p-3">
      <div className="flex items-center justify-between gap-2">
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

      <PresetAutocomplete
        value={text}
        onValueChange={setText}
        onCommit={commit}
        onPick={(c, s) => {
          onRefCurveChange(c);
          setText(s);
        }}
        label="Reference curve"
        placeholder='e.g. "ease-out" or cubic-bezier(...)'
      />

      <div className="grid grid-cols-2 gap-2">
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

      <div className="grid grid-cols-[auto,1fr] items-center gap-2">
        <div className="text-xs text-muted-foreground">Opacity</div>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange?.(parseFloat(e.target.value))}
        />
        <div className="text-xs text-muted-foreground">Color</div>
        <div className="flex items-center gap-1.5">
          {[
            { v: "var(--muted-foreground)" },
            { v: "oklch(0.72 0.2 30)" },
            { v: "oklch(0.72 0.2 200)" },
            { v: "oklch(0.76 0.24 140)" },
          ].map((c) => (
            <button
              key={c.v}
              type="button"
              onClick={() => onColorChange?.(c.v)}
              className="h-6 w-6 rounded-md border border-border"
              style={{
                background: c.v,
                boxShadow:
                  color === c.v ? "0 0 0 2px var(--ring) inset" : undefined,
              }}
              aria-label={`Color ${c.v}`}
              title={c.v}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
