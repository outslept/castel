"use client";
import { useEffect, useMemo, useState } from "react";
import { parseCurve, formatCss, formatArray } from "$/lib/bezier";
import { useCurve } from "$/contexts/curve";
import { PresetAutocomplete } from "$/components/PresetAutocomplete";
import { ThemeToggle } from "$/components/ThemeToggle";
import { BezierDefinition } from "motion";
import { Copy, Check } from "lucide-react";
import { copyText } from "$/lib/clipboard";
import { cn } from "$/lib/utils";

function BlurIcon({
  copied,
  children,
}: {
  copied: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-[transform,opacity,filter] duration-160 ease-out",
          copied
            ? "scale-90 opacity-0 blur-[2px]"
            : "scale-100 opacity-100 blur-0",
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center text-emerald-500 transition-[transform,opacity,filter] duration-160 ease-out",
          copied
            ? "scale-100 opacity-100 blur-0"
            : "scale-90 opacity-0 blur-[2px]",
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    </span>
  );
}

export function OptionsEditor() {
  const { curve, setCurve } = useCurve();
  const [text, setText] = useState(() => formatCss(curve));
  const [copied, setCopied] = useState<"css" | "array" | null>(null);

  const css = useMemo(() => formatCss(curve), [curve]);

  useEffect(() => {
    setText(formatCss(curve));
  }, [curve]);

  const handleCurveChange = (c: BezierDefinition) => setCurve([...c]);

  const commitText = () => {
    const parsed = parseCurve(text);
    if (parsed) handleCurveChange(parsed);
    else setText(formatCss(curve));
  };

  const copy = async (val: string, kind: "css" | "array") => {
    const ok = await copyText(val);
    if (!ok) return;
    setCopied(kind);
    setTimeout(() => setCopied(null), 1100);
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="min-w-0 flex-1">
        <PresetAutocomplete
          value={text}
          onValueChange={setText}
          onCommit={commitText}
          onPick={(c, cssStr) => {
            handleCurveChange(c);
            setText(cssStr);
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => copy(css, "css")}
        title="Copy CSS cubic-bezier()"
        className="btn-press inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-medium text-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent"
      >
        <BlurIcon copied={copied === "css"}>
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        </BlurIcon>
        <span>CSS</span>
      </button>

      <button
        type="button"
        onClick={() => copy(formatArray(curve), "array")}
        title="Copy [x1, y1, x2, y2] array"
        className="btn-press hidden sm:inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-medium text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
      >
        <BlurIcon copied={copied === "array"}>
          <Copy className="h-3.5 w-3.5" />
        </BlurIcon>
        <span>Array</span>
      </button>

      <ThemeToggle />
    </div>
  );
}
