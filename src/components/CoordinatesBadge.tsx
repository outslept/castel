import { useCurve } from "$/contexts/curve"

export default function CoordinatesBadge() {
  const { curve, activePoint, hoveredPoint } = useCurve()
  const [x1, y1, x2, y2] = curve
  const p1 = activePoint === 0 || hoveredPoint === 0
  const p2 = activePoint === 1 || hoveredPoint === 1

  return (
    <div className="absolute right-2 top-2 z-10 flex gap-3 rounded-lg border border-border/50 bg-card/95 px-3 py-1.5 font-mono text-xs shadow-sm backdrop-blur-sm">
      <span className={`transition-colors ${p1 ? "text-primary font-medium" : "text-muted-foreground"}`}>
        P1: ({x1.toFixed(3)}, {y1.toFixed(3)})
      </span>
      <span className={`transition-colors ${p2 ? "text-primary font-medium" : "text-muted-foreground"}`}>
        P2: ({x2.toFixed(3)}, {y2.toFixed(3)})
      </span>
    </div>
  )
}