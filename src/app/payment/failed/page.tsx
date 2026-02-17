'use client'

import Link from 'next/link'
import { AlertCircle, Home, Mail } from 'lucide-react'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-treigo-cream/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-red-100 p-8 rounded-full">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-treigo-dark mb-3">
            Payment Failed 😞
          </h1>
          <p className="text-lg text-treigo-dark/70">
            Ndodhi një problem gjatë përpunimit të pagesës tuaj.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6 mb-8">
          <div className="space-y-2 text-left">
            <p className="text-sm text-red-800">
              <strong>Arsye:</strong> Pagesa e refuzuar nga banka
            </p>
            <p className="text-xs text-red-700 mt-2">
              Please check your card details and try again, or use another card.
            </p>
          </div>
        </div>

        {/* Help Suggestions */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mb-8">
          <p className="text-sm text-blue-800 mb-3 font-medium">Çfarë mund të bëj?</p>
          <ul className="text-left space-y-2 text-sm text-blue-800">
            <li>✓ Kontrolloni numrin e kartës</li>
            <li>✓ Sigurohuni që data e skadimit është e saktë</li>
            <li>✓ Provoni me një kartë tjetër</li>
            <li>✓ Kontaktoni bankën tuaj</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link 
            href="/checkout"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-treigo-forest text-white font-medium rounded-xl hover:bg-treigo-forest/90 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            🔄 Provo Përsëri
          </Link>
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-treigo-sage text-treigo-dark font-medium rounded-xl hover:bg-treigo-sage/90 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Kthehu në Faqen Kryesore
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-treigo-dark/60">
            Please contact support if the problem persists:
          </p>
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-treigo-olive/10">
            <Mail className="w-4 h-4 text-treigo-forest" />
            <a 
              href="mailto:support@treigo.eu"
              className="text-treigo-forest font-semibold hover:underline"
            >
              support@treigo.eu
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
