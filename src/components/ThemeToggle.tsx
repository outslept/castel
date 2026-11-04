"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "$/lib/utils";

const newLocal = "absolute h-4 w-4 transition-[transform,opacity,filter] duration-180 ease-[var(--ease-out)]";
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 shrink-0 rounded-xl border border-border bg-surface" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn-press relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
    >
      <Sun
        className={cn(
          newLocal,
          isDark
            ? "scale-90 opacity-0 blur-[2px] -rotate-45"
            : "scale-100 opacity-100 blur-0 rotate-0",
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-[transform,opacity,filter] duration-180 ease-out",
          isDark
            ? "scale-100 opacity-100 blur-0 rotate-0"
            : "scale-90 opacity-0 blur-[2px] rotate-45",
        )}
      />
    </button>
  );
}
