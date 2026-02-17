'use client'

import { ReactNode } from 'react'

interface FloatingActionButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  title?: string
}

export function FloatingActionButton({
  children,
  onClick,
  className = '',
  title = '',
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        fixed bottom-6 right-6 z-40
        p-4 rounded-full
        bg-treigo-forest text-white
        shadow-lg
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        active:scale-95
        animate-float
        ${className}
      `}
    >
      {children}
    </button>
  )
}
