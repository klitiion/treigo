'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { validatePassword } from '@/lib/passwordValidator'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'password') {
      setPasswordValidation(validatePassword(value))
    }

    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Tokeni nuk është i vlefshëm')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0])
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Dicka shkoi keq')
      }

      setSuccess(true)
      setFormData({ password: '', confirmPassword: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dicka shkoi keq')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen py-12 px-4 bg-white flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-black mb-3 uppercase tracking-tight">INVALID LINK</h1>
          <p className="text-gray-700 mb-8 text-sm">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block px-8 py-3 bg-black text-white font-semibold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors"
          >
            TRY AGAIN
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        {success ? (
          // Success State
          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-4 uppercase tracking-tight">PASSWORD RESET</h1>
            <p className="text-gray-700 mb-8 text-sm">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-8 py-3 bg-black text-white font-semibold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors"
            >
              SIGN IN
            </Link>
          </div>
        ) : (
          // Form State
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-tight">
                RESET PASSWORD
              </h1>
              <p className="text-gray-700 text-sm">
                Create a new secure password
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 border-l-2 border-red-600 bg-red-50 text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-black mb-3 uppercase tracking-wide"
                >
                  NEW PASSWORD *
                </label>
                <div className="relative mb-4">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-2 p-4 bg-gray-50 border-l-2 border-black">
                    <p className="text-xs font-semibold text-black uppercase tracking-wide">
                      PASSWORD REQUIREMENTS:
                    </p>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li
                        className={`flex items-center gap-2 ${
                          formData.password.length >= 8
                            ? 'text-black font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        <span className={formData.password.length >= 8 ? 'text-black' : 'text-gray-400'}>✓</span>
                        At least 8 characters
                      </li>
                      <li
                        className={`flex items-center gap-2 ${
                          /[A-Z]/.test(formData.password)
                            ? 'text-black font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        <span className={/[A-Z]/.test(formData.password) ? 'text-black' : 'text-gray-400'}>✓</span>
                        One uppercase letter (A-Z)
                      </li>
                      <li
                        className={`flex items-center gap-2 ${
                          /[0-9]/.test(formData.password)
                            ? 'text-black font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        <span className={/[0-9]/.test(formData.password) ? 'text-black' : 'text-gray-400'}>✓</span>
                        One number (0-9)
                      </li>
                      <li
                        className={`flex items-center gap-2 ${
                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                            formData.password
                          )
                            ? 'text-black font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-black' : 'text-gray-400'}>✓</span>
                        One special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-black mb-3 uppercase tracking-wide"
                >
                  CONFIRM PASSWORD *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  placeholder="Re-enter password"
                />
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-700 mt-2 font-semibold">✓ PASSWORDS MATCH</p>
                  )}
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 mt-2 font-semibold">✗ PASSWORDS DO NOT MATCH</p>
                  )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.password ||
                  !formData.confirmPassword ||
                  !passwordValidation.isValid
                }
                className="w-full py-4 bg-black text-white font-semibold uppercase text-sm tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    RESETTING...
                  </>
                ) : (
                  'RESET PASSWORD'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-treigo-forest animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
