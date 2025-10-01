import { useEffect, useLayoutEffect } from "react"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export function observeResize(el: Element, cb: () => void): () => void {
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => cb())
    ro.observe(el)
    cb()
    return () => ro.disconnect()
  }

  const win = el.ownerDocument?.defaultView
  const handler = () => cb()
  win?.addEventListener("resize", handler, { passive: true })
  cb()
  return () => {
    win?.removeEventListener("resize", handler)
  }
}