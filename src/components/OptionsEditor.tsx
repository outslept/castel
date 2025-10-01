"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, RotateCcw, Check } from "lucide-react";
import { Tooltip } from "@base-ui-components/react/tooltip";
import { NAMED, parseCurve, formatCss, formatArray, Bezier } from "$/lib/bezier";
import { useCurve } from "$/contexts/curve";
import { PresetAutocomplete } from "$/components/presets/PresetAutocomplete";

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
      <div className="grid grid-cols-[1fr,auto] items-start gap-2">
        <PresetAutocomplete
          value={text}
          onValueChange={setText}
          onCommit={commitText}
          onPick={(c, cssStr) => {
            handleCurveChange(c);
            setText(cssStr);
          }}
        />

        <Tooltip.Provider delay={300} closeDelay={0}>
          <div className="flex items-center gap-2 pt-7">
            <Tooltip.Root>
              <Tooltip.Trigger
                aria-label="Copy CSS"
                onClick={() => copy(css, "css")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
              >
                {copied === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
                {copied === "array" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
    </div>
  );
}