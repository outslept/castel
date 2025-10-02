import { useCallback } from "react";
import { bezier, clamp01, toFixed3 } from "$/lib/bezier";
import { BezierDefinition } from "motion";

type PointIndex = 0 | 1;

type UseBezierDragParams = {
  svgRef: React.RefObject<SVGSVGElement>;
  inset: number;
  curve: BezierDefinition;
  onChange: (c: BezierDefinition) => void;
  setActivePoint: (p: PointIndex | null) => void;
};

type StartOptions = {
  resetHandle?: boolean;
};

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
        const start: BezierDefinition = [
          curve[0],
          curve[1],
          curve[2],
          curve[3],
        ];
        let moved = false;
        startEvent.preventDefault();
        startEvent.stopPropagation();
        setActivePoint(point);
        startEvent.currentTarget.setPointerCapture?.(startEvent.pointerId);
        const root = document.documentElement;
        root.dataset.dragging = "true";
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const minX = rect.left + inset;
        const maxX = rect.right - inset;
        const minY = rect.top + inset;
        const maxY = rect.bottom - inset;
        const nx = (x: number) => (x - minX) / (maxX - minX);
        const ny = (y: number) => (maxY - y) / (maxY - minY);
        const startNX = nx(startEvent.clientX);
        const startNY = ny(startEvent.clientY);
        const curX = point === 0 ? start[0] : start[2];
        const curY = point === 0 ? start[1] : start[3];
        const offX = startNX - curX;
        const offY = startNY - curY;
        const apply = (x: number, y: number) => {
          const nextX = clamp01(toFixed3(x - offX));
          const nextY = toFixed3(y - offY);
          onChange(
            point === 0
              ? bezier(nextX, nextY, start[2], start[3])
              : bezier(start[0], start[1], nextX, nextY),
          );
        };
        const move = (e: PointerEvent) => {
          moved = true;
          apply(nx(e.clientX), ny(e.clientY));
        };
        const end = () => {
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
    [curve, inset, onChange, setActivePoint, svgRef],
  );
}
