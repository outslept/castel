"use client";
import { useEffect, useState } from "react";
import { NAMED, parseCurve, formatCss } from "$/lib/bezier";
import { useCurve } from "$/contexts/curve";
import { PresetAutocomplete } from "$/components/presets/PresetAutocomplete";
import { BezierDefinition } from "motion";

export function OptionsEditor() {
  const { curve, setCurve } = useCurve();
  const [text, setText] = useState(() => formatCss(curve));

  useEffect(() => {
    setText(formatCss(curve));
  }, [curve]);

  const handleCurveChange = (c: BezierDefinition) => setCurve([...c]);

  const commitText = () => {
    const parsed = parseCurve(text);
    if (parsed) handleCurveChange(parsed);
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