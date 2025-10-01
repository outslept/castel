import { useCallback } from "react"
import { bezier, clamp01, progress, toFixed3, type Bezier } from "$/lib/bezier"

type PointIndex = 0 | 1

type UseBezierDragParams = {
  svgRef: React.RefObject<SVGSVGElement>
  inset: number
  curve: Bezier
  onChange: (c: Bezier) => void
  setActivePoint: (p: PointIndex | null) => void
}

type StartOptions = {
  resetHandle?: boolean
}

export function useBezierDrag({
  svgRef,
  inset,
  curve,
  onChange,
  setActivePoint,
}: UseBezierDragParams) {
  return useCallback(
    (point: PointIndex, opts?: StartOptions) =>
      (startEvent: React.PointerEvent<SVGCircleElement>) => {
        const start: Bezier = [curve[0], curve[1], curve[2], curve[3]] as const
        let moved = false

        startEvent.preventDefault()
        startEvent.stopPropagation()
        setActivePoint(point)
        startEvent.currentTarget.setPointerCapture?.(startEvent.pointerId)

        const root = document.documentElement
        root.dataset.dragging = "true"

        const rect = svgRef.current?.getBoundingClientRect()
        if (!rect) return

        const apply = (x: number, y: number) => {
          const nx = clamp01(toFixed3(x))
          const ny = toFixed3(y)
          const next =
            point === 0
              ? bezier(nx, ny, start[2], start[3])
              : bezier(start[0], start[1], nx, ny)
          onChange(next)
        }

        const move = (e: PointerEvent) => {
          moved = true
          const x = progress(rect.left + inset, rect.right - inset, e.clientX)
          const y = progress(rect.bottom - inset, rect.top + inset, e.clientY)
          apply(x, y)
        }

        const end = () => {
          if (!moved && opts?.resetHandle) {
            onChange(point === 0 ? bezier(0, 0, start[2], start[3]) : bezier(start[0], start[1], 1, 1))
          }
          setActivePoint(null)
          root.removeAttribute("data-dragging")
          document.removeEventListener("pointermove", move)
          document.removeEventListener("pointerup", end)
          document.removeEventListener("pointercancel", end)
        }

        document.addEventListener("pointermove", move)
        document.addEventListener("pointerup", end)
        document.addEventListener("pointercancel", end)
      },
    [curve, inset, onChange, setActivePoint, svgRef]
  )
}