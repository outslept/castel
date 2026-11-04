import { useCallback } from "react";
import { bezier, clamp01, toFixed3 } from "$/lib/bezier";
import { BezierDefinition } from "motion";

type PointIndex = 0 | 1;

type UseBezierDragParams = {
  svgRef: React.RefObject<SVGSVGElement>;
  insetRatio: number;
  curve: BezierDefinition;
  onChange: (c: BezierDefinition) => void;
  setActivePoint: (p: PointIndex | null) => void;
};

type StartOptions = {
  resetHandle?: boolean;
};

export function useBezierDrag({
  svgRef,
  insetRatio,
  curve,
  onChange,
  setActivePoint,
}: UseBezierDragParams) {
  return useCallback(
    (point: PointIndex, opts?: StartOptions) =>
      (startEvent: React.PointerEvent<SVGCircleElement>) => {
        const root = document.documentElement;
        if (root.dataset.dragging === "true") return;

        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const activePointerId = startEvent.pointerId;
        const start: BezierDefinition = [...curve];
        let moved = false;
        startEvent.preventDefault();
        startEvent.stopPropagation();
        setActivePoint(point);
        startEvent.currentTarget.setPointerCapture?.(activePointerId);
        root.dataset.dragging = "true";

        const inset = Math.round(rect.width * insetRatio);
        const minX = rect.left + inset;
        const maxX = rect.right - inset;
        const minY = rect.top + inset;
        const maxY = rect.bottom - inset;
        const nx = (x: number) => (x - minX) / (maxX - minX);
        const ny = (y: number) => (maxY - y) / (maxY - minY);
        const curX = point === 0 ? start[0] : start[2];
        const curY = point === 0 ? start[1] : start[3];
        const offX = nx(startEvent.clientX) - curX;
        const offY = ny(startEvent.clientY) - curY;

        const move = (e: PointerEvent) => {
          if (e.pointerId !== activePointerId) return;
          moved = true;
          const nextX = clamp01(toFixed3(nx(e.clientX) - offX));
          const nextY = toFixed3(ny(e.clientY) - offY);
          onChange(
            point === 0
              ? bezier(nextX, nextY, start[2], start[3])
              : bezier(start[0], start[1], nextX, nextY),
          );
        };

        const end = (e: PointerEvent) => {
          if (e.pointerId !== activePointerId) return;
          if (!moved && opts?.resetHandle) {
            onChange(
              point === 0
                ? bezier(0, 0, start[2], start[3])
                : bezier(start[0], start[1], 1, 1),
            );
          }
          setActivePoint(null);
          root.removeAttribute("data-dragging");
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", end);
          document.removeEventListener("pointercancel", end);
        };

        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", end);
        document.addEventListener("pointercancel", end);
      },
    [curve, insetRatio, onChange, setActivePoint, svgRef],
  );
}
