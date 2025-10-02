"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { NAMED } from "$/lib/bezier";
import { encodeState, decodeState } from "$/lib/hash";
import { BezierDefinition } from "motion";

type CurveContextValue = {
  curve: BezierDefinition;
  setCurve: (c: BezierDefinition) => void;
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
  initial?: BezierDefinition;
}) {
  const [curve, setCurve] = useState<BezierDefinition>(initial);
  const [activePoint, setActivePoint] = useState<0 | 1 | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<0 | 1 | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const decoded = decodeState(window.location.hash);
    if (decoded) setCurve(decoded.c);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      const payload = encodeState({ c: curve }, true);
      const url = `${window.location.pathname}${window.location.search}#${payload}`;
      window.history.replaceState(null, "", url);
    }, 120);
    return () => window.clearTimeout(id);
  }, [curve]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => {
      const decoded = decodeState(window.location.hash);
      if (decoded) setCurve(decoded.c);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

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

  return <CurveContext.Provider value={value}>{children}</CurveContext.Provider>;
}

export function useCurve(): CurveContextValue {
  const ctx = useContext(CurveContext);
  if (!ctx) throw new Error("useCurve must be used within CurveProvider");
  return ctx;
}