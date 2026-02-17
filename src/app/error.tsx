'use client'

import Link from 'next/link'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-treigo-cream via-white to-treigo-sage/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-red-100 p-8 rounded-full">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-treigo-dark mb-3">
            Diçka Shkoi Keq! 😞
          </h1>
          <p className="text-lg text-treigo-dark/70">
            Na vjen keq, ndodhi një gabim në shërbim. Lutjemi provo më vonë.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-left">
          <p className="text-xs text-red-600 font-mono break-words">
            {error.message || 'Gabim i panjohur'}
          </p>
        </div>

        {/* Message */}
        <div className="bg-treigo-olive/5 border border-treigo-olive/20 rounded-2xl p-6 mb-8">
          <p className="text-treigo-dark/80 text-sm">
            Kontakto supportin nëse problemi vazhdon.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-treigo-forest text-white font-medium rounded-xl hover:bg-treigo-forest/90 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            Provo Përsëri
          </button>
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-treigo-sage text-treigo-dark font-medium rounded-xl hover:bg-treigo-sage/90 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Kthehu në Faqen Kryesore
          </Link>
        </div>

        {/* Support Email */}
        <div className="mt-8 text-center text-sm text-treigo-dark/60">
          <p>
            Nëse duhet ndihmë, kontakto:
            <a 
              href="mailto:support@treigo.eu"
              className="text-treigo-forest font-semibold hover:underline block mt-2"
            >
              support@treigo.eu
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
