"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

export function RotateOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mqSmall = window.matchMedia("(max-width: 767.98px)");
    const mqPortrait = window.matchMedia("(orientation: portrait)");
    const update = () => setShow(mqSmall.matches && mqPortrait.matches);
    update();

    const onChange = () => update();

    if (mqSmall.addEventListener) {
      mqSmall.addEventListener("change", onChange);
      mqPortrait.addEventListener("change", onChange);
      return () => {
        mqSmall.removeEventListener("change", onChange);
        mqPortrait.removeEventListener("change", onChange);
      };
    } else {
      mqSmall.addListener(onChange);
      mqPortrait.addListener(onChange);
      return () => {
        mqSmall.removeListener(onChange);
        mqPortrait.removeListener(onChange);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
      <div className="w-[90%] max-w-[22rem] rounded-xl border border-border bg-card/95 p-5 text-center shadow-lg">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Smartphone className="h-6 w-6 text-foreground" />
        </div>
        <div className="text-base font-medium">Rotate your device</div>
        <div className="mt-1 text-sm text-muted-foreground">
          This tool is not optimized for small portrait screens. For the best experience, use landscape orientation.
        </div>
      </div>
    </div>
  );
}