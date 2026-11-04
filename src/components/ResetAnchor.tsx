type Props = {
  x: number;
  y: number;
  active: boolean;
  onPointerDown: React.PointerEventHandler<SVGCircleElement>;
  onReset: () => void;
  label: string;
};

export function ResetAnchor({
  x,
  y,
  active,
  onPointerDown,
  onReset,
  label,
}: Props) {
  return (
    <g>
      <title>{label}</title>
      <circle
        r={18}
        cx={x}
        cy={y}
        tabIndex={0}
        role="button"
        aria-label={label}
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onReset();
          }
        }}
        className="fill-transparent stroke-transparent stroke-2 pointer-events-auto focus-visible:stroke-ring block pointer-coarse:hidden cursor-pointer"
      />
      <circle
        r={26}
        cx={x}
        cy={y}
        tabIndex={-1}
        aria-hidden="true"
        className="fill-transparent stroke-transparent stroke-2 pointer-events-auto hidden pointer-coarse:block"
      />
      <circle
        r={6}
        cx={x}
        cy={y}
        className="fill-muted-foreground pointer-events-none transform-fill origin-center transition-[transform,opacity] duration-160 ease-out"
        style={{
          opacity: active ? 0.75 : 0.45,
          transform: active ? "scale(1.45)" : "scale(1)",
        }}
        aria-hidden="true"
      />
    </g>
  );
}
