'use client'

import { useState, useEffect } from 'react'
import { BuyerLayout } from '@/components/layout/BuyerLayout'
import { ProtectedRoute } from '@/hooks/useAuth'
import { Eye, EyeOff, Save, AlertCircle, CheckCircle, Loader2, Copy, Check } from 'lucide-react'
import { validatePassword } from '@/lib/passwordValidator'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  country: string
  city: string
  address: string
  phone: string
}

export default function BuyerProfilePage() {
  return (
    <ProtectedRoute requiredRole="BUYER">
      <BuyerProfile />
    </ProtectedRoute>
  )
}

function BuyerProfile() {
  const [tab, setTab] = useState<'edit' | 'password' | 'reviews'>('edit')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState(0)

  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    country: 'AL',
    city: '',
    address: '',
    phone: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Username state
  const [username, setUsername] = useState('')
  const [usernameChangedAt, setUsernameChangedAt] = useState<Date | null>(null)
  const [showUsernameEditor, setShowUsernameEditor] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [usernameSuccess, setUsernameSuccess] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameSaving, setUsernameSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Load user profile from localStorage
    const user = localStorage.getItem('treigo_user')
    if (user) {
      const parsed = JSON.parse(user)
      setProfile({
        firstName: parsed.name || parsed.firstName || '',
        lastName: parsed.lastName || '',
        email: parsed.email || '',
        dateOfBirth: parsed.dateOfBirth || '',
        country: parsed.country || 'AL',
        city: parsed.city || '',
        address: parsed.address || '',
        phone: parsed.phone || '',
      })
      // Load username and usernameChangedAt
      setUsername(parsed.username || '')
      if (parsed.usernameChangedAt) {
        setUsernameChangedAt(new Date(parsed.usernameChangedAt))
      }
    }
    
    // Check for pending email verification
    const pendingEmailChange = localStorage.getItem('pending_email_change')
    if (pendingEmailChange) {
      const { newEmail } = JSON.parse(pendingEmailChange)
      setPendingEmail(newEmail)
    }
    
    // Check if email was just verified
    const verifiedEmail = localStorage.getItem('email_verified')
    if (verifiedEmail) {
      setMessage({
        type: 'success',
        text: `Email successfully verified! Your account now uses ${verifiedEmail}`,
      })
      localStorage.removeItem('email_verified')
    }
    
    setLoading(false)
  }, [])

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
    setMessage(null)
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

  const handleSaveProfile = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const user = JSON.parse(localStorage.getItem('treigo_user') || '{}')
      const emailChanged = user.email !== profile.email

      // Save other profile data to localStorage immediately
      const updatedUser = {
        ...user,
        name: profile.firstName,
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth,
        country: profile.country,
        city: profile.city,
        address: profile.address,
        phone: profile.phone,
        // DON'T update email yet if it changed - wait for verification
      }
      
      localStorage.setItem('treigo_user', JSON.stringify(updatedUser))

      // If email changed, send verification email
      if (emailChanged) {
        // Store pending email change
        localStorage.setItem('pending_email_change', JSON.stringify({
          newEmail: profile.email,
          oldEmail: user.email,
        }))
        
        const response = await fetch('/api/auth/send-email-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newEmail: profile.email,
            oldEmail: user.email,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send verification email')
        }

        setPendingEmail(profile.email)
        setMessage({
          type: 'success',
          text: `Verification email sent to ${profile.email}. Please click the link in the email to confirm the email change. Your current email remains active until verified.`,
        })
        
        // Revert email field to old email for now
        setProfile(prev => ({
          ...prev,
          email: user.email,
        }))
      } else {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully!',
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.',
      })
    } finally {
      setSaving(false)
    }
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
      // TODO: Make API call to change password
      // await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordForm.currentPassword,
      //     newPassword: passwordForm.newPassword,
      //   }),
      // })

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
        text: 'Dicka shkoi keq. Provo përsëri.',
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
    if (!profile.email || !newUsername.trim()) {
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
          email: profile.email.toLowerCase().trim(),
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
        
        // Update user in localStorage
        const storedUser = JSON.parse(localStorage.getItem('treigo_user') || '{}')
        const updatedUser = { ...storedUser, username: data.username, usernameChangedAt: new Date() }
        localStorage.setItem('treigo_user', JSON.stringify(updatedUser))
        setUsername(data.username)
        setUsernameChangedAt(new Date())
      }
    } catch (error) {
      console.error('Error updating username:', error)
      setUsernameError('Something went wrong. Please try again.')
    } finally {
      setUsernameSaving(false)
    }
  }

  const handleCopyUsername = () => {
    if (username) {
      navigator.clipboard.writeText(username)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-treigo-sage border-t-treigo-forest rounded-full animate-spin" />
        </div>
      </BuyerLayout>
    )
  }

  return (
    <BuyerLayout>
      <div className="min-h-screen bg-white py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <h1 className="text-5xl lg:text-6xl font-900 text-black mb-4 uppercase tracking-tight">MY PROFILE</h1>
          <p className="text-gray-600 mb-12 uppercase text-sm tracking-wide font-semibold">Manage your account settings and preferences</p>

          {/* Message */}
          {message && (
            <div
              className={`mb-8 p-6 flex items-start gap-4 border-2 ${
                message.type === 'success'
                  ? 'bg-white border-black text-black'
                  : 'bg-white border-red-500 text-red-600'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              )}
              <p className="font-semibold uppercase text-sm tracking-wide">{message.text}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-12 border-b-2 border-black">
            <button
              onClick={() => setTab('edit')}
              className={`px-6 py-4 font-bold uppercase tracking-wide text-sm transition-all ${
                tab === 'edit'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              EDIT PROFILE
            </button>
            <button
              onClick={() => setTab('password')}
              className={`px-6 py-4 font-bold uppercase tracking-wide text-sm transition-all ${
                tab === 'password'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              SETTINGS
            </button>
            <button
              onClick={() => setTab('reviews')}
              className={`px-6 py-4 font-bold uppercase tracking-wide text-sm transition-all ${
                tab === 'reviews'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              REVIEWS & RATING
            </button>
          </div>

          {/* Edit Profile */}
          {tab === 'edit' && (
            <div className="border-2 border-black p-8 max-w-2xl">
              <h2 className="font-bold text-black mb-8 text-lg uppercase tracking-wide">EDIT PROFILE</h2>
              
              <div className="space-y-8">
                {/* First Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                  {pendingEmail && (
                    <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                      <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">
                        ⏳ Email Verification Pending
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        A verification email has been sent to <strong>{pendingEmail}</strong>. 
                        Click the verification link in the email to confirm this change.
                      </p>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    City
                  </label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => handleProfileChange('city', e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                </div>

                {/* Username Section */}
                <div className="pt-8 border-t-2 border-gray-300">
                  <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-4">YOUR USERNAME</h3>
                  
                  {usernameChangedAt ? (
                    // Username already changed - display only
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        <AlertCircle className="w-4 h-4 inline mr-2 text-orange-600" />
                        <span className="text-orange-600 font-semibold">
                          You have already changed your username once. You cannot change it again.
                        </span>
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 px-4 py-3 border-2 border-black bg-gray-50">
                          <p className="text-lg font-bold text-black">@{username}</p>
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
                    // Username can be changed
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Your username is unique and used for your public profile. You can change it once.
                      </p>

                      {!showUsernameEditor ? (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 px-4 py-3 border-2 border-black bg-gray-50">
                              <p className="text-lg font-bold text-black">@{username}</p>
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
                          {/* Warning Messages */}
                          <div className="space-y-3">
                            <div className="p-4 border-l-4 border-orange-600 bg-orange-50">
                              <p className="text-sm font-semibold text-orange-800">
                                ⚠️ Important: Do not use your real name in your username
                              </p>
                              <p className="text-xs text-orange-700 mt-1">
                                Your username is public and visible to all users. For privacy and security, avoid using your real name.
                              </p>
                            </div>

                            <div className="p-4 border-l-4 border-red-600 bg-red-50">
                              <p className="text-sm font-semibold text-red-800">
                                ⚠️ Important: You can only change your username once
                              </p>
                              <p className="text-xs text-red-700 mt-1">
                                Once you change your username, it cannot be changed again. Choose wisely!
                              </p>
                            </div>
                          </div>

                          {/* Username Input */}
                          <div>
                            <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                              NEW USERNAME
                            </label>
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
                                  placeholder="e.g., alex_reader, creative_mind"
                                  className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
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

                            {/* Validation Messages */}
                            {usernameError && (
                              <p className="text-sm text-red-600 mt-2">❌ {usernameError}</p>
                            )}
                            {usernameAvailable === true && !usernameError && (
                              <p className="text-sm text-green-600 mt-2">✓ Username is available!</p>
                            )}

                            {/* Username Requirements */}
                            <p className="text-xs text-gray-600 mt-3">
                              Requirements: 3-20 characters, letters, numbers, and underscores only. Cannot start with a number.
                            </p>
                          </div>

                          {/* Success Message */}
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

                {/* Save Button */}
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      SAVING...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      SAVE CHANGES
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Settings */}
          {tab === 'password' && (
            <div className="bg-white border-2 border-black p-8 max-w-2xl">
              <h2 className="font-bold text-black mb-8 text-lg uppercase tracking-wide">CHANGE PASSWORD</h2>
              
              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  {passwordForm.newPassword && (
                    <div className="space-y-2 p-4 mt-4 bg-white border border-gray-300">
                      <p className="text-xs font-bold text-black uppercase tracking-wide">PASSWORD REQUIREMENTS:</p>
                      <ul className="space-y-2 text-xs">
                        <li
                          className={`flex items-center gap-2 ${
                            passwordForm.newPassword.length >= 8
                              ? 'text-black'
                              : 'text-gray-500'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 border border-black flex items-center justify-center text-xs ${
                              passwordForm.newPassword.length >= 8
                                ? 'bg-black text-white'
                                : 'bg-white'
                            }`}
                          >
                            {passwordForm.newPassword.length >= 8 ? '✓' : ''}
                          </span>
                          Minimum 8 characters
                        </li>
                        <li
                          className={`flex items-center gap-2 ${
                            /[A-Z]/.test(passwordForm.newPassword)
                              ? 'text-black'
                              : 'text-gray-500'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 border border-black flex items-center justify-center text-xs ${
                              /[A-Z]/.test(passwordForm.newPassword)
                                ? 'bg-black text-white'
                                : 'bg-white'
                            }`}
                          >
                            {/[A-Z]/.test(passwordForm.newPassword) ? '✓' : ''}
                          </span>
                          One uppercase letter
                        </li>
                        <li
                          className={`flex items-center gap-2 ${
                            /[0-9]/.test(passwordForm.newPassword)
                              ? 'text-black'
                              : 'text-gray-500'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 border border-black flex items-center justify-center text-xs ${
                              /[0-9]/.test(passwordForm.newPassword)
                                ? 'bg-black text-white'
                                : 'bg-white'
                            }`}
                          >
                            {/[0-9]/.test(passwordForm.newPassword) ? '✓' : ''}
                          </span>
                          One number
                        </li>
                        <li
                          className={`flex items-center gap-2 ${
                            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                              passwordForm.newPassword
                            )
                              ? 'text-black'
                              : 'text-gray-500'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 border border-black flex items-center justify-center text-xs ${
                              /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                                passwordForm.newPassword
                              )
                                ? 'bg-black text-white'
                                : 'bg-white'
                            }`}
                          >
                            {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                              passwordForm.newPassword
                            )
                              ? '✓'
                              : ''}
                          </span>
                          One special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-600 text-black mb-3">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                  />
                  {passwordForm.newPassword && passwordForm.confirmPassword && (
                    <p
                      className={`text-xs mt-3 font-semibold uppercase tracking-wide ${
                        passwordForm.newPassword === passwordForm.confirmPassword
                          ? 'text-black'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordForm.newPassword === passwordForm.confirmPassword
                        ? '✓ MATCH'
                        : '✗ DO NOT MATCH'}
                    </p>
                  )}
                </div>

                {/* Change Button */}
                <button
                  onClick={handleChangePassword}
                  disabled={
                    saving ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword ||
                    !passwordValidation.isValid
                  }
                  className="w-full py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm mt-4"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      CHANGING...
                    </>
                  ) : (
                    'CHANGE PASSWORD'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {tab === 'reviews' && (
            <div className="border-2 border-black p-8 max-w-3xl w-full">
              <h2 className="font-bold text-black mb-8 text-lg uppercase tracking-wide">MY BUYER RATING</h2>
              
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b-2 border-black">
                <div className="text-center">
                  <p className="text-5xl font-bold text-black mb-2">{averageRating.toFixed(1)}</p>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={i <= Math.round(averageRating) ? 'text-yellow-400 text-2xl' : 'text-gray-300 text-2xl'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-black mb-1">{reviews.length}</p>
                  <p className="text-sm text-gray-600">Total Reviews from Sellers</p>
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-black mb-3">Positive</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reviews.filter(r => r.rating >= 4).length}
                  </p>
                </div>
              </div>

              {/* Reviews List */}
              <div>
                <h3 className="font-bold text-black mb-6 text-base uppercase tracking-wide">REVIEWS FROM SELLERS</h3>
                
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-black mb-2">
                              {review.author.firstName} {review.author.lastName}
                            </h4>
                            <div className="flex gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <span
                                  key={i}
                                  className={i <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {review.title && (
                          <h5 className="font-semibold text-black mb-2">{review.title}</h5>
                        )}
                        
                        <p className="text-base text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-12">No reviews yet. Complete your first purchase to receive reviews from sellers!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </BuyerLayout>
  )
}
