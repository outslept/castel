"use client";
import { useEffect, useMemo, useRef } from "react";
import { EasingCurve } from "./EasingCurve";
import { ControlPoint } from "$/components/ControlPoint";
import { ResetAnchor } from "$/components/ResetAnchor";
import { useCurve } from "$/contexts/curve";
import { useBezierDrag } from "$/hooks/useBezierDrag";
import { CanvasGrid } from "$/components/CanvasGrid";
import { bezier, clamp01, toFixed3,  } from "$/lib/bezier";
import { BezierDefinition } from "motion";

const VB = { width: 1000, height: 600 };
const INSET = 0.12;
const INSET_VB = Math.round(VB.width * INSET);
const BOUNDS = {
  left: INSET_VB,
  top: INSET_VB,
  right: VB.width - INSET_VB,
  bottom: VB.height - INSET_VB,
  w: VB.width - INSET_VB * 2,
  h: VB.height - INSET_VB * 2,
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

  const pos = useMemo(
    () => ({
      x1: BOUNDS.left + curve[0] * BOUNDS.w,
      y1: BOUNDS.bottom - curve[1] * BOUNDS.h,
      x2: BOUNDS.left + curve[2] * BOUNDS.w,
      y2: BOUNDS.bottom - curve[3] * BOUNDS.h,
    }),
    [curve],
  );

  const startDrag = useBezierDrag({
    svgRef,
    insetRatio: INSET,
    curve,
    onChange: setCurve,
    setActivePoint,
  });

  useEffect(() => {
    const easedEl = easedDotRef.current;
    const linearEl = linearDotRef.current;
    if (!easedEl || !linearEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const easing = `cubic-bezier(${curve[0]}, ${curve[1]}, ${curve[2]}, ${curve[3]})`;
    const frames = [
      { transform: "translateX(0px)" },
      { transform: `translateX(${BOUNDS.w}px)` },
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
  }, [curve]);

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
    const dx = k === "ArrowLeft" ? -step : k === "ArrowRight" ? step : 0;
    const dy = k === "ArrowUp" ? step : k === "ArrowDown" ? -step : 0;
    const next: BezierDefinition =
      index === 0
        ? [clamp01(x1 + dx), toFixed3(y1 + dy), x2, y2]
        : [x1, y1, clamp01(x2 + dx), toFixed3(y2 + dy)];
    setCurve(next);
    setActivePoint(index);
    e.preventDefault();
  };

  const labelY = (y: number) =>
    Math.max(BOUNDS.top + 18, Math.min(BOUNDS.bottom - 10, y - 20));

  const p1Visible = hoveredPoint === 0 || activePoint === 0;
  const p2Visible = hoveredPoint === 1 || activePoint === 1;
  const trackY = BOUNDS.top - 32;

  return (
    <svg
      ref={svgRef}
      className="w-full aspect-5/3 touch-none select-none"
      viewBox={`0 0 ${VB.width} ${VB.height}`}
      role="img"
      aria-label="Cubic Bézier editor"
    >
      <g aria-hidden="true">
        <line
          x1={BOUNDS.left}
          y1={trackY}
          x2={BOUNDS.right}
          y2={trackY}
          stroke="var(--border)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle
          ref={linearDotRef}
          cx={BOUNDS.left}
          cy={trackY}
          r={4.5}
          className="fill-muted-foreground/30 will-change-transform"
        />
        <circle
          ref={easedDotRef}
          cx={BOUNDS.left}
          cy={trackY}
          r={6.5}
          className="fill-primary will-change-transform"
        />
      </g>

      <CanvasGrid
        left={BOUNDS.left}
        top={BOUNDS.top}
        right={BOUNDS.right}
        bottom={BOUNDS.bottom}
      />

      <EasingCurve
        curve={curve}
        left={BOUNDS.left}
        top={BOUNDS.top}
        right={BOUNDS.right}
        bottom={BOUNDS.bottom}
      />

      <line
        className="stroke-muted-foreground/40 transition-[stroke-width] duration-150 ease-out"
        strokeWidth={activePoint === 0 ? 2.25 : 1.75}
        strokeDasharray="5 4"
        strokeLinecap="round"
        x1={BOUNDS.left}
        y1={BOUNDS.bottom}
        x2={pos.x1}
        y2={pos.y1}
      />
      <line
        className="stroke-muted-foreground/40 transition-[stroke-width] duration-150 ease-out"
        strokeWidth={activePoint === 1 ? 2.25 : 1.75}
        strokeDasharray="5 4"
        strokeLinecap="round"
        x1={BOUNDS.right}
        y1={BOUNDS.top}
        x2={pos.x2}
        y2={pos.y2}
      />

      <ResetAnchor
        x={BOUNDS.left}
        y={BOUNDS.bottom}
        active={activePoint === 0}
        onPointerDown={startDrag(0, { resetHandle: true })}
        onReset={() => setCurve(bezier(0, 0, curve[2], curve[3]))}
        label="Reset P1"
      />
      <ResetAnchor
        x={BOUNDS.right}
        y={BOUNDS.top}
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
          aria-label="Control point P2"
          onFocus={() => setActivePoint(1)}
          onBlur={() => setActivePoint(null)}
        />
      </g>

      <text
        x={pos.x1}
        y={labelY(pos.y1)}
        className="fill-primary font-mono text-[13px] font-medium pointer-events-none select-none transform-fill origin-bottom transition-[opacity,transform] duration-150 ease-out"
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
        className="fill-primary font-mono text-[13px] font-medium pointer-events-none select-none transform-fill origin-bottom transition-[opacity,transform] duration-150 ease-out"
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
