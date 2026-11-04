import { strFromU8, strToU8, zlibSync, unzlibSync } from "fflate";
import { type BezierDefinition } from "motion";

type State = { c: BezierDefinition };

const pxZ = "z";
const pxU = "u";

const b64FromBytes = (bytes: Uint8Array) => {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
};

const bytesFromB64 = (b64: string) => {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

export function encodeState(state: State): string {
  const zipped = zlibSync(strToU8(JSON.stringify({ c: state.c })));
  return pxZ + b64FromBytes(zipped);
}

export function decodeState(hash: string): State | null {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!h) return null;
  try {
    const raw =
      h[0] === pxZ
        ? unzlibSync(bytesFromB64(h.slice(1)))
        : bytesFromB64(h[0] === pxU ? h.slice(1) : h);
    const parsed = JSON.parse(strFromU8(raw));
    return Array.isArray(parsed.c) && parsed.c.length === 4
      ? { c: parsed.c }
      : null;
  } catch {
    return null;
  }
}
