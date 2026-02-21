'use client'

import { useState, Suspense, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Check, Loader2, AlertCircle, MapPin, X } from 'lucide-react'
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
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('355')) {
    const last10 = cleaned.slice(3)
    if (last10.length === 9 && last10.startsWith('69')) {
      return `+355 ${last10.slice(0, 2)} ${last10.slice(2, 6)} ${last10.slice(6)}`
    }
  }
  
  if (cleaned.startsWith('069')) {
    return `+355 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }
  
  if (cleaned.startsWith('69')) {
    return `+355 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`
  }
  
  return phone
}

// Validate Albanian phone number
const isValidAlbanianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('355')) {
    const last10 = cleaned.slice(3)
    return last10.length === 9 && last10.startsWith('69')
  }
  
  if (cleaned.startsWith('069') || cleaned.startsWith('69')) {
    return cleaned.length === 10 || cleaned.length === 9
  }
  
  return false
}

interface PlacePrediction {
  description: string
  place_id: string
  main_text: string
}

function RegisterForm() {
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
  const [wantShop, setWantShop] = useState(false)
  
  // Google Places autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingAddressSuggestions, setLoadingAddressSuggestions] = useState(false)
  const addressInputRef = useRef<HTMLDivElement>(null)
  let placesServiceRef = useRef<any>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: 'AL',
    city: '',
    address: '',
    acceptTerms: false,
    acceptsMarketing: true,
    // Shop fields
    shopName: '',
    taxId: '',
  })

  // Initialize Google Places
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAm84VWx-I7RepRrlQWR-yjcNbrzZLd-cM&libraries=places`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      
      script.onload = () => {
        if ((window as any).google) {
          placesServiceRef.current = new (window as any).google.maps.places.AutocompleteService()
        }
      }
    } else if ((window as any).google && !placesServiceRef.current) {
      placesServiceRef.current = new (window as any).google.maps.places.AutocompleteService()
    }
  }, [])

  // Handle address input with Google Places autocomplete
  const handleAddressInput = useCallback(async (value: string) => {
    setFormData(prev => ({ ...prev, address: value }))
    setError('')

    if (!value || value.length < 3) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (!placesServiceRef.current) return

    setLoadingAddressSuggestions(true)
    try {
      const predictions = await placesServiceRef.current.getPlacePredictions({
        input: value,
        componentRestrictions: {
          country: formData.country.toLowerCase()
        }
      })

      if (predictions.predictions) {
        setAddressSuggestions(predictions.predictions)
        setShowSuggestions(true)
      }
    } catch (err) {
      console.error('Error fetching address predictions:', err)
    } finally {
      setLoadingAddressSuggestions(false)
    }
  }, [formData.country])

  // Handle address selection from suggestions
  const handleAddressSelect = (prediction: PlacePrediction) => {
    setFormData(prev => ({ ...prev, address: prediction.description }))
    setShowSuggestions(false)
    setAddressSuggestions([])
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const inputElement = e.target as HTMLInputElement
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? inputElement.checked : value
    }))
    
    if (name === 'password') {
      setPasswordValidation(validatePassword(value))
    }
    
    setError('')
  }

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return false
    }
    if (!formData.username.trim()) {
      setError('Username is required')
      return false
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters')
      return false
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0])
      return false
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return false
    }
    if (!isValidAlbanianPhone(formData.phone)) {
      setError('Phone number must be in format 069 or +355 69')
      return false
    }
    if (!formData.city.trim()) {
      setError('City is required')
      return false
    }
    if (!formData.address.trim()) {
      setError('Address is required')
      return false
    }
    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions')
      return false
    }

    // Shop validation
    if (wantShop) {
      if (!formData.shopName.trim()) {
        setError('Shop name is required')
        return false
      }
      if (!formData.taxId.trim()) {
        setError('Tax ID is required')
        return false
      }
      if (!/^\d{10}$/.test(formData.taxId.replace(/\s/g, ''))) {
        setError('Tax ID must be exactly 10 digits')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShowDuplicateAlert(false)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const formattedPhone = formatPhoneNumber(formData.phone)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formattedPhone,
          createShop: wantShop,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setDuplicateMessage(data.error || 'Account already exists')
          setShowDuplicateAlert(true)
        } else {
          const errorMsg = data.details 
            ? `${data.error}\n\nDetails: ${data.details}`
            : (data.error || 'Something went wrong')
          setError(errorMsg)
          console.error('Registration error details:', data)
        }
        return
      }

      setRegisteredEmail(data.email)
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
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Code must be 6 digits')
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          verifyToken: verificationCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verification failed')
        return
      }

      window.location.href = '/auth/login?verified=true'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  if (success) {
    return (
      <div className="w-screen min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border-2 border-black p-8 mb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-50 border-2 border-green-600 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-black mb-4 uppercase tracking-wider">
              Verify Your Email
            </h2>
            <p className="text-center text-gray-700 mb-6 text-sm">
              We've sent a 6-digit code to <strong>{registeredEmail}</strong>. Please enter it below to verify your account.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border-2 border-black text-center text-2xl tracking-widest font-bold uppercase"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border-2 border-red-300">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full py-3 px-4 bg-black text-white font-bold uppercase text-sm tracking-wide hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-6">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-black font-bold hover:underline"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen min-h-screen bg-white flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <div className="border-2 border-black p-8 mb-6">
          <h1 className="text-3xl font-bold text-black mb-2 uppercase tracking-wider">
            Create Your Account
          </h1>
          <p className="text-gray-700 text-sm mb-6">
            Join Treigo to buy or sell premium items
          </p>

          {showDuplicateAlert && (
            <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-orange-900">{duplicateMessage}</p>
                <Link href="/auth/login" className="text-xs text-orange-900 hover:underline mt-1 inline-block">
                  Go to login
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name *"
                className="px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name *"
                className="px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
                required
              />
            </div>

            {/* Username */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username *"
              className="w-full px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email *"
              className="w-full px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
              required
            />

            {/* Password Fields */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password *"
                  className="w-full px-4 py-3 pr-12 border-2 border-black font-semibold text-sm uppercase tracking-wide"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Validation Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.password.length >= 8 ? 'border-green-600 bg-green-50' : 'border-gray-300'
                    }`}>
                      {formData.password.length >= 8 && <Check className="w-3 h-3 text-green-600" />}
                    </div>
                    <span className={formData.password.length >= 8 ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      /[A-Z]/.test(formData.password) ? 'border-green-600 bg-green-50' : 'border-gray-300'
                    }`}>
                      {/[A-Z]/.test(formData.password) && <Check className="w-3 h-3 text-green-600" />}
                    </div>
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                      One uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      /[0-9]/.test(formData.password) ? 'border-green-600 bg-green-50' : 'border-gray-300'
                    }`}>
                      {/[0-9]/.test(formData.password) && <Check className="w-3 h-3 text-green-600" />}
                    </div>
                    <span className={/[0-9]/.test(formData.password) ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                      One number (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'border-green-600 bg-green-50' : 'border-gray-300'
                    }`}>
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) && <Check className="w-3 h-3 text-green-600" />}
                    </div>
                    <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                      One special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              )}

              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password *"
                className="w-full px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
                required
              />
            </div>

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (069 or +355) *"
              className="w-full px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
              required
            />

            {/* Country & City */}
            <div className="grid grid-cols-2 gap-4">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City *"
                className="px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
                required
              />
            </div>

            {/* Address with Google Maps */}
            <div>
              <div ref={addressInputRef} className="relative">
                <div className="flex items-center gap-2 px-4 py-3 border-2 border-black bg-white">
                  <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={(e) => handleAddressInput(e.target.value)}
                    onFocus={() => formData.address && setShowSuggestions(true)}
                    placeholder="Address (search & select from Google Maps) *"
                    className="flex-1 bg-transparent outline-none font-semibold text-sm uppercase tracking-wide"
                    required
                  />
                  {formData.address && !loadingAddressSuggestions && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, address: '' }))}
                      className="text-gray-400 hover:text-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {loadingAddressSuggestions && (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 border-2 border-t-0 border-black bg-white z-50 max-h-64 overflow-y-auto">
                    {addressSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        onClick={() => handleAddressSelect(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 text-sm transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs uppercase">{suggestion.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Shop Creation Checkbox */}
            <div className="border-2 border-black p-4 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wantShop}
                  onChange={(e) => setWantShop(e.target.checked)}
                  className="w-5 h-5 border-2 border-black bg-white cursor-pointer mt-0.5"
                />
                <span className="text-sm font-bold uppercase tracking-wide leading-tight">
                  I want to create a shop to sell items
                </span>
              </label>

              {/* Shop Fields */}
              {wantShop && (
                <div className="space-y-4 pt-4 border-t-2 border-black">
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="Shop Name *"
                    className="w-full px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
                  />
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="Tax ID (10 digits) *"
                    className="w-full px-4 py-3 border-2 border-black font-semibold text-sm uppercase tracking-wide"
                  />
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-5 h-5 border-2 border-black bg-white cursor-pointer mt-0.5"
                required
              />
              <span className="text-xs text-gray-700 leading-tight">
                I accept the{' '}
                <Link href="/terms" className="text-black font-bold hover:underline">
                  Terms & Conditions
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-black font-bold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Marketing Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptsMarketing"
                checked={formData.acceptsMarketing}
                onChange={handleChange}
                className="w-5 h-5 border-2 border-black bg-white cursor-pointer mt-0.5"
              />
              <span className="text-xs text-gray-700">
                Send me news and updates
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-black text-white font-bold uppercase text-sm tracking-wide hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-700">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-black font-bold hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
