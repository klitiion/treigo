import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Toaster } from '@/components/ui/Toaster'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { CurrencyProvider } from '@/context/CurrencyContext'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Trèigo - Second-Hand & Premium Marketplace',
  description: 'Trusted platform for buying and selling second-hand and premium items. Product verification, secure payments, guaranteed trust.',
  keywords: ['second-hand', 'premium', 'albania', 'marketplace', 'rroba', 'parfume', 'verified', 'treigo'],
  authors: [{ name: 'Trèigo' }],
  openGraph: {
    title: 'Trèigo - Second-Hand & Premium Marketplace',
    description: 'Trusted platform for buying and selling second-hand and premium items.',
    url: 'https://treigo.eu',
    siteName: 'Trèigo',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <CustomCursor />
        <CurrencyProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CurrencyProvider>
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  )
}
