import type { Viewport } from 'next'

// Allow zooming on product pages for viewing product images
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
