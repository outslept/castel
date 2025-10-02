"use client";

export function EditorLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(360px,660px),minmax(480px,1fr)]">
      <div className="space-y-6">{left}</div>
      <div className="rounded-xl border border-border/60 bg-card/80 p-0 md:p-4">
        {right}
      </div>
    </div>
  );
}