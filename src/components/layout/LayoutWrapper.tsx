'use client'

import { useEffect, useState } from 'react'
import { MobileSellerNav } from './MobileSellerNav'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSeller, setIsSeller] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedUser = localStorage.getItem('treigo_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user.role === 'SELLER') {
          setIsSeller(true)
        }
      } catch {
        //
      }
    }
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <>
      {children}
      {isSeller ? <MobileSellerNav /> : <WhatsAppButton />}
    </>
  )
}
