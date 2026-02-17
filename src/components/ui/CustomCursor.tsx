'use client'

import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseDown = () => {
      setIsPressed(true)
    }

    const handleMouseUp = () => {
      setIsPressed(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        a, button {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor circle */}
      {isVisible && (
        <div
          className="fixed pointer-events-none z-[9999] mix-blend-multiply transition-transform"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `translate(-50%, -50%) scale(${isPressed ? 0.6 : 1})`,
          }}
        >
          {/* Outer circle */}
          <div
            className="absolute w-6 h-6 border-2 border-treigo-forest rounded-full transition-all"
            style={{
              left: '-12px',
              top: '-12px',
              opacity: 0.6,
              transform: isPressed ? 'scale(0.7)' : 'scale(1)',
            }}
          />
          
          {/* Inner circle */}
          <div
            className="absolute w-3 h-3 bg-treigo-forest rounded-full transition-all"
            style={{
              left: '-6px',
              top: '-6px',
              transform: isPressed ? 'scale(0.5)' : 'scale(1)',
            }}
          />
          
          {/* Glow effect */}
          <div
            className="absolute w-8 h-8 bg-treigo-sage rounded-full blur-lg transition-all"
            style={{
              left: '-16px',
              top: '-16px',
              opacity: isPressed ? 0.05 : 0.15,
              transform: isPressed ? 'scale(0.6)' : 'scale(1)',
            }}
          />
        </div>
      )}
    </>
  )
}
