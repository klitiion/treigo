'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MobileSellerNav } from './MobileSellerNav'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSeller, setIsSeller] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

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

  // Only show seller nav on seller pages
  const isSellerPage = pathname?.startsWith('/seller')
  const showSellerNav = isSeller && isSellerPage

  if (!mounted) return <>{children}</>

  return (
    <>
      {children}
      {showSellerNav ? <MobileSellerNav /> : <WhatsAppButton />}
    </>
  )
}
