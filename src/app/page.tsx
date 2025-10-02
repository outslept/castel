import { NAMED, parseCurve, type Bezier } from "$/lib/bezier";
import { CurveProvider } from "$/contexts/curve";
import { EditorLayout } from "$/components/EditorLayout";
import { OptionsEditor } from "$/components/OptionsEditor";
import BezierCurveEditor from "$/components/BezierCurveEditor";

export default function Page({
  searchParams,
}: {
  searchParams?: { c?: string; curve?: string };
}) {
  const raw = searchParams?.c ?? searchParams?.curve;
  const initial: Bezier = raw ? (parseCurve(raw) ?? NAMED.ease) : NAMED.ease;

  return (
    <CurveProvider initial={initial}>
      <main className="relative grid min-h-svh place-items-center overflow-hidden bg-background text-foreground px-4">
        <div className="w-full max-w-6xl rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-lg transition-[box-shadow,transform] duration-300 p-5 md:p-6">
          <EditorLayout left={<OptionsEditor />} right={<BezierCurveEditor />} />
        </div>
      </main>
    </CurveProvider>
  );
}