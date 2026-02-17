'use client'

import Link from 'next/link'
import { CheckCircle, Home, ShoppingBag, Copy, Mail } from 'lucide-react'
import { saveOrderToDatabase } from '@/lib/orders'

export default function PaymentSuccessPage() {
  // Generate a unique order code
  const orderId = `TRG-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(orderId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-treigo-sage/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-green-100 p-8 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-treigo-dark mb-3">
            Hooray! 🎉
          </h1>
          <p className="text-lg text-treigo-dark/70">
            Porosia juaj u pranua me sukses!
          </p>
        </div>

        {/* Order Code */}
        <div className="bg-gradient-to-r from-treigo-forest/10 to-treigo-sage/10 rounded-2xl border border-treigo-forest/20 p-6 mb-8">
          <p className="text-sm text-treigo-dark/60 mb-2">Kodi i Porosisë:</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-bold text-treigo-forest font-mono">{orderId}</span>
            <button
              onClick={handleCopyCode}
              className="p-2 bg-treigo-forest text-white rounded-lg hover:bg-treigo-forest/90 transition-colors"
              title="Kopjo kodin"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-treigo-olive/10 p-6 mb-8 text-left space-y-4">
          <div>
            <p className="text-xs text-treigo-dark/60 uppercase font-semibold mb-1">Statusi i Pagesës</p>
            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              ✓ Paguar me Sukses
            </div>
          </div>
          <div className="border-t border-treigo-olive/10 pt-4">
            <p className="text-xs text-treigo-dark/60 uppercase font-semibold mb-1">Dita e Porositjes</p>
            <p className="text-treigo-dark font-medium">{new Date().toLocaleDateString('sq-AL', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 mb-8 flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-medium text-blue-900">Konfirmim në Email</p>
            <p className="text-xs text-blue-800">Keni marrë një email konfirmimi me detajet e porosisë</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link 
            href="/buyer/orders"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-treigo-forest text-white font-medium rounded-xl hover:bg-treigo-forest/90 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            Shiko Porositjet
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
        <div className="mt-8 text-center">
          <p className="text-sm text-treigo-dark/60 mb-2">
            Pyetje ose nëse na duhet diçka?
          </p>
          <a 
            href="mailto:support@treigo.eu"
            className="text-treigo-forest font-semibold hover:underline"
          >
            Kontakto Suportin
          </a>
        </div>
      </div>
    </div>
  )
}
