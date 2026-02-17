'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, X, Loader2 } from 'lucide-react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Link i pavlefshëm. Token mungon.')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data.error)
        }
      } catch {
        setStatus('error')
        setMessage('Dicka shkoi keq. Provo përsëri.')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-treigo-sage/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-treigo-forest animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-treigo-dark mb-4">Verifying...</h1>
            <p className="text-treigo-dark/70">Please wait</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-treigo-dark mb-4">Verification Complete!</h1>
            <p className="text-treigo-dark/70 mb-8">{message}</p>
            <Link 
              href="/auth/login" 
              className="inline-block px-8 py-4 bg-treigo-forest text-white font-semibold rounded-xl hover:bg-treigo-forest/90 transition-colors"
            >
              Sign In
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-treigo-dark mb-4">Verifikimi dështoi</h1>
            <p className="text-treigo-dark/70 mb-8">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register" 
                className="px-6 py-3 bg-treigo-forest text-white font-medium rounded-xl hover:bg-treigo-forest/90 transition-colors"
              >
                Regjistrohu përsëri
              </Link>
              <a 
                href="https://wa.me/355692084763" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-treigo-olive/30 text-treigo-dark font-medium rounded-xl hover:bg-treigo-sage/20 transition-colors"
              >
                Na kontakto
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-treigo-forest animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
