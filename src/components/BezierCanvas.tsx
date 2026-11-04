"use client";
import { useEffect, useMemo, useRef } from "react";
import { EasingCurve } from "./EasingCurve";
import { ControlPoint } from "$/components/ControlPoint";
import { ResetAnchor } from "$/components/ResetAnchor";
import { useCurve } from "$/contexts/curve";
import { useBezierDrag } from "$/hooks/useBezierDrag";
import { CanvasGrid } from "$/components/CanvasGrid";
import { useSvgSize } from "$/hooks/useSvgSize";
import { bezier, clamp01 } from "$/lib/bezier";

type Size = { width: number; height: number };
type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  w: number;
  h: number;
};

const VB: Size = { width: 1000, height: 600 };
const INSET = 0.12;

const boundsFrom = (size: Size, inset: number): Bounds => {
  const left = inset;
  const top = inset;
  const right = size.width - inset;
  const bottom = size.height - inset;
  return {
    left,
    top,
    right,
    bottom,
    w: Math.max(0, right - left),
    h: Math.max(0, bottom - top),
  };
};

const positionsFrom = (
  bounds: Bounds,
  curve: readonly [number, number, number, number],
) => {
  const [x1, y1, x2, y2] = curve;
  return {
    x1: bounds.left + x1 * bounds.w,
    y1: bounds.bottom - y1 * bounds.h,
    x2: bounds.left + x2 * bounds.w,
    y2: bounds.bottom - y2 * bounds.h,
  };
};

