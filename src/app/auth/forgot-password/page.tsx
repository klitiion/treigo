'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!resetCode || resetCode.length !== 6) {
      setError('Code must be 6 digits')
      return
    }

    setIsVerifyingCode(true)

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: resetCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code')
      }

      // Redirect to reset password page with token
      window.location.href = `/auth/reset-password?token=${data.resetToken}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsVerifyingCode(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="max-w-md mx-auto">
          {success ? (
            <>
              <div className="mb-12">
                <h1 className="text-4xl font-900 tracking-tighter text-black mb-2">VERIFY CODE</h1>
                <p className="text-gray-600 uppercase text-sm tracking-wide">Check your email for the reset code</p>
              </div>

              {error && (
                <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black text-center text-lg tracking-widest font-600 placeholder:text-gray-700 placeholder:font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingCode || resetCode.length !== 6}
                  className="w-full py-4 bg-black text-white font-900 uppercase tracking-wide hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 text-sm"
                >
                  {isVerifyingCode ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>

              <div className="border-t border-gray-200 mt-8 pt-8">
                <button
                  onClick={() => {
                    setSuccess(false)
                    setError('')
                    setEmail('')
                    setResetCode('')
                  }}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Didn't receive code? Go back
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-12">
                <h1 className="text-4xl font-900 tracking-tighter text-black mb-2">RESET PASSWORD</h1>
                <p className="text-gray-600 uppercase text-sm tracking-wide">Enter your email address</p>
              </div>

              {error && (
                <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-black text-white font-900 uppercase tracking-wide hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </button>
              </form>

              <div className="border-t border-gray-200 pt-8">
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
