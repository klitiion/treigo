'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface User {
  id?: string
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  role?: 'BUYER' | 'SELLER' | 'ADMIN'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Try to get user from localStorage
    const storedUser = localStorage.getItem('treigo_user')
    const storedToken = localStorage.getItem('treigo_token')
    
    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser)
        // Accept user if they have either email or name/firstName
        if (parsed.email || parsed.name || parsed.firstName) {
          setUser(parsed)
          setToken(storedToken)
        }
      } catch (error) {
        console.error('Failed to parse user:', error)
        localStorage.removeItem('treigo_user')
        localStorage.removeItem('treigo_token')
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('treigo_user')
    localStorage.removeItem('treigo_token')
    setUser(null)
    setToken(null)
    router.push('/auth/login')
  }

  return { user, token, loading: !mounted || loading, logout }
}

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'BUYER' | 'SELLER'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [mounted, setMounted] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Only run auth check after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return

    // Check if user exists
    if (!user) {
      // No user - redirect to login
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // User exists - allow access regardless of role for backward compatibility
    // Existing users might not have role set, so we don't enforce it
  }, [user, loading, router, pathname, mounted])

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-treigo-forest animate-spin" />
      </div>
    )
  }

  // Redirect to login if no user
  if (!user) {
    return null
  }

  return <>{children}</>
}
