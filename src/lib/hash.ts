import { strFromU8, strToU8, zlibSync, unzlibSync } from "fflate";
import { BezierDefinition } from "motion";

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

export function encodeState(state: State, compress = true): string {
  const json = JSON.stringify({ c: state.c });
  if (compress) {
    const zipped = zlibSync(strToU8(json));
    return pxZ + b64FromBytes(zipped);
  }
  return pxU + b64FromBytes(strToU8(json));
}

export function decodeState(hash: string): State | null {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!h) return null;
  const mode = h[0];
  const payload = h.slice(1);
  try {
    if (mode === pxZ) {
      const unzipped = unzlibSync(bytesFromB64(payload));
      const json = strFromU8(unzipped);
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed.c) && parsed.c.length === 4) return { c: parsed.c };
      return null;
    }
    if (mode === pxU) {
      const json = strFromU8(bytesFromB64(payload));
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed.c) && parsed.c.length === 4) return { c: parsed.c };
      return null;
    }
    const json = strFromU8(bytesFromB64(h));
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed.c) && parsed.c.length === 4) return { c: parsed.c };
    return null;
  } catch {
    return null;
  }
}