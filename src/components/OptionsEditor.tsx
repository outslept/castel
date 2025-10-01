"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, RotateCcw, Check } from "lucide-react";
import { Tooltip } from "@base-ui-components/react/tooltip";
import {
  NAMED,
  parseCurve,
  formatCss,
  formatArray,
  Bezier,
  NamedEasing,
} from "$/lib/bezier";
import { useCurve } from "$/contexts/curve";

export function OptionsEditor() {
  const { curve, setCurve } = useCurve();
  const [text, setText] = useState(() => formatCss(curve));
  const [copied, setCopied] = useState<"css" | "array" | null>(null);

  const css = useMemo(() => formatCss(curve), [curve]);

  useEffect(() => {
    setText(formatCss(curve));
  }, [curve]);

  const handleCurveChange = (c: Bezier) => setCurve([...c]);

  const commitText = () => {
    const parsed = parseCurve(text);
    if (parsed) handleCurveChange(parsed);
  };

  const copy = async (s: string, type: "css" | "array") => {
    await navigator.clipboard.writeText(s);
    setCopied(type);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(NAMED) as Array<NamedEasing>).map((k) => (
          <button
            key={k}
            onClick={() => handleCurveChange(NAMED[k])}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm transition-all hover:bg-accent active:scale-95"
          >
            {k}
          </button>
        ))}
      </div>

      <textarea
        className="
          min-h-[80px] w-full resize-none rounded-lg 
          border border-border 
          bg-background text-foreground 
          px-3 py-2 font-mono text-sm 
          transition-all 
          placeholder:text-muted-foreground/60 
          focus:outline-none focus:ring-2 focus:ring-ring
        "
        placeholder="cubic-bezier(...) or [...]"
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commitText}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commitText();
        }}
      />

      <Tooltip.Provider delay={300} closeDelay={0}>
        <div className="flex items-center gap-2">
          <Tooltip.Root>
            <Tooltip.Trigger
              aria-label="Copy CSS"
              onClick={() => copy(css, "css")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
            >
              {copied === "css" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner sideOffset={8}>
                <Tooltip.Popup className="z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                  Copy CSS
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger
              aria-label="Copy Array"
              onClick={() => copy(formatArray(curve), "array")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              {copied === "array" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner sideOffset={8}>
                <Tooltip.Popup className="z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                  Copy Array
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger
              aria-label="Reset to ease"
              onClick={() => handleCurveChange(NAMED.ease)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner sideOffset={8}>
                <Tooltip.Popup className="z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                  Reset to ease
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </Tooltip.Provider>
    </div>
  );
}
