import { useMemo, useRef } from "react"
import { EasingCurve } from "./EasingCurve"
import { ControlPoint } from "$/components/ControlPoint"
import { ResetAnchor } from "$/components/ResetAnchor"
import { useCurve } from "$/contexts/curve"
import { useSvgSize } from "$/hooks/useSvgSize"
import { useBezierDrag } from "$/hooks/useBezierDrag"

type Size = { width: number; height: number }
type Bounds = {
  left: number
  right: number
  top: number
  bottom: number
  w: number
  h: number
}
type Positions = { x1: number; y1: number; x2: number; y2: number }

const boundsFrom = (size: Size, inset: number): Bounds => {
  const left = inset
  const top = inset
  const right = size.width - inset
  const bottom = size.height - inset
  return { left, top, right, bottom, w: Math.max(0, right - left), h: Math.max(0, bottom - top) }
}

const positionsFrom = (bounds: Bounds, curve: readonly [number, number, number, number]): Positions => {
  const [x1, y1, x2, y2] = curve
  return {
    x1: bounds.left + x1 * bounds.w,
    y1: bounds.bottom - y1 * bounds.h,
    x2: bounds.left + x2 * bounds.w,
    y2: bounds.bottom - y2 * bounds.h,
  }
}

export default function BezierCanvas() {
  const { curve, setCurve, activePoint, setActivePoint, hoveredPoint, setHoveredPoint } = useCurve()

  const svgRef = useRef<SVGSVGElement>(null!)
  const p1Ref = useRef<SVGCircleElement>(null!)
  const p2Ref = useRef<SVGCircleElement>(null!)

  const size = useSvgSize(svgRef)
  const inset = (12 / 100) * size.width

  const bounds = useMemo(() => boundsFrom(size, inset), [size, inset])
  const pos = useMemo(() => positionsFrom(bounds, curve), [bounds, curve])

  const startDrag = useBezierDrag({ svgRef, inset, curve, onChange: setCurve, setActivePoint })

  const round3 = (n: number) => Math.round(n * 1000) / 1000
  const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

  const onPointKeyDown = (index: 0 | 1) => (e: React.KeyboardEvent) => {
    const k = e.key
    if (k !== "ArrowLeft" && k !== "ArrowRight" && k !== "ArrowUp" && k !== "ArrowDown") return
    const step = e.shiftKey ? 0.05 : e.altKey || e.metaKey || e.ctrlKey ? 0.005 : 0.01
    const [x1, y1, x2, y2] = curve
    const next: [number, number, number, number] =
      index === 0
        ? [
            clamp01(k === "ArrowLeft" ? x1 - step : k === "ArrowRight" ? x1 + step : x1),
            round3(k === "ArrowUp" ? y1 + step : k === "ArrowDown" ? y1 - step : y1),
            x2,
            y2,
          ]
        : [
            x1,
            y1,
            clamp01(k === "ArrowLeft" ? x2 - step : k === "ArrowRight" ? x2 + step : x2),
            round3(k === "ArrowUp" ? y2 + step : k === "ArrowDown" ? y2 - step : y2),
          ]
    setCurve(next)
    setActivePoint(index)
    e.preventDefault()
  }

  return (
    <svg
      ref={svgRef}
      className="h-[420px] w-full touch-none select-none"
      viewBox={`0 0 ${size.width} ${size.height}`}
      role="img"
      aria-label="Cubic Bézier editor"
    >
      <EasingCurve
        curve={curve}
        width={size.width}
        height={size.height}
        left={bounds.left}
        top={bounds.top}
        right={bounds.right}
        bottom={bounds.bottom}
      />

      <line
        className="stroke-muted-foreground/30 transition-[stroke-width] duration-150"
        strokeWidth={activePoint === 0 ? 2.5 : 2}
        strokeDasharray="6 3"
        strokeLinecap="round"
        x1={bounds.left}
        y1={bounds.bottom}
        x2={pos.x1}
        y2={pos.y1}
      />
      <line
        className="stroke-muted-foreground/30 transition-[stroke-width] duration-150"
        strokeWidth={activePoint === 1 ? 2.5 : 2}
        strokeDasharray="6 3"
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
        label="Reset P1"
      />
      <ResetAnchor
        x={bounds.right}
        y={bounds.top}
        active={activePoint === 1}
        onPointerDown={startDrag(1, { resetHandle: true })}
        label="Reset P2"
      />

      <g>
        <ControlPoint
          ref={p1Ref}
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
          ref={p2Ref}
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

      <text
        x={pos.x1}
        y={pos.y1 - 20}
        className="fill-primary text-xs font-medium pointer-events-none select-none"
        textAnchor="middle"
        style={{
          opacity: hoveredPoint === 0 || activePoint === 0 ? 1 : 0,
          transform: hoveredPoint === 0 || activePoint === 0 ? "scale(1)" : "scale(0.93)",
          transformOrigin: "center",
          transition: "opacity 160ms var(--ease-out), transform 160ms var(--ease-out)",
          willChange: "transform, opacity",
        }}
      >
        P1
      </text>
      <text
        x={pos.x2}
        y={pos.y2 - 20}
        className="fill-primary text-xs font-medium pointer-events-none select-none"
        textAnchor="middle"
        style={{
          opacity: hoveredPoint === 1 || activePoint === 1 ? 1 : 0,
          transform: hoveredPoint === 1 || activePoint === 1 ? "scale(1)" : "scale(0.93)",
          transformOrigin: "center",
          transition: "opacity 160ms var(--ease-out), transform 160ms var(--ease-out)",
          willChange: "transform, opacity",
        }}
      >
        P2
      </text>
    </svg>
  )
}