"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { NAMED, formatCss, type Bezier } from "$/lib/bezier";

type CurveContextValue = {
  curve: Bezier;
  setCurve: (c: Bezier) => void;
  activePoint: 0 | 1 | null;
  setActivePoint: (n: 0 | 1 | null) => void;
  hoveredPoint: 0 | 1 | null;
  setHoveredPoint: (n: 0 | 1 | null) => void;
};

const CurveContext = createContext<CurveContextValue | null>(null);

export function CurveProvider({
  children,
  initial = NAMED.ease,
}: {
  children: React.ReactNode;
  initial?: Bezier;
}) {
  const [curve, setCurve] = useState<Bezier>(initial);
  const [activePoint, setActivePoint] = useState<0 | 1 | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<0 | 1 | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    q.set("c", formatCss(curve));
    const url = `${window.location.pathname}?${q.toString()}`;
    window.history.replaceState({}, "", url);
  }, [curve]);

  const value = useMemo(
    () => ({
      curve,
      setCurve,
      activePoint,
      setActivePoint,
      hoveredPoint,
      setHoveredPoint,
    }),
    [curve, activePoint, hoveredPoint],
  );

  return (
    <CurveContext.Provider value={value}>{children}</CurveContext.Provider>
  );
}

export function useCurve(): CurveContextValue {
  const ctx = useContext(CurveContext);
  if (!ctx) throw new Error("useCurve must be used within CurveProvider");
  return ctx;
}
