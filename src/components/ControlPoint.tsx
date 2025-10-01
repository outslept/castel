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
      <g
        className={`
          transform origin-center
          transition-transform duration-[160ms] ease-out
          ${hovered || active ? "scale-100" : "scale-95"}
        `}
      >
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
            block
            [&_svg]:coarse:hidden
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
            hidden
            [&_svg]:coarse:block
          "
        />

        <circle
          r={hovered || active ? 20 : 0}
          cx={x}
          cy={y}
          className={`
            fill-primary
            ${hovered || active ? "opacity-[0.08]" : "opacity-0"}
            transition-opacity duration-150 ease-out
          `}
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        />

        <circle
          r={r}
          cx={x}
          cy={y}
          className="fill-primary stroke-background"
          strokeWidth={2}
          aria-hidden="true"
          style={{
            transition: "r 160ms var(--ease-out)",
            pointerEvents: "none",
          }}
        />
      </g>
    );
  },
);
ControlPoint.displayName = "ControlPoint";
