"use client";
import { CurveProvider } from "$/contexts/curve";
import { OptionsEditor } from "$/components/OptionsEditor";
import BezierCurveEditor from "$/components/BezierCurveEditor";

export default function Page() {
  return (
    <CurveProvider>
      <main className="relative grid min-h-svh place-items-center overflow-hidden bg-background text-foreground px-4">
        <div
          className="w-full max-w-6xl rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-lg transition-[box-shadow,transform] duration-300 p-5 md:p-6"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(320px,1fr),minmax(420px,1.25fr)]">
            <div className="space-y-6">
              <OptionsEditor />
            </div>

            <div className="rounded-xl border border-border/60 bg-card/80 p-4">
              <BezierCurveEditor />
            </div>
          </div>
        </div>
      </main>
    </CurveProvider>
  );
}