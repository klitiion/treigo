'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, User, Store, Check, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { validatePassword } from '@/lib/passwordValidator'

const countries = [
  { code: 'AL', name: 'Albania' },
  { code: 'XK', name: 'Kosovo' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'RS', name: 'Serbia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
]

// Format phone number to +355 69 xxxx xxxx format
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // If it starts with 355 (with country code)
  if (cleaned.startsWith('355')) {
    const last10 = cleaned.slice(3)
    if (last10.length === 9 && last10.startsWith('69')) {
      return `+355 ${last10.slice(0, 2)} ${last10.slice(2, 6)} ${last10.slice(6)}`
    }
  }
  
  // If it starts with 069 (local format)
  if (cleaned.startsWith('069')) {
    return `+355 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }
  
  // If it starts with 69 (without leading 0)
  if (cleaned.startsWith('69')) {
    return `+355 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`
  }
  
  return phone
}

// Validate Albanian phone number
const isValidAlbanianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  
  // Must be 9 digits for mobile (without country code) or 12 digits (with 355)
  if (cleaned.startsWith('355')) {
    const last10 = cleaned.slice(3)
    return last10.length === 9 && last10.startsWith('69')
  }
  
  // Accept 069 or 69 formats
  if (cleaned.startsWith('069') || cleaned.startsWith('69')) {
    return cleaned.length === 10 || cleaned.length === 9
  }
  
  return false
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') === 'seller' ? 'SELLER' : 'BUYER'
  
  const [role, setRole] = useState<'BUYER' | 'SELLER'>(initialRole)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false)
  const [duplicateMessage, setDuplicateMessage] = useState('')
  const [storePhotoFile, setStorePhotoFile] = useState<File | null>(null)
  const [storePhotoPreview, setStorePhotoPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: 'AL',
    city: '',
    address: '',
    acceptTerms: false,
    acceptsMarketing: true,
    nipt: '', // For sellers only
    businessName: '', // For sellers only
    taxRegistration: '', // For sellers only
    storeName: '', // For sellers only
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const inputElement = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? inputElement.checked : value
    }))
    
    // Update password validation when password field changes
    if (name === 'password') {
      setPasswordValidation(validatePassword(value))
    }
    
    setError('')
  }

  const handleStorePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setStorePhotoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setStorePhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShowDuplicateAlert(false)
    
    // Validation
    if (!formData.acceptTerms) {
      setError('Duhet të pranosh termat dhe kushtet')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate password strength
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0])
      return
    }
    
    // Validate phone number
    if (!isValidAlbanianPhone(formData.phone)) {
      setError('Numri i telefonit duhet të jetë në formatin 069 ose +355 69')
      return
    }

    // Seller-specific validation
    if (role === 'SELLER') {
      if (!formData.storeName || formData.storeName.trim() === '') {
        setError('Store name is required for sellers')
        return
      }

      if (!formData.businessName || formData.businessName.trim() === '') {
        setError('Business name is required for sellers')
        return
      }
      
      if (!formData.nipt || formData.nipt.trim() === '') {
        setError('NIPT (VAT ID) is required for sellers')
        return
      }
      
      // NIPT should be 10 digits
      if (!/^\d{10}$/.test(formData.nipt.replace(/\s/g, ''))) {
        setError('NIPT must be 10 digits')
        return
      }
      
      if (!formData.taxRegistration || formData.taxRegistration.trim() === '') {
        setError('Tax registration number is required for sellers')
        return
      }
    }

    setIsLoading(true)

    try {
      const formattedPhone = formatPhoneNumber(formData.phone)
      
      // Convert store photo to base64 if present
      let storePhotoUrl: string | undefined = undefined
      if (storePhotoFile && role === 'SELLER') {
        const buffer = await storePhotoFile.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        const mimeType = storePhotoFile.type || 'image/jpeg'
        storePhotoUrl = `data:${mimeType};base64,${base64}`
      }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formattedPhone,
          role,
          ...(storePhotoUrl && { storePhotoUrl })
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle duplicate user error (409 Conflict)
        if (response.status === 409) {
          setDuplicateMessage(data.error || 'Llogaria ekziston tashmë')
          setShowDuplicateAlert(true)
        } else {
          setError(data.error || 'Dicka shkoi keq')
        }
        return
      }

      setRegisteredEmail(data.email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dicka shkoi keq')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Kodi duhet të jetë 6 shifra')
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          code: verificationCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kodi nuk është i saktë')
      }

      // Redirect to login after successful verification
      window.location.href = '/auth/login?verified=true'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dicka shkoi keq')
    } finally {
      setIsVerifying(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <Check className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4 tracking-tight uppercase">CHECK YOUR EMAIL</h1>
            <p className="text-gray-700 mb-6 sm:mb-8 text-xs sm:text-sm">
              We sent a verification code to <strong>{registeredEmail}</strong>. The code expires in 10 minutes.
            </p>

            {/* Verification Code Form */}
            <form onSubmit={handleVerifyCode} className="space-y-5 sm:space-y-6">
              {error && (
                <div className="p-3 sm:p-4 border-l-2 border-red-600 bg-red-50 text-red-700 text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                  VERIFICATION CODE (6 DIGITS)
                </label>
                <input
                  type="text"
                  id="code"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 sm:px-10 py-4 sm:py-5 text-center text-xl sm:text-2xl tracking-[0.3em] bg-white border-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-700"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full py-3 sm:py-4 bg-black text-white font-semibold uppercase text-xs sm:text-sm tracking-wide hover:bg-gray-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isVerifying ? 'VERIFYING...' : 'VERIFY CODE'}
              </button>
            </form>

            <p className="text-gray-700 text-xs sm:text-sm mt-6 sm:mt-8">
              Didn't receive the code?{' '}
              <button
                onClick={() => setSuccess(false)}
                className="font-semibold text-black hover:underline"
              >
                TRY AGAIN
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Duplicate Account Alert Modal */}
        {showDuplicateAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 max-w-md w-full">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-center text-black mb-3 sm:mb-4 uppercase">ACCOUNT EXISTS</h2>
              
              <p className="text-center text-gray-700 mb-6 sm:mb-8 text-xs sm:text-sm">
                {duplicateMessage}
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href="/auth/login"
                  className="block w-full text-center py-3 sm:py-4 bg-black text-white font-semibold uppercase text-xs sm:text-sm tracking-wide hover:bg-gray-800 active:scale-95 transition-all"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/auth/forgot-password"
                  className="block w-full text-center py-3 sm:py-4 border-b-2 border-black text-black font-semibold uppercase text-xs sm:text-sm tracking-wide hover:bg-gray-50 active:scale-95 transition-all"
                >
                  RESET PASSWORD
                </Link>
                <button
                  onClick={() => {
                    setShowDuplicateAlert(false)
                    setDuplicateMessage('')
                  }}
                  className="w-full py-3 sm:py-4 text-gray-700 font-semibold uppercase text-xs sm:text-sm tracking-wide hover:bg-gray-50 active:scale-95 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-black mb-6 sm:mb-8 hover:underline font-semibold text-xs sm:text-sm uppercase tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK HOME
        </Link>

        {/* Main Form Container */}
        <div className="max-w-md">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-1 sm:mb-2 uppercase tracking-tight">CREATE ACCOUNT</h1>
            <p className="text-gray-700 text-xs sm:text-sm">Join Trèigo to start shopping or selling</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12 border-b-2 border-black pb-6 sm:pb-8">
            <button
              type="button"
              onClick={() => setRole('BUYER')}
              className={`p-3 sm:p-4 border-2 transition-all active:scale-95 ${
                role === 'BUYER' 
                  ? 'border-black bg-black text-white' 
                  : 'border-black text-black hover:bg-gray-50'
              }`}
            >
              <User className="w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-1 sm:mb-2" />
              <p className="font-semibold uppercase text-xs tracking-wide">Buyer</p>
            </button>
            <button
              type="button"
              onClick={() => setRole('SELLER')}
              className={`p-3 sm:p-4 border-2 transition-all active:scale-95 ${
                role === 'SELLER' 
                  ? 'border-black bg-black text-white' 
                  : 'border-black text-black hover:bg-gray-50'
              }`}
            >
              <Store className="w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-1 sm:mb-2" />
              <p className="font-semibold uppercase text-xs tracking-wide">Seller</p>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 border-l-4 border-red-600 bg-red-50 text-red-700 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                  FIRST NAME *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                  LAST NAME *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                EMAIL *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                PHONE *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                placeholder="+355 69 xxx xxxx"
              />
              <p className="text-xs text-gray-600 mt-2">Format: +355 69 or 069</p>
            </div>

            {/* Country & City */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label htmlFor="country" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                  COUNTRY *
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-0 py-2 sm:py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-sm sm:text-base"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                  CITY *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                  placeholder="Tirana"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                ADDRESS *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                placeholder="Street address"
              />
            </div>
            {/* Seller Fields - Only show when role is SELLER */}
            {role === 'SELLER' && (
              <>
                <div>
                  <label htmlFor="storeName" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                    STORE NAME *
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    required
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                    placeholder="Your store/shop name"
                  />
                </div>

                <div>
                  <label htmlFor="businessName" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                    BUSINESS NAME *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                    placeholder="Your business/store name"
                  />
                </div>

                {/* Store Photo Upload */}
                <div>
                  <label htmlFor="storePhoto" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                    STORE PHOTO (OPTIONAL)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-black transition-colors">
                    {storePhotoPreview ? (
                      <>
                        <img
                          src={storePhotoPreview}
                          alt="Store preview"
                          className="w-24 sm:w-32 h-24 sm:h-32 mx-auto object-cover rounded mb-3 sm:mb-4"
                        />
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">Store photo selected</p>
                        <button
                          type="button"
                          onClick={() => {
                            setStorePhotoFile(null)
                            setStorePhotoPreview(null)
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Change photo
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">Upload a store photo or logo</p>
                        <label className="cursor-pointer inline-block px-3 sm:px-4 py-2 bg-black text-white text-xs font-semibold rounded hover:bg-gray-800 active:scale-95 transition-all">
                          Choose Photo
                          <input
                            type="file"
                            id="storePhoto"
                            accept="image/*"
                            onChange={handleStorePhotoChange}
                            className="hidden"
                          />
                        </label>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">You can also add or change your store photo later in your profile settings</p>
                </div>

                <div>
                  <label htmlFor="nipt" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                    NIPT (VAT ID) *
                  </label>
                  <input
                    type="text"
                    id="nipt"
                    name="nipt"
                    required
                    value={formData.nipt}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                    placeholder="10-digit NIPT number"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-600 mt-2">Required by Albanian tax authorities for business operations</p>
                </div>

                <div>
                  <label htmlFor="taxRegistration" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                    TAX REGISTRATION NUMBER *
                  </label>
                  <input
                    type="text"
                    id="taxRegistration"
                    name="taxRegistration"
                    required
                    value={formData.taxRegistration}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                    placeholder="Tax registration/License number"
                  />
                  <p className="text-xs text-gray-600 mt-2">Business registration number from Albanian Registry of Businesses</p>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                PASSWORD *
              </label>
              <div className="relative mb-3 sm:mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base pr-12"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors p-2 active:scale-90"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 bg-gray-50 border-l-2 border-black mb-4 sm:mb-6">
                  <p className="text-xs font-semibold text-black uppercase tracking-wide">PASSWORD REQUIREMENTS:</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs text-gray-700">
                    <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-black font-semibold' : 'text-gray-600'}`}>
                      <span className={formData.password.length >= 8 ? 'text-black' : 'text-gray-400'}>✓</span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-black font-semibold' : 'text-gray-600'}`}>
                      <span className={/[A-Z]/.test(formData.password) ? 'text-black' : 'text-gray-400'}>✓</span>
                      One uppercase letter (A-Z)
                    </li>
                    <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-black font-semibold' : 'text-gray-600'}`}>
                      <span className={/[0-9]/.test(formData.password) ? 'text-black' : 'text-gray-400'}>✓</span>
                      One number (0-9)
                    </li>
                    <li className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-black font-semibold' : 'text-gray-600'}`}>
                      <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-black' : 'text-gray-400'}>✓</span>
                      One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-black mb-2 sm:mb-3 uppercase tracking-wide">
                CONFIRM PASSWORD *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 sm:px-10 py-3 sm:py-4 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-500 text-sm sm:text-base"
                placeholder="Re-enter password"
              />
              {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-700 mt-2 font-semibold">✓ PASSWORDS MATCH</p>
              )}
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 mt-2 font-semibold">✗ PASSWORDS DO NOT MATCH</p>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-3 py-4 border-b-2 border-gray-300">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 w-5 h-5 border-2 border-black cursor-pointer flex-shrink-0"
              />
              <label htmlFor="acceptTerms" className="text-xs sm:text-xs text-gray-700 cursor-pointer leading-relaxed">
                I agree to Trèigo's{' '}
                <Link href="/terms" className="text-black font-semibold hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-black font-semibold hover:underline">
                  Privacy Policy
                </Link>
                {' '}*
              </label>
            </div>

            {/* Marketing Emails Checkbox */}
            <div className="flex items-start gap-3 py-4 border-b-2 border-gray-300">
              <input
                type="checkbox"
                id="acceptsMarketing"
                name="acceptsMarketing"
                checked={formData.acceptsMarketing}
                onChange={handleChange}
                className="mt-1 w-5 h-5 border-2 border-black cursor-pointer flex-shrink-0"
              />
              <label htmlFor="acceptsMarketing" className="text-xs sm:text-xs text-gray-700 cursor-pointer leading-relaxed">
                Keep me updated with exclusive offers, new products, and personalized recommendations. You can change this preference anytime in your{' '}
                <Link href="/buyer/profile" className="text-black font-semibold hover:underline">
                  account settings
                </Link>
                .
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 bg-black text-white font-semibold uppercase text-xs sm:text-sm tracking-wide hover:bg-gray-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">CREATING ACCOUNT...</span>
                  <span className="sm:hidden">CREATING...</span>
                </>
              ) : (
                `CREATE ACCOUNT AS ${role === 'SELLER' ? 'SELLER' : 'BUYER'}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    )
  }

  export default function RegisterPage() {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-treigo-forest animate-spin" />
        </div>
      }>
        <RegisterForm />
      </Suspense>
    )
  }
