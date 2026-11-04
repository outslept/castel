"use client";

export function EditorLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="studio-shell w-full max-w-2xl rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.07)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] space-y-3">
      {left}
      {right}
    </div>
  );
}
