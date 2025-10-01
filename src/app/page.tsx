"use client";

import { CurveProvider } from "$/contexts/curve";
import { OptionsEditor } from "$/components/OptionsEditor";
import BezierCurveEditor from "$/components/BezierCurveEditor";

export default function Page() {
  return (
    <CurveProvider>
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <OptionsEditor />
            </div>
            <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
              <BezierCurveEditor />
            </div>
          </div>
        </div>
      </div>
    </CurveProvider>
  );
}
