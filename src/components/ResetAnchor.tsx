type Props = {
  x: number;
  y: number;
  active: boolean;
  onPointerDown: React.PointerEventHandler<SVGCircleElement>;
  onReset: () => void;
  label: string;
};

export function ResetAnchor({ x, y, active, onPointerDown, onReset, label }: Props) {
  return (
    <g className="transform origin-center will-change-transform">
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
        className="fill-transparent stroke-transparent stroke-2 pointer-events-auto focus-visible:stroke-ring block [@media(pointer:coarse)]:hidden"
      />
      <circle
        r={26}
        cx={x}
        cy={y}
        tabIndex={-1}
        aria-hidden="true"
        className="fill-transparent stroke-transparent stroke-2 pointer-events-auto hidden [@media(pointer:coarse)]:block"
      />
      <circle
        r={active ? 9 : 6}
        cx={x}
        cy={y}
        className="fill-muted-foreground opacity-[0.45]"
        style={{ transition: "r 160ms var(--ease-out, cubic-bezier(0,0,0.58,1))", pointerEvents: "none" }}
        aria-hidden="true"
      />
    </g>
  );
}