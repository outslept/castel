"use client";
import { Autocomplete } from "@base-ui-components/react/autocomplete";
import { useMemo } from "react";
import { NAMED, formatCss, type NamedEasing } from "$/lib/bezier";
import { BezierDefinition } from "motion";

type Preset = {
  id: string;
  name: NamedEasing;
  curve: BezierDefinition;
  css: string;
};

function MiniCurve({
  curve,
  width = 88,
  height = 48,
  pad = 6,
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
  const border = `${left},${top} ${left},${bottom} ${right},${bottom}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-11 w-[88px] shrink-0"
      aria-hidden
    >
      <polyline
        points={border}
        fill="none"
        stroke="currentColor"
        opacity="0.35"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        opacity="0.18"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
  label = "Preset or custom curve",
  placeholder = 'e.g. "ease-in-out" or cubic-bezier(0.25, 0.1, 0.25, 1)',
}: {
  value: string;
  onValueChange: (v: string) => void;
  onPick: (curve: BezierDefinition, css: string) => void;
  onCommit?: () => void;
  className?: string;
  inputClassName?: string;
  label?: string;
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
    <div className={["w-full", className ?? ""].join(" ")}>
      <Autocomplete.Root
        items={items}
        value={value}
        onValueChange={onValueChange}
        itemToStringValue={(p) => p.name}
        filter={(p, q) => {
          const query = q.trim().toLowerCase();
          if (!query) return true;
          return (
            p.name.toLowerCase().includes(query) ||
            p.css.toLowerCase().includes(query)
          );
        }}
      >
        <label className="flex w-full flex-col gap-1 text-sm font-medium">
          {label}
          <Autocomplete.Input
            placeholder={placeholder}
            className={[
              "h-10 w-full max-w-[620px] rounded-lg border border-border",
              "bg-background px-3 text-base text-foreground",
              "placeholder:text-muted-foreground/70",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              inputClassName ?? "",
            ].join(" ")}
            onBlur={onCommit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onCommit?.();
            }}
          />
        </label>

        {shouldRenderPopup && (
          <Autocomplete.Portal>
            <Autocomplete.Positioner
              className="outline-none"
              sideOffset={8}
              align="start"
            >
              <Autocomplete.Popup className="z-50 w-[var(--anchor-width)] max-h-[min(var(--available-height),23rem)] max-w-[var(--available-width)] overflow-y-auto scroll-pt-2 scroll-pb-2 overscroll-contain rounded-lg border border-border bg-popover/95 text-popover-foreground shadow-md backdrop-blur-md">
                <Autocomplete.Empty className="px-4 py-2 text-[0.925rem] leading-4 text-muted-foreground empty:m-0 empty:p-0">
                  No matches.
                </Autocomplete.Empty>

                <Autocomplete.List>
                  {(p: Preset) => (
                    <Autocomplete.Item
                      key={p.id}
                      value={p}
                      onClick={() => onPick(p.curve, p.css)}
                      className={[
                        "relative flex cursor-default items-center gap-3 py-2 pr-8 pl-3 text-sm leading-4 outline-none select-none",
                        "text-foreground",
                        "data-[highlighted]:relative data-[highlighted]:z-0",
                        "data-[highlighted]:text-foreground",
                        "data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-md data-[highlighted]:before:bg-accent",
                      ].join(" ")}
                    >
                      <MiniCurve curve={p.curve} />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {p.css}
                        </div>
                      </div>
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
