import { useState, RefObject } from "react"
import { observeResize, useIsomorphicLayoutEffect } from "$/hooks/useIsomorphicLayoutEffect"

export interface SvgSize {
  width: number
  height: number
}

export function useSvgSize(ref: RefObject<SVGSVGElement>): SvgSize {
  const [size, setSize] = useState<SvgSize>({ width: 0, height: 0 })

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight })
    }

    update()
    return observeResize(el, update)
  }, [ref])

  return size
}