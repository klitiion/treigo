'use client'

import { useState, useEffect } from 'react'

interface UseCountUpOptions {
  end: number
  duration?: number
  decimals?: number
}

export function useCountUp({ end, duration = 2000, decimals = 0 }: UseCountUpOptions) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const current = Math.floor(end * progress)
      setCount(current)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, decimals])

  return count
}
