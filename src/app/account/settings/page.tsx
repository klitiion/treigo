'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Check, Bell, Shield, User, MessageSquare, AlertCircle, Loader2 } from 'lucide-react'

interface UserSettings {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone?: string
  city?: string
  country?: string
  role: 'BUYER' | 'SELLER'
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

interface Conversation {
  id: string
  user1: { id: string; firstName: string; lastName: string; username: string }
  user2: { id: string; firstName: string; lastName: string; username: string }
  lastMessage?: string
  lastMessageAt?: string
  lastMessageBy?: string
  product?: { id: string; title: string }
  shop?: { id: string; name: string }
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserSettings | null>(null)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailChatMessages: true,
    emailReminderEmails: true,
    emailMarketingEmails: true,
    emailOrderUpdates: true,
    emailReviewRequests: true,
    emailSecurityAlerts: true,
    pushNotifications: true,
  })
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [tab, setTab] = useState<'account' | 'notifications' | 'privacy' | 'chats'>('account')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Username editing state
  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [usernameSuccess, setUsernameSuccess] = useState('')
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameSaving, setUsernameSaving] = useState(false)
  const [showUsernameEditor, setShowUsernameEditor] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('treigo_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }

        // Fetch notification preferences from API
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
            pushNotifications: prefs.pushNotifications ?? true
          })
        }

        // Fetch conversations
        const convsResponse = await fetch('/api/conversations')
        if (convsResponse.ok) {
          const convs = await convsResponse.json()
          setConversations(convs)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleCopyUsername = () => {
    if (user) {
      navigator.clipboard.writeText(user.username)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
        // Show success message
        alert('Preferences saved successfully!')
      } else {
        throw new Error('Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Failed to save preferences. Please try again.')
      setSaving(false)
    }
  }

  const handleCheckUsername = async (username: string) => {
    if (!username) {
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
        body: JSON.stringify({ username: username.trim() })
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
        
        // Update user in state
        const updatedUser = { ...user, username: data.username, usernameChangedAt: new Date() }
        setUser(updatedUser)
        
        // Update localStorage
        localStorage.setItem('treigo_user', JSON.stringify(updatedUser))
        
        // Redirect to new profile URL after a delay
        setTimeout(() => {
          router.push(`/profile/@${data.username}`)
        }, 2000)
      }
    } catch (error) {
      console.error('Error updating username:', error)
      setUsernameError('Something went wrong. Please try again.')
    } finally {
      setUsernameSaving(false)
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
          <Link href={`/profile/@${user.username}`} className="flex items-center gap-2 text-black font-bold uppercase text-xs tracking-wide hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
          <h1 className="text-3xl font-bold text-black uppercase tracking-wide">ACCOUNT SETTINGS</h1>
        </div>
      </div>

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

              <button
                onClick={() => setTab('chats')}
                className={`w-full px-4 py-3 text-left font-bold uppercase text-xs tracking-wide transition-colors ${
                  tab === 'chats'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  CHATS
                </div>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Account Settings Tab */}
            {tab === 'account' && (
              <div className="bg-white border border-gray-200 p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">PERSONAL INFORMATION</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">FIRST NAME</label>
                      <input
                        type="text"
                        defaultValue={user.firstName}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">LAST NAME</label>
                      <input
                        type="text"
                        defaultValue={user.lastName}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">EMAIL</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">PHONE</label>
                      <input
                        type="tel"
                        defaultValue={user.phone || ''}
                        className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                        placeholder="+355 XX XXX XXXX"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">CITY</label>
                        <input
                          type="text"
                          defaultValue={user.city || ''}
                          className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                          placeholder="Tirana"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">COUNTRY</label>
                        <input
                          type="text"
                          defaultValue={user.country || ''}
                          className="w-full px-4 py-3 border border-gray-300 font-bold text-black placeholder-gray-400 focus:outline-none focus:border-black"
                          placeholder="Albania"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Username Section */}
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-black uppercase tracking-wide mb-4">YOUR USERNAME</h3>
                  
                  {user.usernameChangedAt ? (
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
                      <p className="text-xs text-gray-600 mt-3">Your profile URL: <code className="text-black font-bold">treigo.com/profile/@{user.username}</code></p>
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
                          <p className="text-xs text-gray-600">Your profile URL: <code className="text-black font-bold">treigo.com/profile/@{user.username}</code></p>
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
                            <label className="block text-sm font-bold text-black uppercase tracking-wide mb-2">
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
              </div>
            )}

            {/* Notifications Tab */}
            {tab === 'notifications' && (
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">NOTIFICATION PREFERENCES</h2>
                <p className="text-sm text-gray-600 mb-8">Choose which emails and notifications you'd like to receive. We respect your privacy and will never sell your data.</p>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-4">EMAIL NOTIFICATIONS</h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: 'emailChatMessages',
                          label: 'NEW MESSAGES',
                          description: 'Get notified when someone sends you a message'
                        },
                        {
                          key: 'emailOrderUpdates',
                          label: 'ORDER UPDATES',
                          description: 'Receive updates when your order status changes'
                        },
                        {
                          key: 'emailReminderEmails',
                          label: 'REMINDERS',
                          description: 'Get reminded about pending deliveries and orders'
                        },
                        {
                          key: 'emailReviewRequests',
                          label: 'REVIEW REQUESTS',
                          description: 'Be asked to review products you\'ve purchased'
                        },
                        {
                          key: 'emailSecurityAlerts',
                          label: 'SECURITY ALERTS',
                          description: 'Important notifications about your account security'
                        },
                        {
                          key: 'emailMarketingEmails',
                          label: 'MARKETING EMAILS',
                          description: 'Exclusive offers, new products, and promotions'
                        },
                      ].map((item) => (
                        <label key={item.key} className="flex items-start gap-4 p-4 border border-gray-200 cursor-pointer hover:border-black transition-colors">
                          <input
                            type="checkbox"
                            checked={preferences[item.key as keyof NotificationPreferences]}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              [item.key]: e.target.checked
                            })}
                            className="w-5 h-5 mt-1 border-2 border-gray-300 rounded cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-black uppercase tracking-wide text-sm">{item.label}</p>
                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-4">PUSH NOTIFICATIONS</h3>
                    <label className="flex items-start gap-4 p-4 border border-gray-200 cursor-pointer hover:border-black transition-colors">
                      <input
                        type="checkbox"
                        checked={preferences.pushNotifications}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          pushNotifications: e.target.checked
                        })}
                        className="w-5 h-5 mt-1 border-2 border-gray-300 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-black uppercase tracking-wide text-sm">IN-APP NOTIFICATIONS</p>
                        <p className="text-xs text-gray-600 mt-1">Receive notifications while browsing the app</p>
                      </div>
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button 
                      onClick={handleSavePreferences}
                      disabled={saving}
                      className="px-8 py-3 bg-black text-white font-bold uppercase text-xs tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'SAVING...' : 'SAVE PREFERENCES'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {tab === 'privacy' && (
              <div className="bg-white border border-gray-200 p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">PRIVACY & SECURITY</h2>
                  
                  <div className="space-y-6">
                    <div className="pb-6 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3">DATA COLLECTION</h3>
                      <p className="text-sm text-gray-700">We collect information necessary to provide our services. This includes:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-1">
                        <li>Personal information (name, email, phone)</li>
                        <li>Shipping address and preferences</li>
                        <li>Purchase history and activity</li>
                        <li>Device and browser information</li>
                      </ul>
                    </div>

                    <div className="pb-6 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3">HOW WE PROTECT YOUR DATA</h3>
                      <p className="text-sm text-gray-700">Your data is protected using industry-standard encryption and security measures:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-1">
                        <li>SSL/TLS encryption for all data in transit</li>
                        <li>Password hashing with bcrypt</li>
                        <li>Regular security audits</li>
                        <li>Restricted access to personal data</li>
                      </ul>
                    </div>

                    <div className="pb-6 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3">YOUR RIGHTS</h3>
                      <p className="text-sm text-gray-700">You have the right to:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-1">
                        <li>Access all your personal data</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion of your account</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Download your data</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3">DEACTIVATE ACCOUNT</h3>
                      <p className="text-sm text-gray-700 mb-4">Deactivating your account will remove your profile and associated data. This action cannot be undone.</p>
                      <button className="px-6 py-3 border-2 border-red-600 text-red-600 font-bold uppercase text-xs tracking-wide hover:bg-red-600 hover:text-white transition-colors">
                        DEACTIVATE ACCOUNT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chats Tab */}
            {tab === 'chats' && (
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">YOUR CONVERSATIONS</h2>
                <p className="text-sm text-gray-600 mb-8">View and manage all your active conversations with buyers and sellers.</p>

                {conversations.length > 0 ? (
                  <div className="space-y-4">
                    {conversations.map((conversation) => {
                      // Determine the other participant
                      const otherUser = conversation.user1.id === user?.id ? conversation.user2 : conversation.user1
                      
                      return (
                        <Link
                          key={conversation.id}
                          href={`/buyer/chats/${conversation.id}`}
                          className="block p-4 border border-gray-200 hover:border-black transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-black">{otherUser.firstName} {otherUser.lastName}</p>
                              <p className="text-xs text-gray-500">@{otherUser.username}</p>
                            </div>
                            {conversation.product && (
                              <span className="text-xs bg-gray-100 px-3 py-1 rounded text-black font-semibold">
                                {conversation.product.title}
                              </span>
                            )}
                          </div>
                          
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{conversation.lastMessage}</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            {conversation.lastMessageAt && (
                              <p className="text-xs text-gray-500">
                                {new Date(conversation.lastMessageAt).toLocaleDateString()}
                              </p>
                            )}
                            <span className="text-black font-bold text-xs uppercase tracking-wide hover:text-gray-600">
                              →
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">No conversations yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start chatting with sellers or buyers to see conversations here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

