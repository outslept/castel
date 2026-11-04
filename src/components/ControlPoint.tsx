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
    const scale = active ? 1.25 : hovered ? 1.12 : 1;
    const engaged = hovered || active;

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
            cursor-grab active:cursor-grabbing
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
            cursor-grab active:cursor-grabbing
          "
        />
        <circle
          r={20}
          cx={x}
          cy={y}
          className="fill-primary pointer-events-none [transform-box:fill-box] origin-center transition-[transform,opacity] duration-160 ease-[var(--ease-out)]"
          style={{
            opacity: engaged ? 0.12 : 0,
            transform: engaged ? "scale(1)" : "scale(0.85)",
          }}
          aria-hidden="true"
        />
        <circle
          r={10}
          cx={x}
          cy={y}
          className="fill-primary stroke-background pointer-events-none [transform-box:fill-box] origin-center transition-transform duration-160 ease-[var(--ease-out)]"
          strokeWidth={2.25}
          aria-hidden="true"
          style={{
            transform: `scale(${scale})`,
          }}
        />
      </g>
    );
  },
);

ControlPoint.displayName = "ControlPoint";
