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

  const curvePath = `M ${left},${bottom} C ${left + x1 * w},${bottom - y1 * h} ${left + x2 * w},${bottom - y2 * h} ${right},${top}`;
  const borderPoints = `${left},${top} ${left},${bottom} ${right},${bottom}`;

  return (
    <g>
      <polyline
        fill="none"
        stroke="var(--muted-foreground)"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={borderPoints}
        className="pointer-events-none"
      />
      <path
        d={curvePath}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.12"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none"
      />
      <path
        d={curvePath}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none"
      />
      <line
        x1={left}
        y1={bottom}
        x2={left + x1 * w}
        y2={bottom - y1 * h}
        stroke="var(--muted-foreground)"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="pointer-events-none"
      />
      <line
        x1={right}
        y1={top}
        x2={left + x2 * w}
        y2={bottom - y2 * h}
        stroke="var(--muted-foreground)"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="pointer-events-none"
      />
      <circle
        cx={left + x1 * w}
        cy={bottom - y1 * h}
        r="4"
        fill="var(--primary)"
        fillOpacity="0.9"
        stroke="var(--background)"
        strokeWidth="2"
        className="pointer-events-none"
      />
      <circle
        cx={left + x2 * w}
        cy={bottom - y2 * h}
        r="4"
        fill="var(--primary)"
        fillOpacity="0.9"
        stroke="var(--background)"
        strokeWidth="2"
        className="pointer-events-none"
      />
    </g>
  );
}
