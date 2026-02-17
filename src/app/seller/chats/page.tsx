'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, MessageCircle, Clock, Send } from 'lucide-react'
import { ProtectedRoute } from '@/hooks/useAuth'

interface Conversation {
  id: string
  buyerName: string
  buyerAvatar?: string
  lastMessage: string
  lastMessageTime: Date | string
  unreadCount: number
  messages: Message[]
}

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: 'BUYER' | 'SELLER'
  message: string
  timestamp: Date | string
  isRead: boolean
}

export default function SellerChatsPage() {
  return (
    <ProtectedRoute requiredRole="SELLER">
      <SellerChats />
    </ProtectedRoute>
  )
}

function SellerChats() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; firstName: string; email: string } | null>(null)

  // Format buyer name to show only first initial and last name (e.g., "John Smith" -> "J. Smith")
  const formatBuyerName = (fullName: string): string => {
    const parts = fullName.trim().split(' ')
    if (parts.length < 2) return fullName
    const firstInitial = parts[0].charAt(0).toUpperCase()
    const lastName = parts[parts.length - 1]
    return `${firstInitial}. ${lastName}`
  }

  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem('treigo_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Load conversations (mock data for now)
    const mockConversations: Conversation[] = [
      {
        id: '1',
        buyerName: 'John Smith',
        lastMessage: 'Hi, do you have this in size M?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        unreadCount: 2,
        messages: [
          {
            id: '1',
            senderId: 'buyer-1',
            senderName: 'John Smith',
            senderRole: 'BUYER',
            message: 'Hi, I am interested in this jacket',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            isRead: true
          },
          {
            id: '2',
            senderId: 'seller-1',
            senderName: 'Your Store',
            senderRole: 'SELLER',
            message: 'Hi! Thank you for your interest. We have it in all sizes.',
            timestamp: new Date(Date.now() - 1000 * 60 * 25),
            isRead: true
          },
          {
            id: '3',
            senderId: 'buyer-1',
            senderName: 'John Smith',
            senderRole: 'BUYER',
            message: 'Hi, do you have this in size M?',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            isRead: false
          }
        ]
      },
      {
        id: '2',
        buyerName: 'Maria Garcia',
        lastMessage: 'When will you be restocking the black shoes?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        unreadCount: 1,
        messages: [
          {
            id: '1',
            senderId: 'buyer-2',
            senderName: 'Maria Garcia',
            senderRole: 'BUYER',
            message: 'When will you be restocking the black shoes?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            isRead: false
          }
        ]
      },
      {
        id: '3',
        buyerName: 'Emma Wilson',
        lastMessage: 'Perfect! I received my order. Thank you!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        unreadCount: 0,
        messages: [
          {
            id: '1',
            senderId: 'buyer-3',
            senderName: 'Emma Wilson',
            senderRole: 'BUYER',
            message: 'Perfect! I received my order. Thank you!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
            isRead: true
          }
        ]
      }
    ]

    setConversations(mockConversations)
    setLoading(false)
  }, [])

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)

  const filteredConversations = conversations.filter(conv =>
    conv.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return

    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: new Date(),
          messages: [
            ...conv.messages,
            {
              id: Math.random().toString(),
              senderId: user?.id || 'seller-1',
              senderName: user?.firstName || 'Your Store',
              senderRole: 'SELLER',
              message: newMessage,
              timestamp: new Date(),
              isRead: false
            }
          ]
        }
      }
      return conv
    }))

    setNewMessage('')
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return d.toLocaleDateString()
  }

  if (loading) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/seller/dashboard" className="flex items-center gap-2 text-black font-bold uppercase text-xs tracking-wide hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
          <h1 className="text-3xl font-bold text-black uppercase tracking-wide">MESSAGES</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all conversations with your customers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="bg-white border border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none text-sm font-bold focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-semibold">No conversations</p>
                  <p className="text-xs text-gray-500 mt-1">Start selling and customers will message you</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredConversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`w-full p-4 border-b border-gray-200 text-left transition-colors ${
                        selectedConversationId === conv.id
                          ? 'bg-black text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold uppercase text-xs tracking-wide ${
                            selectedConversationId === conv.id ? 'text-white' : 'text-black'
                          }`}>
                            {formatBuyerName(conv.buyerName)}
                          </p>
                          <p className={`text-xs truncate mt-1 ${
                            selectedConversationId === conv.id ? 'text-gray-200' : 'text-gray-600'
                          }`}>
                            {conv.lastMessage}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className={`text-xs whitespace-nowrap ${
                            selectedConversationId === conv.id ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {formatTime(conv.lastMessageTime)}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              selectedConversationId === conv.id
                                ? 'bg-white text-black'
                                : 'bg-black text-white'
                            }`}>
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="bg-white border border-gray-200 md:col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold uppercase text-lg tracking-wide">{formatBuyerName(selectedConversation.buyerName)}</h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderRole === 'SELLER' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-none ${
                        msg.senderRole === 'SELLER'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black'
                      }`}
                    >
                      <p className="text-sm font-semibold uppercase tracking-wide">{msg.senderName}</p>
                      <p className="text-xs mt-1 opacity-80">{formatTime(msg.timestamp)}</p>
                      <p className="mt-2">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage()
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-none text-sm font-bold focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-3 bg-black text-white rounded-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 md:col-span-2 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="font-semibold text-lg">Select a conversation</p>
                <p className="text-sm text-gray-500 mt-2">Choose a customer to view and respond to messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
