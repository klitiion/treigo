'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Check, Bell, Shield, User, Ticket, Eye, EyeOff, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { validatePassword } from '@/lib/passwordValidator'
import { ProtectedRoute } from '@/hooks/useAuth'

interface UserSettings {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone?: string
  address?: string
  role: 'BUYER'
  acceptsMarketing: boolean
  usernameChangedAt?: string | Date
}

interface NotificationPreferences {
  emailOrderUpdates: boolean
  emailPromotions: boolean
  emailNewsletter: boolean
  pushNotifications: boolean
}

interface Coupon {
  id: string
  code: string
  discount: number
  expiryDate: string
  isUsed: boolean
  description: string
}

export default function BuyerProfilePage() {
  return (
    <ProtectedRoute requiredRole="BUYER">
      <BuyerProfile />
    </ProtectedRoute>
  )
}

function BuyerProfile() {
  const router = useRouter()
  const [user, setUser] = useState<UserSettings | null>(null)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailOrderUpdates: true,
    emailPromotions: true,
    emailNewsletter: true,
    pushNotifications: true,
  })
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'WELCOME10',
      discount: 10,
      expiryDate: '2026-12-31',
      isUsed: false,
      description: '10% off on your first order'
    },
    {
      id: '2',
      code: 'SAVE20',
      discount: 20,
      expiryDate: '2026-06-30',
      isUsed: true,
      description: '20% off on orders over €50'
    },
    {
      id: '3',
      code: 'SHIP50',
      discount: 50,
      expiryDate: '2026-08-15',
      isUsed: false,
      description: 'Free shipping on orders over €100'
    },
  ])
  const [tab, setTab] = useState<'account' | 'coupons' | 'notifications' | 'privacy'>('account')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))
  const [copied, setCopied] = useState(false)
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null)

  // Username editing state
  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [usernameSuccess, setUsernameSuccess] = useState('')
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameSaving, setUsernameSaving] = useState(false)
  const [showUsernameEditor, setShowUsernameEditor] = useState(false)

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('treigo_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setProfileForm({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
          })
        }

        // Fetch notification preferences from API
        const prefsResponse = await fetch('/api/user/notification-preferences')
        if (prefsResponse.ok) {
          const prefs = await prefsResponse.json()
          setPreferences({
            emailOrderUpdates: prefs.emailOrderUpdates ?? true,
            emailPromotions: prefs.emailPromotions ?? true,
            emailNewsletter: prefs.emailNewsletter ?? true,
            pushNotifications: prefs.pushNotifications ?? true
          })
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleProfileFieldChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }))
    setMessage(null)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const storedUser = JSON.parse(localStorage.getItem('treigo_user') || '{}')
      
      const updatedUser = {
        ...storedUser,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phone: profileForm.phone,
        address: profileForm.address,
      }
      
      localStorage.setItem('treigo_user', JSON.stringify(updatedUser))
      setUser(updatedUser as UserSettings)

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    
    if (field === 'newPassword') {
      setPasswordValidation(validatePassword(value))
    }
    setMessage(null)
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match',
      })
      return
    }

    if (!passwordValidation.isValid) {
      setMessage({
        type: 'error',
        text: passwordValidation.errors[0],
      })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      setMessage({
        type: 'success',
        text: 'Password changed successfully!',
      })
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCheckUsername = async (usernameText: string) => {
    if (!usernameText) {
      setUsernameAvailable(null)
      setUsernameError('')
      return
    }

    setUsernameChecking(true)
    setUsernameError('')
    setUsernameSuccess('')

    try {
      const response = await fetch('/api/user/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameText.trim() })
      })

      const data = await response.json()

      if (!response.ok || !data.available) {
        setUsernameAvailable(false)
        setUsernameError(data.message || data.errors?.[0] || 'This username is not available')
      } else {
        setUsernameAvailable(true)
        setUsernameError('')
      }
    } catch (error) {
      console.error('Error checking username:', error)
      setUsernameError('Failed to check username availability')
      setUsernameAvailable(false)
    } finally {
      setUsernameChecking(false)
    }
  }

  const handleUpdateUsername = async () => {
    if (!user || !newUsername.trim()) {
      setUsernameError('Please enter a username')
      return
    }

    if (usernameAvailable !== true) {
      setUsernameError('Please verify that your username is available before saving')
      return
    }

    setUsernameSaving(true)
    setUsernameError('')
    setUsernameSuccess('')

    try {
      const response = await fetch('/api/user/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email.toLowerCase().trim(),
          username: newUsername.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setUsernameError(data.error || 'Failed to update username')
      } else {
        setUsernameSuccess('Username updated successfully!')
        setNewUsername('')
        setShowUsernameEditor(false)
        setUsernameAvailable(null)
        
        const storedUser = JSON.parse(localStorage.getItem('treigo_user') || '{}')
        const updatedUser = { ...storedUser, username: data.username, usernameChangedAt: new Date() }
        localStorage.setItem('treigo_user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    } catch (error) {
      console.error('Error updating username:', error)
      setUsernameError('Something went wrong. Please try again.')
    } finally {
      setUsernameSaving(false)
    }
  }

  const handleCopyUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyCoupon = (couponCode: string, couponId: string) => {
    navigator.clipboard.writeText(couponCode)
    setCopiedCouponId(couponId)
    setTimeout(() => setCopiedCouponId(null), 2000)
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/notification-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      })

      if (response.ok) {
        setSaving(false)
        setMessage({
          type: 'success',
          text: 'Preferences saved successfully!'
        })
      } else {
        throw new Error('Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      setMessage({
        type: 'error',
        text: 'Failed to save preferences. Please try again.'
      })
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-black rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 text-black font-bold uppercase text-xs tracking-wide hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
          <h1 className="text-3xl font-bold text-black uppercase tracking-wide">MY ACCOUNT</h1>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div
              className={`p-4 flex items-start gap-4 border-l-4 ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-600 text-green-800'
                  : 'bg-red-50 border-red-600 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="font-semibold text-sm">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="space-y-2 sticky top-8">
              <button
                onClick={() => setTab('account')}
                className={`w-full px-4 py-3 text-left font-bold uppercase text-xs tracking-wide transition-colors ${
                  tab === 'account'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  ACCOUNT
                </div>
              </button>

              <button
                onClick={() => setTab('coupons')}
                className={`w-full px-4 py-3 text-left font-bold uppercase text-xs tracking-wide transition-colors ${
                  tab === 'coupons'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  COUPONS
                </div>
              </button>

              <button
                onClick={() => setTab('notifications')}
                className={`w-full px-4 py-3 text-left font-bold uppercase text-xs tracking-wide transition-colors ${
                  tab === 'notifications'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  NOTIFICATIONS
                </div>
              </button>

              <button
                onClick={() => setTab('privacy')}
                className={`w-full px-4 py-3 text-left font-bold uppercase text-xs tracking-wide transition-colors ${
                  tab === 'privacy'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  PRIVACY
                </div>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Account Settings */}
            {tab === 'account' && (
              <div className="bg-white border border-gray-200 p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">PERSONAL INFORMATION</h2>
                  
                  <div className="space-y-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">FIRST NAME</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => handleProfileFieldChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">LAST NAME</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => handleProfileFieldChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">EMAIL</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">PHONE</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                        placeholder="+355 XX XXX XXXX"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">ADDRESS</label>
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => handleProfileFieldChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                        placeholder="Street address, city, country"
                      />
                    </div>

                    {/* Save Profile Button */}
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full py-3 bg-black text-white font-bold uppercase text-xs tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          SAVING...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          SAVE PROFILE
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-black uppercase tracking-wide mb-4">CHANGE PASSWORD</h3>
                  
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">CURRENT PASSWORD</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                        >
                          {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">NEW PASSWORD</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                      {passwordForm.newPassword && (
                        <div className="mt-2">
                          {passwordValidation.isValid ? (
                            <p className="text-xs text-green-600">✓ Password is strong</p>
                          ) : (
                            <ul className="text-xs text-red-600 space-y-1">
                              {passwordValidation.errors.map((err, idx) => (
                                <li key={idx}>❌ {err}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">CONFIRM PASSWORD</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Change Password Button */}
                    <button
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="w-full py-3 bg-black text-white font-bold uppercase text-xs tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          CHANGING...
                        </>
                      ) : (
                        'CHANGE PASSWORD'
                      )}
                    </button>
                  </div>
                </div>

                {/* Username Section */}
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-black uppercase tracking-wide mb-4">YOUR USERNAME</h3>
                  
                  {user.usernameChangedAt ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        <AlertCircle className="w-4 h-4 inline mr-2 text-orange-600" />
                        <span className="text-orange-600 font-semibold">
                          You have already changed your username once. You cannot change it again.
                        </span>
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 px-4 py-3 border-2 border-black bg-gray-50">
                          <p className="text-lg font-bold text-black">@{user.username}</p>
                        </div>
                        <button 
                          onClick={handleCopyUsername}
                          className="px-6 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" />
                              COPIED
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              COPY
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Your username is unique and used for your public profile. You can change it once.
                      </p>

                      {!showUsernameEditor ? (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 px-4 py-3 border-2 border-black bg-gray-50">
                              <p className="text-lg font-bold text-black">@{user.username}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={handleCopyUsername}
                                className="px-6 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                              >
                                {copied ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    COPIED
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    COPY
                                  </>
                                )}
                              </button>
                              <button 
                                onClick={() => {
                                  setShowUsernameEditor(true)
                                  setNewUsername('')
                                  setUsernameError('')
                                  setUsernameSuccess('')
                                  setUsernameAvailable(null)
                                }}
                                className="px-6 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-colors"
                              >
                                CHANGE
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Warnings */}
                          <div className="space-y-3">
                            <div className="p-4 border-l-4 border-orange-600 bg-orange-50">
                              <p className="text-sm font-semibold text-orange-800">⚠️ Do not use your real name</p>
                              <p className="text-xs text-orange-700 mt-1">Your username is public. Avoid using your real name for privacy and security.</p>
                            </div>
                            <div className="p-4 border-l-4 border-red-600 bg-red-50">
                              <p className="text-sm font-semibold text-red-800">⚠️ You can only change once</p>
                              <p className="text-xs text-red-700 mt-1">Once changed, it cannot be changed again. Choose wisely!</p>
                            </div>
                          </div>

                          {/* Username Input */}
                          <div>
                            <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">NEW USERNAME</label>
                            <div className="flex gap-2 items-start">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={newUsername}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    setNewUsername(value)
                                    if (value.length > 0) {
                                      handleCheckUsername(value)
                                    } else {
                                      setUsernameAvailable(null)
                                      setUsernameError('')
                                    }
                                  }}
                                  placeholder="e.g., fashion_lover, tech_enthusiast"
                                  className="w-full px-4 py-3 border-2 border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                                />
                                {usernameChecking && (
                                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Checking availability...
                                  </p>
                                )}
                              </div>
                              {usernameAvailable === true && (
                                <div className="text-green-600 font-bold mt-3">
                                  <Check className="w-6 h-6" />
                                </div>
                              )}
                            </div>

                            {usernameError && (
                              <p className="text-sm text-red-600 mt-2">❌ {usernameError}</p>
                            )}
                            {usernameAvailable === true && !usernameError && (
                              <p className="text-sm text-green-600 mt-2">✓ Username is available!</p>
                            )}
                            <p className="text-xs text-gray-600 mt-3">3-20 characters, letters, numbers, underscores only. No numbers at start.</p>
                          </div>

                          {usernameSuccess && (
                            <div className="p-4 border-l-4 border-green-600 bg-green-50">
                              <p className="text-sm font-semibold text-green-800">✓ {usernameSuccess}</p>
                            </div>
                          )}

                          {/* Buttons */}
                          <div className="flex gap-3 pt-4">
                            <button
                              onClick={handleUpdateUsername}
                              disabled={usernameAvailable !== true || usernameSaving}
                              className="px-6 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {usernameSaving ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  SAVING...
                                </>
                              ) : (
                                'SAVE USERNAME'
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowUsernameEditor(false)
                                setNewUsername('')
                                setUsernameError('')
                                setUsernameSuccess('')
                                setUsernameAvailable(null)
                              }}
                              className="px-6 py-3 border-2 border-gray-300 text-black font-bold uppercase text-xs tracking-wide hover:border-black transition-colors"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Coupons */}
            {tab === 'coupons' && (
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">MY COUPONS</h2>
                <p className="text-sm text-gray-600 mb-8">Available coupons and promotional codes you can use on your orders.</p>

                {coupons.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-none">
                    <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">No coupons available</p>
                    <p className="text-sm text-gray-500 mt-2">Check back later for exclusive offers</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className={`p-6 border-2 transition-colors ${
                          coupon.isUsed
                            ? 'border-gray-300 bg-gray-50 opacity-60'
                            : 'border-black hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-black uppercase tracking-wide">{coupon.code}</h3>
                              {coupon.isUsed && (
                                <span className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-bold uppercase rounded-none">
                                  Used
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Discount: <span className="font-bold text-black">{coupon.discount}%</span></span>
                              <span>Expires: <span className="font-bold text-black">{coupon.expiryDate}</span></span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopyCoupon(coupon.code, coupon.id)}
                            disabled={coupon.isUsed}
                            className={`px-6 py-3 border-2 font-bold uppercase text-xs tracking-wide transition-colors flex items-center gap-2 ${
                              coupon.isUsed
                                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                : 'border-black text-black hover:bg-black hover:text-white'
                            }`}
                          >
                            {copiedCouponId === coupon.id ? (
                              <>
                                <Check className="w-4 h-4" />
                                COPIED
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                COPY
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            {tab === 'notifications' && (
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">NOTIFICATION PREFERENCES</h2>
                <p className="text-sm text-gray-600 mb-8">Choose which emails and notifications you'd like to receive.</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-4">EMAIL NOTIFICATIONS</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailOrderUpdates', label: 'ORDER UPDATES', description: 'Get notified when your orders are shipped or delivered' },
                        { key: 'emailPromotions', label: 'PROMOTIONS', description: 'Receive exclusive deals and promotional offers' },
                        { key: 'emailNewsletter', label: 'NEWSLETTER', description: 'Get our weekly newsletter with new products and tips' },
                      ].map(({ key, label, description }) => (
                        <label key={key} className="flex items-start gap-3 p-4 border border-gray-200 hover:border-black cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={preferences[key as keyof NotificationPreferences]}
                            onChange={(e) => setPreferences(prev => ({ ...prev, [key]: e.target.checked }))}
                            style={{ marginTop: '2px' }}
                          />
                          <div className="flex-1">
                            <p className="font-bold text-black uppercase text-xs tracking-wide">{label}</p>
                            <p className="text-sm text-gray-600">{description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="w-full py-3 bg-black text-white font-bold uppercase text-xs tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        SAVING...
                      </>
                    ) : (
                      'SAVE PREFERENCES'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy */}
            {tab === 'privacy' && (
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">PRIVACY & DATA</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Your privacy is important to us. We protect your personal data according to our privacy policy.</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Your email and personal information are encrypted</li>
                    <li>We never sell your data to third parties</li>
                    <li>You can request data deletion at any time</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
