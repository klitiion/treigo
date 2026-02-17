'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus, User, Mail, Phone, MapPin, Code } from 'lucide-react'

export default function ShippingPage() {
  const router = useRouter()
  const [step, setStep] = useState<'auth' | 'shipping'>('auth')
  const [authMethod, setAuthMethod] = useState<'login' | 'register' | 'guest' | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Check if user is already logged in
    const storedUser = localStorage.getItem('treigo_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        // Skip auth step and go directly to shipping
        setStep('shipping')
        setAuthMethod('login') // Mark as logged in
      } catch {
        // If parsing fails, show auth step
        setStep('auth')
      }
    }
  }, [])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load profile data when user is logged in
  useEffect(() => {
    if (step === 'shipping') {
      const storedUser = localStorage.getItem('treigo_user')
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          setFormData({
            firstName: user.name || user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            postalCode: user.postalCode || '',
          })
        } catch {
          // If parsing fails, keep empty form
        }
      }
    }
  }, [step])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Emri është i detyrueshëm'
    if (!formData.lastName.trim()) newErrors.lastName = 'Mbiemri është i detyrueshëm'
    if (!formData.email.trim()) newErrors.email = 'Email-i është i detyrueshëm'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email-i nuk është i vlefshëm'
    if (!formData.phone.trim()) newErrors.phone = 'Numri i telefonit është i detyrueshëm'
    if (!formData.address.trim()) newErrors.address = 'Adresa është e detyrueshme'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Kodi postar është i detyrueshëm'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Save shipping info and redirect to checkout
      localStorage.setItem('shipping_info', JSON.stringify(formData))
      router.push('/checkout')
    }
  }

  if (!isClient) return null

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container-treigo max-w-2xl">
        {/* Step Indicator */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <div className={`flex items-center justify-center w-12 h-12 font-bold border-2 ${
            step === 'auth' ? 'bg-black text-white border-black' : 'bg-white text-black border-black'
          }`}>
            1
          </div>
          <div className={`h-2 w-12 ${step === 'shipping' ? 'bg-black' : 'bg-gray-300'}`} />
          <div className={`flex items-center justify-center w-12 h-12 font-bold border-2 ${
            step === 'shipping' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-300'
          }`}>
            2
          </div>
        </div>

        {step === 'auth' ? (
          // Authentication Step
          <div>
            <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-tight">LOGIN / REGISTER</h1>
            <p className="text-gray-600 mb-12 text-sm">Choose how you want to proceed</p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Login Option */}
              <button
                onClick={() => {
                  setAuthMethod('login')
                  // Redirect to login
                  router.push('/auth/login?redirect=/shipping')
                }}
                className="p-8 bg-white border-2 border-black hover:bg-black hover:text-white transition-all group"
              >
                <LogIn className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2 uppercase text-sm tracking-wide">SIGN IN</h3>
                <p className="text-sm">If you already have an account</p>
              </button>

              {/* Register Option */}
              <button
                onClick={() => {
                  setAuthMethod('register')
                  // Redirect to register
                  router.push('/auth/register?redirect=/shipping')
                }}
                className="p-8 bg-white border-2 border-black hover:bg-black hover:text-white transition-all group"
              >
                <UserPlus className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2 uppercase text-sm tracking-wide">REGISTER</h3>
                <p className="text-sm">Create a new account</p>
              </button>

              {/* Guest Option */}
              <button
                onClick={() => {
                  setAuthMethod('guest')
                  setStep('shipping')
                }}
                className="p-8 bg-white border-2 border-black hover:bg-black hover:text-white transition-all group"
              >
                <User className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2 uppercase text-sm tracking-wide">GUEST</h3>
                <p className="text-sm">Continue without an account</p>
              </button>
            </div>
          </div>
        ) : (
          // Shipping Information Step
          <div>
            <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-tight">SHIPPING INFO</h1>
            <p className="text-gray-600 mb-12 text-sm">Enter your delivery details</p>

            <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-8 space-y-8">
              {/* Name Row */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">FIRST NAME *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Gjon"
                    className={`w-full px-10 py-3 bg-white border-b-2 focus:outline-none transition-colors ${
                      errors.firstName ? 'border-red-600' : 'border-gray-300 focus:border-black'
                    } text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed`}
                  />
                  {errors.firstName && <p className="text-red-600 text-xs mt-2">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">LAST NAME *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Marku"
                    className={`w-full px-10 py-3 bg-white border-b-2 focus:outline-none transition-colors ${
                      errors.lastName ? 'border-red-600' : 'border-gray-300 focus:border-black'
                    } text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed`}
                  />
                  {errors.lastName && <p className="text-red-600 text-xs mt-2">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Mail className="w-4 h-4" /> EMAIL *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className={`w-full px-10 py-3 bg-white border-b-2 focus:outline-none transition-colors ${
                    errors.email ? 'border-red-600' : 'border-gray-300 focus:border-black'
                  } text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed`}
                />
                {errors.email && <p className="text-red-600 text-xs mt-2">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Phone className="w-4 h-4" /> PHONE *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+355 69 XXX XXXX"
                  className={`w-full px-10 py-3 bg-white border-b-2 focus:outline-none transition-colors ${
                    errors.phone ? 'border-red-600' : 'border-gray-300 focus:border-black'
                  } text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed`}
                />
                {errors.phone && <p className="text-red-600 text-xs mt-2">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> ADDRESS *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Rruga Deshmoret e Kombit, Nr. 125"
                  className={`w-full px-10 py-3 bg-white border-b-2 focus:outline-none transition-colors ${
                    errors.address ? 'border-red-600' : 'border-gray-300 focus:border-black'
                  } text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed`}
                />
                {errors.address && <p className="text-red-600 text-xs mt-2">{errors.address}</p>}
              </div>

              {/* City & Postal Code */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">CITY</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Tirane"
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Code className="w-4 h-4" /> POSTAL CODE *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    placeholder="10001"
                    className={`w-full px-10 py-3 bg-white border-b-2 focus:outline-none transition-colors ${
                      errors.postalCode ? 'border-red-600' : 'border-gray-300 focus:border-black'
                    } text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed`}
                  />
                  {errors.postalCode && <p className="text-red-600 text-xs mt-2">{errors.postalCode}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="flex-1 px-4 py-4 border-2 border-black text-black font-semibold uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-all"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-black text-white font-semibold uppercase tracking-wide text-sm hover:bg-gray-800 transition-colors"
                >
                  CONTINUE TO CHECKOUT
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