export default function BezierCanvas() {
  const {
    curve,
    setCurve,
    activePoint,
    setActivePoint,
    hoveredPoint,
    setHoveredPoint,
  } = useCurve();
  const svgRef = useRef<SVGSVGElement>(null!);
  const easedDotRef = useRef<SVGCircleElement>(null);
  const linearDotRef = useRef<SVGCircleElement>(null);

  const size = useSvgSize(svgRef);
  const insetPx = Math.round(size.width * INSET);
  const bounds = useMemo(
    () => boundsFrom(VB, Math.round(VB.width * INSET)),
    [],
  );
  const pos = useMemo(() => positionsFrom(bounds, curve), [bounds, curve]);
  const startDrag = useBezierDrag({
    svgRef,
    inset: insetPx,
    curve,
    onChange: setCurve,
    setActivePoint,
  });
  const round3 = (n: number) => Math.round(n * 1000) / 1000;

  // Synchronized live motion runner aligned with the graph's X-axis
  useEffect(() => {
    const easedEl = easedDotRef.current;
    const linearEl = linearDotRef.current;
    if (!easedEl || !linearEl) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const easing = `cubic-bezier(${curve[0]}, ${curve[1]}, ${curve[2]}, ${curve[3]})`;
    const frames = [
      { transform: "translateX(0px)" },
      { transform: `translateX(${bounds.w}px)` },
    ];

    const trigger = () => {
      easedEl.getAnimations().forEach((a) => a.cancel());
      linearEl.getAnimations().forEach((a) => a.cancel());
      easedEl.animate(frames, { duration: 650, easing, fill: "forwards" });
      linearEl.animate(frames, {
        duration: 650,
        easing: "linear",
        fill: "forwards",
      });
    };

    trigger();
    const id = window.setInterval(trigger, 1350);
    return () => window.clearInterval(id);
  }, [curve, bounds.w]);

  const onPointKeyDown = (index: 0 | 1) => (e: React.KeyboardEvent) => {
    const k = e.key;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(k))
      return;
    const step = e.shiftKey
      ? 0.05
      : e.altKey || e.metaKey || e.ctrlKey
        ? 0.005
        : 0.01;
    const [x1, y1, x2, y2] = curve;
    const next: [number, number, number, number] =
      index === 0
        ? [
            clamp01(
              k === "ArrowLeft"
                ? x1 - step
                : k === "ArrowRight"
                  ? x1 + step
                  : x1,
            ),
            round3(
              k === "ArrowUp" ? y1 + step : k === "ArrowDown" ? y1 - step : y1,
            ),
            x2,
            y2,
          ]
        : [
            x1,
            y1,
            clamp01(
              k === "ArrowLeft"
                ? x2 - step
                : k === "ArrowRight"
                  ? x2 + step
                  : x2,
            ),
            round3(
              k === "ArrowUp" ? y2 + step : k === "ArrowDown" ? y2 - step : y2,
            ),
          ];
    setCurve(next);
    setActivePoint(index);
    e.preventDefault();
  };

  const labelY = (y: number) => {
    const above = y - 20;
    const minY = bounds.top + 18;
    const maxY = bounds.bottom - 10;
    return Math.max(minY, Math.min(maxY, above));
  };

  const p1Visible = hoveredPoint === 0 || activePoint === 0;
  const p2Visible = hoveredPoint === 1 || activePoint === 1;
  const trackY = bounds.top - 32;

  return (
    <svg
      ref={svgRef}
      className="w-full aspect-[5/3] touch-none select-none"
      viewBox={`0 0 ${VB.width} ${VB.height}`}
      role="img"
      aria-label="Cubic Bézier editor"
    >
      {/* Integrated Live Motion Track aligned with bounds.left -> bounds.right */}
      <g aria-hidden="true">
        <line
          x1={bounds.left}
          y1={trackY}
          x2={bounds.right}
          y2={trackY}
          stroke="var(--border)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle
          ref={linearDotRef}
          cx={bounds.left}
          cy={trackY}
          r={4.5}
          className="fill-muted-foreground/30 will-change-transform"
        />
        <circle
          ref={easedDotRef}
          cx={bounds.left}
          cy={trackY}
          r={6.5}
          className="fill-primary will-change-transform"
        />
      </g>

      <CanvasGrid
        left={bounds.left}
        top={bounds.top}
        right={bounds.right}
        bottom={bounds.bottom}
      />

      <EasingCurve
        curve={curve}
        width={VB.width}
        height={VB.height}
        left={bounds.left}
        top={bounds.top}
        right={bounds.right}
        bottom={bounds.bottom}
      />

      <line
        className="stroke-muted-foreground/40 transition-[stroke-width] duration-150 ease-out"
        strokeWidth={activePoint === 0 ? 2.25 : 1.75}
        strokeDasharray="5 4"
        strokeLinecap="round"
        x1={bounds.left}
        y1={bounds.bottom}
        x2={pos.x1}
        y2={pos.y1}
      />
      <line
        className="stroke-muted-foreground/40 transition-[stroke-width] duration-150 ease-out"
        strokeWidth={activePoint === 1 ? 2.25 : 1.75}
        strokeDasharray="5 4"
        strokeLinecap="round"
        x1={bounds.right}
        y1={bounds.top}
        x2={pos.x2}
        y2={pos.y2}
      />

      <ResetAnchor
        x={bounds.left}
        y={bounds.bottom}
        active={activePoint === 0}
        onPointerDown={startDrag(0, { resetHandle: true })}
        onReset={() => setCurve(bezier(0, 0, curve[2], curve[3]))}
        label="Reset P1"
      />
      <ResetAnchor
        x={bounds.right}
        y={bounds.top}
        active={activePoint === 1}
        onPointerDown={startDrag(1, { resetHandle: true })}
        onReset={() => setCurve(bezier(curve[0], curve[1], 1, 1))}
        label="Reset P2"
      />

      <g>
        <ControlPoint
          x={pos.x1}
          y={pos.y1}
          active={activePoint === 0}
          hovered={hoveredPoint === 0}
          onPointerDown={startDrag(0)}
          onPointerEnter={() => setHoveredPoint(0)}
          onPointerLeave={() => setHoveredPoint(null)}
          onKeyDown={onPointKeyDown(0)}
          tabIndex={0}
          aria-label="Control point P1"
          onFocus={() => setActivePoint(0)}
          onBlur={() => setActivePoint(null)}
        />
        <ControlPoint
          x={pos.x2}
          y={pos.y2}
          active={activePoint === 1}
          hovered={hoveredPoint === 1}
          onPointerDown={startDrag(1)}
          onPointerEnter={() => setHoveredPoint(1)}
          onPointerLeave={() => setHoveredPoint(null)}
          onKeyDown={onPointKeyDown(1)}
          tabIndex={0}
          aria-label="Control point P2"
          onFocus={() => setActivePoint(1)}
          onBlur={() => setActivePoint(null)}
        />
      </g>

      {/* Contextual in-place coordinates on hover/drag */}
      <text
        x={pos.x1}
        y={labelY(pos.y1)}
        className="fill-primary font-mono text-[13px] font-medium pointer-events-none select-none [transform-box:fill-box] origin-bottom transition-[opacity,transform] duration-150 ease-[var(--ease-out)]"
        textAnchor="middle"
        style={{
          opacity: p1Visible ? 1 : 0,
          transform: p1Visible ? "scale(1)" : "scale(0.94)",
        }}
      >
        P1 · {curve[0].toFixed(2)}, {curve[1].toFixed(2)}
      </text>
      <text
        x={pos.x2}
        y={labelY(pos.y2)}
        className="fill-primary font-mono text-[13px] font-medium pointer-events-none select-none [transform-box:fill-box] origin-bottom transition-[opacity,transform] duration-150 ease-[var(--ease-out)]"
        textAnchor="middle"
        style={{
          opacity: p2Visible ? 1 : 0,
          transform: p2Visible ? "scale(1)" : "scale(0.94)",
        }}
      >
        P2 · {curve[2].toFixed(2)}, {curve[3].toFixed(2)}
      </text>
    </svg>
  );
}
