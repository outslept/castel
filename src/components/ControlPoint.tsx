"use client";

type CircleProps = React.ComponentPropsWithoutRef<"circle">;
type ControlPointProps = Omit<CircleProps, "cx" | "cy" | "r"> & {
  x: number;
  y: number;
  active: boolean;
  hovered: boolean;
};

export function ControlPoint({
  x,
  y,
  active,
  hovered,
  role = "button",
  tabIndex = 0,
  ...rest
}: ControlPointProps) {
  const scale = active ? 1.25 : hovered ? 1.12 : 1;
  const engaged = hovered || active;

  return (
    <g>
      <circle
        r={24}
        cx={x}
        cy={y}
        role={role}
        tabIndex={tabIndex}
        className="
          fill-transparent stroke-transparent stroke-2
          pointer-events-auto
          focus-visible:stroke-ring
          block pointer-coarse:hidden
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
          hidden pointer-coarse:block
          cursor-grab active:cursor-grabbing
        "
      />
      <circle
        r={20}
        cx={x}
        cy={y}
        className="fill-primary pointer-events-none transform-fill origin-center transition-[transform,opacity] duration-160 ease-out"
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
        className="fill-primary stroke-background pointer-events-none transform-fill origin-center transition-transform duration-160 ease-out"
        strokeWidth={2.25}
        aria-hidden="true"
        style={{
          transform: `scale(${scale})`,
        }}
      />
    </g>
  );
}
