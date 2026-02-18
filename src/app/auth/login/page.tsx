'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Save user data to localStorage
      localStorage.setItem('treigo_user', JSON.stringify({
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        shop: data.user.shop || null,
      }))
      localStorage.setItem('treigo_token', data.token)

      // Redirect based on role
      setTimeout(() => {
        if (data.user.role === 'SELLER') {
          window.location.href = '/seller/dashboard'
        } else {
          window.location.href = '/buyer/dashboard'
        }
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full px-4 sm:px-6 py-8 sm:py-12 lg:py-24 flex-1 flex items-center">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <Link href="/" className="font-900 text-xl sm:text-2xl text-black tracking-tighter mb-2 block hover:opacity-70 transition-opacity">
              TRÈIGO
            </Link>
            <h1 className="text-3xl sm:text-4xl font-900 tracking-tighter text-black mb-1 sm:mb-2">SIGN IN</h1>
            <p className="text-gray-600 uppercase text-xs sm:text-sm tracking-wide">Welcome back</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 sm:p-4 border-l-4 border-red-500 bg-red-50 text-red-700 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 mb-8">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider font-600 text-black mb-2 sm:mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-4 bg-white border-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-sm sm:text-base text-black placeholder:text-gray-500"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider font-600 text-black mb-2 sm:mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:py-4 bg-white border-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-sm sm:text-base text-black placeholder:text-gray-500 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors p-2 active:scale-90"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 bg-black text-white font-600 sm:font-700 uppercase tracking-wider text-xs sm:text-sm hover:bg-gray-900 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-75 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="hidden sm:inline">Signing in...</span>
                  <span className="sm:hidden">Signing in</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="space-y-3 sm:space-y-4 border-t border-gray-200 pt-6 sm:pt-8">
            <Link href="/auth/forgot-password" className="block text-xs sm:text-sm text-gray-600 hover:text-black font-600 uppercase tracking-wide transition-colors">
              Forgot Password?
            </Link>
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-black font-bold hover:opacity-70 transition-opacity">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
