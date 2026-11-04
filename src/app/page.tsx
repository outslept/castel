import { NAMED, parseCurve } from "$/lib/bezier";
import { CurveProvider } from "$/contexts/curve";
import { EditorLayout } from "$/components/EditorLayout";
import { OptionsEditor } from "$/components/OptionsEditor";
import BezierCurveEditor from "$/components/BezierCurveEditor";
import { BezierDefinition } from "motion";

export default function Page({
  searchParams,
}: {
  searchParams?: { c?: string; curve?: string };
}) {
  const raw = searchParams?.c ?? searchParams?.curve;
  const initial: BezierDefinition = raw
    ? (parseCurve(raw) ?? NAMED["ease-out-quint"])
    : NAMED["ease-out-quint"];

  return (
    <CurveProvider initial={initial}>
      <main className="grid min-h-svh place-items-center bg-background text-foreground px-4 py-6">
        <EditorLayout
          left={<OptionsEditor />}
          right={<BezierCurveEditor />}
        />
      </main>
    </CurveProvider>
  );
}
