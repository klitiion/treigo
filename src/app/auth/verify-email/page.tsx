'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState('')
  const [newEmail, setNewEmail] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('Invalid verification link')
      return
    }

    // Verify the token and update email
    verifyEmailToken()
  }, [token])

  const verifyEmailToken = async () => {
    try {
      // First, try to verify the token via API
      const response = await fetch('/api/auth/verify-email-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const data = await response.json()
        setStatus('error')
        setError(data.error || 'Verification link expired or invalid. Please request a new verification email.')
        return
      }

      const { data: tokenData } = await response.json()
      
      // Update user email in localStorage
      const user = JSON.parse(localStorage.getItem('treigo_user') || '{}')
      
      // Update to new email
      user.email = tokenData.newEmail
      localStorage.setItem('treigo_user', JSON.stringify(user))

      // Store verified email for profile page
      localStorage.setItem('email_verified', tokenData.newEmail)
      
      // Remove pending email change
      localStorage.removeItem('pending_email_change')

      setNewEmail(tokenData.newEmail)
      setStatus('success')
    } catch (err) {
      console.error('Error verifying email:', err)
      setStatus('error')
      setError('An error occurred while verifying your email. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container-treigo max-w-2xl">
        {status === 'verifying' && (
          <div className="text-center py-16">
            <Loader2 className="w-16 h-16 text-black mx-auto mb-6 animate-spin" />
            <h1 className="text-4xl font-bold text-black mb-4 uppercase tracking-tight">
              Verifying Email
            </h1>
            <p className="text-gray-600 text-lg">Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-black mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-black mb-4 uppercase tracking-tight">
              Email Verified!
            </h1>
            <div className="bg-gray-100 border-2 border-black p-6 mb-8 mt-8">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">
                Your new email address
              </p>
              <p className="text-2xl font-bold text-black">{newEmail}</p>
            </div>
            <p className="text-gray-600 text-lg mb-8">
              Your email address has been successfully updated. You can now use <strong>{newEmail}</strong> to sign in to your account.
            </p>
            <Link
              href="/buyer/profile"
              className="inline-block px-8 py-4 bg-black text-white font-bold uppercase tracking-wide text-sm hover:bg-gray-800 transition-colors"
            >
              Go to Profile
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-black mb-4 uppercase tracking-tight">
              Verification Failed
            </h1>
            <p className="text-gray-600 text-lg mb-8">{error}</p>
            <div className="space-y-4">
              <Link
                href="/buyer/profile"
                className="inline-block px-8 py-4 bg-black text-white font-bold uppercase tracking-wide text-sm hover:bg-gray-800 transition-colors"
              >
                Back to Profile
              </Link>
              <p className="text-gray-600 text-sm">
                or{' '}
                <Link href="/contact" className="text-black font-bold underline">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
