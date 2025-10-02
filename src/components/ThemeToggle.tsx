"use client";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = theme === "system" ? (systemTheme ?? "light") : theme;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/80 px-1.5 py-1 shadow-sm backdrop-blur-md">
      <button
        type="button"
        aria-label="System"
        onClick={() => setTheme("system")}
        className={[
          "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          theme === "system"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
        ].join(" ")}
        title="System"
      >
        <Laptop className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Light"
        onClick={() => setTheme("light")}
        className={[
          "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          current === "light" && theme !== "system"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
        ].join(" ")}
        title="Light"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Dark"
        onClick={() => setTheme("dark")}
        className={[
          "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          current === "dark" && theme !== "system"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
        ].join(" ")}
        title="Dark"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
