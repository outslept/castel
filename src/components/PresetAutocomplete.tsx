"use client";
import { Autocomplete } from "@base-ui-components/react/autocomplete";
import { useMemo } from "react";
import { NAMED, formatCss, type NamedEasing } from "$/lib/bezier";
import { BezierDefinition } from "motion";
import { cn } from "$/lib/utils";

type Preset = {
  id: string;
  name: NamedEasing;
  curve: BezierDefinition;
  css: string;
};

function MiniCurve({
  curve,
  width = 56,
  height = 32,
  pad = 4,
}: {
  curve: BezierDefinition;
  width?: number;
  height?: number;
  pad?: number;
}) {
  const left = pad;
  const top = pad;
  const right = width - pad;
  const bottom = height - pad;
  const w = right - left;
  const h = bottom - top;
  const [x1, y1, x2, y2] = curve;
  const path = `M ${left},${bottom} C ${left + x1 * w},${bottom - y1 * h} ${left + x2 * w},${bottom - y2 * h} ${right},${top}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-7 w-12 shrink-0 rounded border border-border/60 bg-secondary/50"
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PresetAutocomplete({
  value,
  onValueChange,
  onPick,
  onCommit,
  className,
  inputClassName,
  placeholder = "cubic-bezier(0.23, 1, 0.32, 1) or preset name",
}: {
  value: string;
  onValueChange: (v: string) => void;
  onPick: (curve: BezierDefinition, css: string) => void;
  onCommit?: () => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}) {
  const items = useMemo<Preset[]>(
    () =>
      (Object.entries(NAMED) as Array<[NamedEasing, BezierDefinition]>).map(
        ([name, curve]) => ({
          id: name,
          name,
          curve,
          css: formatCss(curve),
        }),
      ),
    [],
  );

  const shouldRenderPopup = value.trim() !== "";

  return (
    <div className={cn("w-full", className)}>
      <Autocomplete.Root
        items={items}
        value={value}
        onValueChange={onValueChange}
        itemToStringValue={(p) => p.name}
        filter={(p, q) => {
          const query = q.trim().toLowerCase();
          if (!query || query.startsWith("cubic-bezier")) return true;
          return (
            p.name.toLowerCase().includes(query) ||
            p.css.toLowerCase().includes(query)
          );
        }}
      >
        <Autocomplete.Input
          aria-label="CSS easing function or preset"
          placeholder={placeholder}
          className={cn(
            "h-9 w-full rounded-xl border border-border bg-surface px-3",
            "font-mono text-xs text-foreground tabular-nums",
            "placeholder:text-muted-foreground/60",
            "transition-colors duration-150 ease-out",
            "focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring",
            inputClassName,
          )}
          onBlur={onCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommit?.();
          }}
        />

        {shouldRenderPopup && (
          <Autocomplete.Portal>
            <Autocomplete.Positioner
              className="z-50 outline-none"
              sideOffset={6}
              align="start"
            >
              <Autocomplete.Popup
                className={cn(
                  "z-50 w-[var(--anchor-width)] max-h-[18rem] overflow-y-auto overscroll-contain",
                  "rounded-xl border border-border bg-popover/95 p-1 text-popover-foreground shadow-lg backdrop-blur-md",
                  "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 ease-[var(--ease-out)]",
                  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
                  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
                )}
              >
                <Autocomplete.Empty className="px-3 py-2 text-xs text-muted-foreground empty:m-0 empty:p-0">
                  Press Enter to apply custom curve.
                </Autocomplete.Empty>

                <Autocomplete.List>
                  {(p: Preset) => (
                    <Autocomplete.Item
                      key={p.id}
                      value={p}
                      onClick={() => onPick(p.curve, p.css)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs outline-none select-none",
                        "text-foreground data-[highlighted]:bg-accent",
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MiniCurve curve={p.curve} />
                        <span className="truncate font-medium">{p.name}</span>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                        {p.curve.join(", ")}
                      </span>
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        )}
      </Autocomplete.Root>
    </div>
  );
}
