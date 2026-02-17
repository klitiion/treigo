'use client'

import { ReactNode } from 'react'

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function AnimatedButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
}: AnimatedButtonProps) {
  const baseStyles = 'font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50'

  const variantStyles = {
    primary: 'bg-treigo-forest text-white hover:bg-treigo-forest/90 hover:shadow-lg',
    secondary: 'bg-treigo-sage text-treigo-dark hover:bg-treigo-sage/90 hover:shadow-md',
    outline: 'border-2 border-treigo-forest text-treigo-forest hover:bg-treigo-forest/10',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  )
}
