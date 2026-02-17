'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'

interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
  sender: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
  }
}

interface Conversation {
  id: string
  otherUser: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
    shop?: { storePhotoUrl: string | null; name: string }
  }
  lastMessage: string
  lastMessageAt: string
  lastMessageBy: string
  unreadCount: number
  product?: { id: string; title: string; images: Array<{ url: string }> }
  shop?: { id: string; name: string }
}

function InboxContent() {
  const { user, token } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedConversationId = searchParams.get('conversation')
  const sellerId = searchParams.get('sellerId')
  const sellerName = searchParams.get('sellerName')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/login')
      return
    }
    fetchConversations()
  }, [user, token])

  // Handle sellerId query parameter - find or create conversation
  useEffect(() => {
    if (sellerId && conversations.length > 0) {
      // Look for existing conversation with this seller
      const existingConversation = conversations.find(c => c.otherUser.id === sellerId)
      if (existingConversation) {
        router.push(`/buyer/inbox?conversation=${existingConversation.id}`)
      } else {
        // Create a new conversation with the seller
        createConversation(sellerId)
      }
    }
  }, [sellerId, conversations, router])

  const createConversation = async (receiverId: string) => {
    try {
      // Send an initial message to create the conversation
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId,
          content: 'Hi, I wanted to inquire about your product.',
          conversationId: null
        })
      })

      if (!response.ok) throw new Error('Failed to create conversation')
      const newConversationData = await response.json()
      
      // Refresh conversations and navigate to the new one
      const updatedConversations = await fetchConversations()
      if (newConversationData.data?.conversationId) {
        router.push(`/buyer/inbox?conversation=${newConversationData.data.conversationId}`)
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId)
    }
  }, [selectedConversationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch conversations')
      const data = await response.json()
      setConversations(data.conversations || data)
      setLoading(false)
      return data.conversations || data
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setLoading(false)
      return []
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversationId) return

    setSendingMessage(true)
    const conversation = conversations.find(c => c.id === selectedConversationId)
    const receiverId = conversation?.otherUser.id

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId,
          content: newMessage,
          conversationId: selectedConversationId
        })
      })

      if (!response.ok) throw new Error('Failed to send message')
      setNewMessage('')
      fetchMessages(selectedConversationId)
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    `${conv.otherUser.firstName} ${conv.otherUser.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Conversations List */}
      <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/buyer/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold flex-1">Messages</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Conversations  */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => router.push(`/buyer/inbox?conversation=${conv.id}`)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conv.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {conv.otherUser.shop?.storePhotoUrl ? (
                    <img
                      src={conv.otherUser.shop.storePhotoUrl}
                      alt={conv.otherUser.firstName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : conv.otherUser.avatarUrl ? (
                    <img
                      src={conv.otherUser.avatarUrl}
                      alt={conv.otherUser.firstName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">
                        {conv.shop?.name || `${conv.otherUser.firstName} ${conv.otherUser.lastName}`}
                      </h3>
                      {conv.unreadCount > 0 && (
                        <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-600">
              {conversations.length === 0 ? 'No conversations yet' : 'No matching conversations'}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversationId ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {conversations.find(c => c.id === selectedConversationId) && (
            <>
              <div className="border-b border-gray-200 p-4">
                {(() => {
                  const conv = conversations.find(c => c.id === selectedConversationId)!
                  return (
                    <div className="flex items-center gap-3">
                      {conv.otherUser.shop?.storePhotoUrl ? (
                        <img
                          src={conv.otherUser.shop.storePhotoUrl}
                          alt={conv.otherUser.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : conv.otherUser.avatarUrl ? (
                        <img
                          src={conv.otherUser.avatarUrl}
                          alt={conv.otherUser.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300" />
                      )}
                      <div>
                        <h2 className="font-semibold">
                          {conv.shop?.name || `${conv.otherUser.firstName} ${conv.otherUser.lastName}`}
                        </h2>
                        {conv.product && (
                          <p className="text-xs text-gray-600">{conv.product.title}</p>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-black'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-4 flex gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  )
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InboxContent />
    </Suspense>
  )
}
