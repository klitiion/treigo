'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, Save, AlertCircle, CheckCircle, Loader2, Check, X } from 'lucide-react'
import { validatePassword } from '@/lib/passwordValidator'
import { ProtectedRoute } from '@/hooks/useAuth'
import { Header } from '@/components/layout/Header'

interface UserSettings {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone?: string
  address?: string
  birthday?: string
  niptId?: string
  taxId?: string
  role: 'SELLER'
  acceptsMarketing: boolean
  usernameChangedAt?: string | Date
}

interface NotificationPreferences {
  emailChatMessages: boolean
  emailReminderEmails: boolean
  emailMarketingEmails: boolean
  emailOrderUpdates: boolean
  emailReviewRequests: boolean
  emailSecurityAlerts: boolean
  pushNotifications: boolean
}

export default function SellerSettingsPage() {
  return (
    <ProtectedRoute requiredRole="SELLER">
      <SellerSettings />
    </ProtectedRoute>
  )
}

function SellerSettings() {
  const router = useRouter()
  const [user, setUser] = useState<UserSettings | null>(null)
  const [tab, setTab] = useState<'account' | 'notifications' | 'privacy'>('account')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
  })

  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [usernameSuccess, setUsernameSuccess] = useState('')
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameSaving, setUsernameSaving] = useState(false)
  const [showUsernameEditor, setShowUsernameEditor] = useState(false)

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailChatMessages: true,
    emailReminderEmails: true,
    emailMarketingEmails: true,
    emailOrderUpdates: true,
    emailReviewRequests: true,
    emailSecurityAlerts: true,
    pushNotifications: true,
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
            birthday: userData.birthday || '',
          })
        }

        const prefsResponse = await fetch('/api/user/notification-preferences')
        if (prefsResponse.ok) {
          const prefs = await prefsResponse.json()
          setPreferences({
            emailChatMessages: prefs.emailChatMessages ?? true,
            emailReminderEmails: prefs.emailReminderEmails ?? true,
            emailMarketingEmails: prefs.emailMarketingEmails ?? true,
            emailOrderUpdates: prefs.emailOrderUpdates ?? true,
            emailReviewRequests: prefs.emailReviewRequests ?? true,
            emailSecurityAlerts: prefs.emailSecurityAlerts ?? true,
            pushNotifications: prefs.pushNotifications ?? true,
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

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      if (user) {
        const updatedUser = {
          ...user,
          ...profileForm,
        }
        setUser(updatedUser)
        localStorage.setItem('treigo_user', JSON.stringify(updatedUser))

        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (!passwordValidation.isValid) {
      setMessage({ type: 'error', text: 'Password does not meet requirements' })
      return
    }

    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPassword(false)
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setSaving(false)
    }
  }

  const handleCheckUsername = async (value: string) => {
    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      setUsernameAvailable(null)
      return
    }

    setUsernameChecking(true)
    try {
      const response = await fetch(`/api/user/check-username?username=${value}`)
      const data = await response.json()
      setUsernameAvailable(data.available)
      if (!data.available) {
        setUsernameError(data.message || 'Username is not available')
      } else {
        setUsernameError('')
      }
    } catch (error) {
      setUsernameError('Error checking availability')
    } finally {
      setUsernameChecking(false)
    }
  }

  const handleUpdateUsername = async () => {
    if (usernameAvailable === false) {
      setUsernameError('Please choose an available username')
      return
    }

    setUsernameSaving(true)
    try {
      const response = await fetch('/api/user/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email?.toLowerCase().trim(),
          newUsername: newUsername,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update username')
      }

      if (user) {
        const updatedUser = { ...user, username: newUsername }
        setUser(updatedUser)
        localStorage.setItem('treigo_user', JSON.stringify(updatedUser))
      }

      setUsernameSuccess('Username updated successfully!')
      setShowUsernameEditor(false)
      setNewUsername('')
      setTimeout(() => setUsernameSuccess(''), 3000)
    } catch (error) {
      setUsernameError((error as Error).message)
    } finally {
      setUsernameSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        <Link href="/seller/profile" className="inline-flex items-center gap-2 text-sm font-500 text-gray-600 hover:text-black transition-colors mb-12 uppercase tracking-wide">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-2">Personal Details</h1>
          <p className="text-gray-600 text-sm">Manage your personal information and preferences</p>
        </div>

        {message && (
          <div className={`mb-8 p-4 flex items-center gap-3 rounded-lg text-sm font-500 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-black mb-6">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">First Name</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">Last Name</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="+355 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">Birthday</label>
                <input
                  type="date"
                  value={profileForm.birthday}
                  onChange={(e) => setProfileForm({ ...profileForm, birthday: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Street address, city, country"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 bg-black text-white font-bold uppercase text-sm tracking-wide rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Username Section */}
          {!showUsernameEditor ? (
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wider">Username</h3>
                  <p className="text-gray-700 font-semibold mb-1">@{user.username}</p>
                  {user.usernameChangedAt && (
                    <p className="text-xs text-gray-600">Username can only be changed once</p>
                  )}
                </div>
                {!user.usernameChangedAt && (
                  <button
                    onClick={() => {
                      setShowUsernameEditor(true)
                      setNewUsername(user.username)
                    }}
                    className="px-4 py-2 border border-black text-black font-bold uppercase text-sm tracking-wide rounded-lg hover:bg-black hover:text-white transition-colors"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
              <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">Change Username</h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">New Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value)
                    handleCheckUsername(e.target.value)
                  }}
                  className="w-full border border-gray-200 rounded-lg p-3 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Choose a new username"
                />
                {newUsername && (
                  <div className={`text-sm font-semibold flex items-center gap-2 ${
                    usernameAvailable
                      ? 'text-green-600'
                      : usernameAvailable === false
                        ? 'text-red-600'
                        : ''
                  }`}>
                    {usernameChecking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Checking...
                      </>
                    ) : usernameAvailable ? (
                      <>
                        <Check className="w-4 h-4" />
                        Username available!
                      </>
                    ) : usernameAvailable === false ? (
                      <>
                        <X className="w-4 h-4" />
                        {usernameError}
                      </>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateUsername}
                  disabled={usernameSaving || !usernameAvailable || newUsername === user.username}
                  className="px-6 py-3 bg-black text-white font-bold uppercase text-sm tracking-wide rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {usernameSaving ? 'Updating...' : 'Confirm'}
                </button>
                <button
                  onClick={() => {
                    setShowUsernameEditor(false)
                    setNewUsername('')
                    setUsernameError('')
                    setUsernameAvailable(null)
                  }}
                  className="px-6 py-3 border border-black text-black font-bold uppercase text-sm tracking-wide rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Password Change */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-wider">Change Password</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      setPasswordValidation(validatePassword(e.target.value))
                    }}
                    className="w-full border border-gray-200 rounded-lg p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {passwordForm.newPassword && (
                  <div className="mt-3">
                    {passwordValidation.isValid ? (
                      <p className="text-sm text-green-600 font-semibold">✓ Password is strong</p>
                    ) : (
                      <ul className="text-sm text-red-600 space-y-1">
                        {passwordValidation.errors.map((err, idx) => (
                          <li key={idx}>❌ {err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">Confirm Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={saving}
              className="px-6 py-3 bg-black text-white font-bold uppercase text-sm tracking-wide rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Updating...' : 'Change Password'}
            </button>
          </div>

          {/* Notification Preferences */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-wider">Notifications</h2>

            <div className="space-y-4">
              {[
                {
                  key: 'emailChatMessages',
                  label: 'Chat Messages',
                  description: 'Get notified when buyers message you',
                },
                {
                  key: 'emailOrderUpdates',
                  label: 'Order Updates',
                  description: 'Receive alerts about your orders',
                },
                {
                  key: 'emailReviewRequests',
                  label: 'Review Requests',
                  description: 'Get notified when you receive reviews',
                },
                {
                  key: 'emailMarketingEmails',
                  label: 'Marketing Emails',
                  description: 'Promotional emails and special offers',
                },
                {
                  key: 'emailSecurityAlerts',
                  label: 'Security Alerts',
                  description: 'Important notifications about your account',
                },
                {
                  key: 'pushNotifications',
                  label: 'Push Notifications',
                  description: 'Browser push notifications',
                },
              ].map(pref => (
                <label key={pref.key} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[pref.key as keyof NotificationPreferences]}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        [pref.key]: e.target.checked,
                      })
                    }
                  />
                  <div>
                    <p className="font-semibold text-black">{pref.label}</p>
                    <p className="text-sm text-gray-600">{pref.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
