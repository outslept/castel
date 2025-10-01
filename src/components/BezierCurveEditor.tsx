import CoordinatesBadge from "$/components/CoordinatesBadge";
import BezierCanvas from "$/components/BezierCanvas";

export default function BezierCurveEditor() {
  return (
    <div className="relative">
      <CoordinatesBadge />
      <BezierCanvas />
    </div>
  );
}
