"use client";

import type { Bezier } from "$/lib/bezier";

export type EasingCurveProps = {
  curve: Bezier;
  width: number;
  height: number;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
};

export function EasingCurve({
  curve,
  width,
  height,
  left = 0,
  top = 0,
  right = width,
  bottom = height,
}: EasingCurveProps) {
  const w = right - left;
  const h = bottom - top;
  const [x1, y1, x2, y2] = curve;
  const d = `M ${left},${bottom} C ${left + x1 * w},${bottom - y1 * h} ${left + x2 * w},${bottom - y2 * h} ${right},${top}`;

  return (
    <g className="pointer-events-none">
      <path
        d={d}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.12"
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
