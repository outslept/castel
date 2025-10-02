import { BezierDefinition } from "motion";

export const NAMED = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  "ease-in-quad": [0.55, 0.085, 0.68, 0.53],
  "ease-in-cubic": [0.55, 0.055, 0.675, 0.19],
  "ease-in-quart": [0.895, 0.03, 0.685, 0.22],
  "ease-in-quint": [0.755, 0.05, 0.855, 0.06],
  "ease-in-expo": [0.95, 0.05, 0.795, 0.035],
  "ease-in-circ": [0.6, 0.04, 0.98, 0.335],
  "ease-out-quad": [0.25, 0.46, 0.45, 0.94],
  "ease-out-cubic": [0.215, 0.61, 0.355, 1],
  "ease-out-quart": [0.165, 0.84, 0.44, 1],
  "ease-out-quint": [0.23, 1, 0.32, 1],
  "ease-out-expo": [0.19, 1, 0.22, 1],
  "ease-out-circ": [0.075, 0.82, 0.165, 1],
  "ease-in-out-quad": [0.455, 0.03, 0.515, 0.955],
  "ease-in-out-cubic": [0.645, 0.045, 0.355, 1],
  "ease-in-out-quart": [0.77, 0, 0.175, 1],
  "ease-in-out-quint": [0.86, 0, 0.07, 1],
  "ease-in-out-expo": [1, 0, 0, 1],
  "ease-in-out-circ": [0.785, 0.135, 0.15, 0.86],
} as const;

export type NamedEasing = keyof typeof NAMED;

const NUM_RE = /[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?/gi;

export function parseCurve(input: string): BezierDefinition | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  if (s in NAMED) return NAMED[s as NamedEasing];
  const nums = s.match(NUM_RE);
  if (!nums || nums.length < 4) return null;
  const [x1, y1, x2, y2] = nums.slice(0, 4).map(Number);
  if (![x1, y1, x2, y2].every(Number.isFinite)) return null;
  return bezier(clamp01(x1), y1, clamp01(x2), y2);
}

export function bezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): BezierDefinition {
  return [x1, y1, x2, y2];
}

export function toFixed3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function formatCss(curve: BezierDefinition): string {
  const [x1, y1, x2, y2] = curve;
  return `cubic-bezier(${toFixed3(x1)}, ${toFixed3(y1)}, ${toFixed3(x2)}, ${toFixed3(y2)})`;
}

export function formatArray(curve: BezierDefinition): string {
  const [x1, y1, x2, y2] = curve;
  return `[${toFixed3(x1)}, ${toFixed3(y1)}, ${toFixed3(x2)}, ${toFixed3(y2)}]`;
}

export function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
