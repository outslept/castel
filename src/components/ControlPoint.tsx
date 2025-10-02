"use client";
import { forwardRef } from "react";

type CircleProps = React.ComponentPropsWithoutRef<"circle">;
type ControlPointProps = Omit<CircleProps, "cx" | "cy" | "r"> & {
  x: number;
  y: number;
  active: boolean;
  hovered: boolean;
};

export const ControlPoint = forwardRef<SVGCircleElement, ControlPointProps>(
  (
    {
      x,
      y,
      active,
      hovered,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onKeyDown,
      role = "button",
      tabIndex = 0,
      ...rest
    },
    ref,
  ) => {
    const r = active ? 13 : hovered ? 11.5 : 10;

    return (
      <g>
        <circle
          ref={ref}
          r={24}
          cx={x}
          cy={y}
          role={role}
          tabIndex={tabIndex}
          onPointerDown={onPointerDown}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onKeyDown={onKeyDown}
          className="
            fill-transparent stroke-transparent stroke-2
            pointer-events-auto
            focus-visible:stroke-ring
            block [@media(pointer:coarse)]:hidden
            cursor-grab
          "
          {...rest}
        />
        <circle
          r={32}
          cx={x}
          cy={y}
          tabIndex={-1}
          aria-hidden="true"
          className="
            fill-transparent stroke-transparent stroke-2
            pointer-events-auto
            hidden [@media(pointer:coarse)]:block
            cursor-grab
          "
        />
        <circle
          r={hovered || active ? 20 : 0}
          cx={x}
          cy={y}
          className="
            fill-primary
            transition-opacity duration-150 ease-out
          "
          style={{
            opacity: hovered || active ? 0.08 : 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
        <circle
          r={r}
          cx={x}
          cy={y}
          className="fill-primary stroke-background"
          strokeWidth={2}
          aria-hidden="true"
          style={{
            transition: "r 160ms var(--ease-out, cubic-bezier(0,0,0.58,1))",
            pointerEvents: "none",
          }}
        />
      </g>
    );
  },
);

ControlPoint.displayName = "ControlPoint";
