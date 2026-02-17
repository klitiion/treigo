import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/images/image.avif"
        alt="404 Background"
        fill
        className="absolute inset-0 w-full h-full object-cover"
        priority
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center px-4 py-12">
        {/* Logo */}
        <p className="text-white font-900 text-lg uppercase tracking-wider mb-12">TRÈIGO</p>

        {/* Error Code */}
        <h1 className="text-8xl font-900 text-white mb-6 tracking-tighter">404</h1>
        
        {/* Heading */}
        <h2 className="text-4xl font-900 text-white mb-6 uppercase tracking-tight max-w-xl mx-auto">
          We Can't Find That Page
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-200 mb-12 max-w-lg mx-auto leading-relaxed">
          Not sure what's happened there. Maybe go grab a new item instead and then we can go shop?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto mb-12">
          <Link 
            href="/search?category=women"
            className="flex-1 px-8 py-4 bg-white text-black font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors text-sm rounded-full"
          >
            Shop Women
          </Link>
          <Link 
            href="/search?category=men"
            className="flex-1 px-8 py-4 bg-white text-black font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors text-sm rounded-full"
          >
            Shop Men
          </Link>
        </div>

        {/* Contact Support */}
        <div className="flex flex-col items-center gap-4 pt-8 border-t border-white/30">
          <p className="text-gray-300 text-sm">
            Need help? Contact us at
          </p>
          <div className="flex items-center justify-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/30">
            <Mail className="w-4 h-4 text-white" />
            <a 
              href="mailto:support@treigo.eu"
              className="text-white font-bold text-sm hover:opacity-80 transition-opacity"
            >
              support@treigo.eu
            </a>
          </div>
          <p className="text-gray-400 text-xs mt-4">
            or{' '}
            <Link 
              href="/contact" 
              className="text-white font-bold hover:underline"
            >
              report this issue
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

