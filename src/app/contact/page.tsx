'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general',
  })

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ticketCode, setTicketCode] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const generateTicketCode = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 7).toUpperCase()
    return `${timestamp}${random}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email is not valid'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const code = generateTicketCode()
      setTicketCode(code)

      // Send email with ticket
      const response = await fetch('/api/contact/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          inquiryType: formData.inquiryType,
          ticketCode: code,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }
      
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general',
      })

      // Reset after 5 seconds
      setTimeout(() => {
        setSubmitted(false)
        setTicketCode('')
      }, 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-900 text-black mb-4 uppercase tracking-tight">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Get in touch with us. We'll respond as quickly as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email */}
            <div className="p-6 border-2 border-black">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-black" />
                <h3 className="font-bold uppercase tracking-wide text-black">Email</h3>
              </div>
              <p className="text-black font-medium">support@treigo.eu</p>
              <p className="text-sm text-gray-600 mt-2">Reply within 24 hours</p>
            </div>

            {/* Phone */}
            <div className="p-6 border-2 border-black">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-black" />
                <h3 className="font-bold uppercase tracking-wide text-black">Phone</h3>
              </div>
              <p className="text-black font-medium">+355 69 XX XX XXX</p>
              <p className="text-sm text-gray-600 mt-2">Monday - Saturday, 09:00 - 18:00</p>
            </div>

            {/* Office */}
            <div className="p-6 border-2 border-black">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-black" />
                <h3 className="font-bold uppercase tracking-wide text-black">Office</h3>
              </div>
              <p className="text-black font-medium text-sm">
                Tirana, Albania<br />
                info@treigo.eu
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 border-2 border-black p-8">
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-black mx-auto mb-6" />
                <h2 className="text-3xl font-900 text-black mb-6 uppercase tracking-tight">Ticket Created!</h2>
                <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
                  We have received your message and created a support ticket for you.
                </p>
                <div className="bg-gray-100 border-2 border-black p-6 mb-8">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">Your Ticket Number</p>
                  <p className="text-3xl font-900 text-black tracking-wider"># {ticketCode}</p>
                </div>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  A confirmation email with your ticket number has been sent to your inbox. Keep this number for reference. We'll respond within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {handleChange(e); setErrors(prev => ({...prev, name: ''}))}}
                    placeholder="John Smith"
                    className={`w-full px-4 py-3 bg-white border-2 focus:outline-none transition-colors ${
                      errors.name ? 'border-red-600' : 'border-black focus:border-black'
                    }`}
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-2">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => {handleChange(e); setErrors(prev => ({...prev, email: ''}))}}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 bg-white border-2 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-600' : 'border-black focus:border-black'
                    }`}
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-2">{errors.email}</p>}
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Inquiry Type *</label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-black focus:outline-none focus:border-black"
                  >
                    <option value="general">General Question</option>
                    <option value="business">Business Partnership</option>
                    <option value="seller">Become a Seller</option>
                    <option value="support">Technical Support</option>
                    <option value="dispute">Dispute / Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => {handleChange(e); setErrors(prev => ({...prev, subject: ''}))}}
                    placeholder="Brief subject line"
                    className={`w-full px-4 py-3 bg-white border-2 focus:outline-none transition-colors ${
                      errors.subject ? 'border-red-600' : 'border-black focus:border-black'
                    }`}
                  />
                  {errors.subject && <p className="text-red-600 text-xs mt-2">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => {handleChange(e); setErrors(prev => ({...prev, message: ''}))}}
                    placeholder="Your detailed message..."
                    rows={5}
                    className={`w-full px-4 py-3 bg-white border-2 focus:outline-none transition-colors resize-none ${
                      errors.message ? 'border-red-600' : 'border-black focus:border-black'
                    }`}
                  />
                  {errors.message && <p className="text-red-600 text-xs mt-2">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-2 border-black p-8">
          <h2 className="text-3xl font-900 text-black mb-8 uppercase tracking-tight">FAQ</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold uppercase tracking-wide text-black mb-3">How can I become a seller?</h3>
              <p className="text-gray-600 text-sm">
                You can register as a seller by completing the registration form and submitting verification documents.
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wide text-black mb-3">What is the delivery period?</h3>
              <p className="text-gray-600 text-sm">
                Delivery times vary by location. Usually 3-5 business days for Tirana and 5-7 business days for other areas.
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wide text-black mb-3">How can I return a product?</h3>
              <p className="text-gray-600 text-sm">
                You have 14 days to return a product. Contact support for more information.
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wide text-black mb-3">How can I file a complaint?</h3>
              <p className="text-gray-600 text-sm">
                If you have a dispute with a seller, you can open a complaint through the "My Orders" section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
