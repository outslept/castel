"use client";
import { useMemo, useState } from "react";
import CoordinatesBadge from "$/components/CoordinatesBadge";
import BezierCanvas from "$/components/BezierCanvas";
import { useCurve } from "$/contexts/curve";
import { NAMED, formatCss, formatArray } from "$/lib/bezier";
import { Copy, RotateCcw, Check } from "lucide-react";
import { RotateOverlay } from "$/components/RotateOverlay";
import { copyText } from "$/lib/clipboard";

export default function BezierCurveEditor() {
  const { curve, setCurve } = useCurve();
  const [copied, setCopied] = useState<"css" | "array" | null>(null);
  const css = useMemo(() => formatCss(curve), [curve]);

  const copy = async (s: string, type: "css" | "array") => {
    const ok = await copyText(s);
    if (!ok) return;
    setCopied(type);
    setTimeout(() => setCopied(null), 1200);
  };

  const Toolbar = (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/80 px-1.5 py-1 backdrop-blur-md shadow-sm">
      <button
        type="button"
        title="Copy CSS"
        onClick={() => copy(css, "css")}
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {copied === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="hidden md:inline">CSS</span>
      </button>
      <button
        type="button"
        title="Copy Array"
        onClick={() => copy(formatArray(curve), "array")}
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {copied === "array" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="hidden md:inline">Array</span>
      </button>
      <button
        type="button"
        title="Reset to ease"
        onClick={() => setCurve(NAMED.ease)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="hidden md:inline">Reset</span>
      </button>
    </div>
  );

  return (
    <div className="relative">
      <RotateOverlay />
      <CoordinatesBadge />
      <BezierCanvas />
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute bottom-3 right-3 pointer-events-auto">{Toolbar}</div>
      </div>
    </div>
  );
}