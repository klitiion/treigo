'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+355692084763'
  const message = encodeURIComponent('Hello! I have a question about Treigo.')
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Na kontakto në WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  )
}
