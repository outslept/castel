"use client";

type Props = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export function CanvasGrid({ left, top, right, bottom }: Props) {
  const w = right - left;
  const h = bottom - top;

  const majors = [0, 0.25, 0.5, 0.75, 1];
  const minors = Array.from({ length: 21 }, (_, i) => i / 20);

  return (
    <g aria-hidden="true" shapeRendering="crispEdges">
      <rect
        x={left}
        y={top}
        width={w}
        height={h}
        rx={10}
        fill="var(--secondary)"
        fillOpacity="0.5"
        stroke="var(--border)"
        strokeOpacity="0.7"
      />

      {minors.map((t) => {
        const x = left + t * w;
        const y = top + t * h;
        const isMajor = majors.includes(t);
        if (isMajor) return null;
        return (
          <g key={`m-${t}`}>
            <line
              x1={x}
              y1={top}
              x2={x}
              y2={bottom}
              stroke="var(--muted-foreground)"
              strokeOpacity="0.12"
              strokeWidth={1}
            />
            <line
              x1={left}
              y1={y}
              x2={right}
              y2={y}
              stroke="var(--muted-foreground)"
              strokeOpacity="0.12"
              strokeWidth={1}
            />
          </g>
        );
      })}

      {majors.map((t) => {
        const x = left + t * w;
        const y = top + t * h;
        return (
          <g key={`M-${t}`}>
            <line
              x1={x}
              y1={top}
              x2={x}
              y2={bottom}
              stroke="var(--muted-foreground)"
              strokeOpacity="0.28"
              strokeWidth={1.5}
            />
            <line
              x1={left}
              y1={y}
              x2={right}
              y2={y}
              stroke="var(--muted-foreground)"
              strokeOpacity="0.28"
              strokeWidth={1.5}
            />
          </g>
        );
      })}

      <line
        x1={left}
        y1={bottom}
        x2={right}
        y2={bottom}
        stroke="var(--foreground)"
        strokeOpacity="0.3"
        strokeWidth={1.75}
      />
      <line
        x1={left}
        y1={top}
        x2={left}
        y2={bottom}
        stroke="var(--foreground)"
        strokeOpacity="0.3"
        strokeWidth={1.75}
      />

      {majors.map((t) => {
        const x = left + t * w;
        const y = bottom - t * h;
        return (
          <g key={`labels-${t}`} fontSize={11} fill="var(--muted-foreground)">
            <text x={x} y={bottom + 16} textAnchor="middle">
              {t.toFixed(2)}
            </text>
            <text x={left - 10} y={y + 4} textAnchor="end">
              {t.toFixed(2)}
            </text>
          </g>
        );
      })}

      <text
        x={left + w / 2}
        y={bottom + 34}
        textAnchor="middle"
        fontSize={12}
        fill="var(--muted-foreground)"
      >
        time (x)
      </text>
      <text
        x={left - 32}
        y={top + h / 2}
        textAnchor="middle"
        fontSize={12}
        fill="var(--muted-foreground)"
        transform={`rotate(-90 ${left - 32} ${top + h / 2})`}
      >
        progress (y)
      </text>
    </g>
  );
}
