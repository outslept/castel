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
} from "$/lib/bezier";
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
      </div>
    </div>
  );
}
