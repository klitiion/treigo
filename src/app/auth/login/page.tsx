'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  
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

      // Save remember me preference if checked
      if (rememberMe) {
        localStorage.setItem('treigo_remember_email', formData.email)
      } else {
        localStorage.removeItem('treigo_remember_email')
      }

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
    <div className="w-screen min-h-screen bg-white flex flex-col">
      <div className="w-full px-4 sm:px-6 py-8 sm:py-12 lg:py-24 flex-1 flex items-center">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <Link href="/" className="font-900 text-xl sm:text-2xl text-black tracking-tighter mb-3 block hover:opacity-70 transition-opacity">
              TRÈIGO
            </Link>
            <h1 className="text-3xl sm:text-4xl font-900 tracking-tighter text-black mb-2">SIGN IN</h1>
            <p className="text-gray-600 uppercase text-xs sm:text-sm tracking-wide">Welcome back</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 mb-8">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-black mb-3">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-4 bg-white border-2 border-black focus:outline-none transition-colors text-sm sm:text-base text-black placeholder:text-gray-500 font-semibold"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-black mb-3">
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
                  className="w-full px-4 py-3 sm:py-4 bg-white border-2 border-black focus:outline-none transition-colors text-sm sm:text-base text-black placeholder:text-gray-500 pr-12 font-semibold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors p-1.5 active:scale-90"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-black bg-white cursor-pointer appearance-none checked:bg-black checked:border-black transition-colors"
                  style={{
                    backgroundImage: rememberMe ? 'url("data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27white%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e")' : 'none',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                  }}
                />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-700 group-hover:text-black transition-colors">
                  Remember Me
                </span>
              </label>
              <Link 
                href="/auth/forgot-password" 
                className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 sm:py-4 bg-black text-white font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-gray-900 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-75 flex items-center justify-center gap-2"
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

          {/* Divider */}
          <div className="border-b-2 border-black my-8"></div>

          {/* Sign Up Link */}
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Don't have an account?
            </p>
            <Link 
              href="/auth/register" 
              className="block w-full py-3 sm:py-4 border-2 border-black text-black text-center font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-gray-50 active:scale-95 transition-all duration-75"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
