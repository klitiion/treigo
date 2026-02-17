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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="font-900 text-2xl text-black tracking-tighter mb-2">
              TRÈIGO
            </Link>
            <h1 className="text-4xl font-900 tracking-tighter text-black mb-2">SIGN IN</h1>
            <p className="text-gray-600 uppercase text-sm tracking-wide">Welcome back</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
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
                  className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black text-white font-900 uppercase tracking-wide hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="space-y-4 border-t border-gray-200 pt-8">
            <Link href="/auth/forgot-password" className="block text-sm text-gray-600 hover:text-black transition-colors">
              Forgot password?
            </Link>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-black font-600 hover:opacity-70 transition-opacity">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
