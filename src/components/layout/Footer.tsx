import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 mb-12">
          {/* Help */}
          <div>
            <h3 className="font-900 text-black uppercase text-sm tracking-normal mb-4">HELP</h3>
            <ul className="space-y-2">
              <li><Link href="/help/faq" className="text-gray-600 hover:text-black transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/help/delivery" className="text-gray-600 hover:text-black transition-colors text-sm">Delivery Information</Link></li>
              <li><Link href="/help/returns" className="text-gray-600 hover:text-black transition-colors text-sm">Returns Policy</Link></li>
              <li><Link href="/help/make-return" className="text-gray-600 hover:text-black transition-colors text-sm">Make A Return</Link></li>
              <li><Link href="/buyer/orders" className="text-gray-600 hover:text-black transition-colors text-sm">Orders</Link></li>
              <li><Link href="/help/report" className="text-gray-600 hover:text-black transition-colors text-sm">Report Counterfeit</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="font-900 text-black uppercase text-sm tracking-normal mb-4">MY ACCOUNT</h3>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-gray-600 hover:text-black transition-colors text-sm">Sign In</Link></li>
              <li><Link href="/auth/register" className="text-gray-600 hover:text-black transition-colors text-sm">Register</Link></li>
              <li><Link href="/buyer/profile" className="text-gray-600 hover:text-black transition-colors text-sm">My Profile</Link></li>
              <li><Link href="/buyer/orders" className="text-gray-600 hover:text-black transition-colors text-sm">My Orders</Link></li>
              <li><Link href="/buyer/wishlist" className="text-gray-600 hover:text-black transition-colors text-sm">My Wishlist</Link></li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-900 text-black uppercase text-sm tracking-normal mb-4">PAGES</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-black transition-colors text-sm">Home</Link></li>
              <li><Link href="/search" className="text-gray-600 hover:text-black transition-colors text-sm">Browse Products</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-black transition-colors text-sm">About Us</Link></li>
              <li><Link href="/about/sellers" className="text-gray-600 hover:text-black transition-colors text-sm">Become a Seller</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-black transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-900 text-black uppercase text-sm tracking-normal mb-4">COMMUNITY</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-600 hover:text-black transition-colors text-sm">Blog</Link></li>
              <li><Link href="/guides" className="text-gray-600 hover:text-black transition-colors text-sm">Guides & Tips</Link></li>
              <li><Link href="/sell-guides" className="text-gray-600 hover:text-black transition-colors text-sm">Seller Guides</Link></li>
              <li><Link href="/sustainability" className="text-gray-600 hover:text-black transition-colors text-sm">Sustainability</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-900 text-black uppercase text-sm tracking-normal mb-4">CONTACT</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@treigo.com" className="flex items-start gap-2 text-gray-600 hover:text-black transition-colors text-sm group">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:text-black" />
                  <span>support@treigo.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+355692084763" className="flex items-start gap-2 text-gray-600 hover:text-black transition-colors text-sm group">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:text-black" />
                  <span>+355 69 208 4763</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/355692084763" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors text-sm">
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Social Media */}
        <div className="border-t border-gray-200 pt-12 mt-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
            {/* Payment Methods */}
            <div className="flex-1">
              <h3 className="font-900 text-black uppercase text-sm tracking-normal mb-4">ACCEPTED PAYMENT METHODS</h3>
              <div className="flex flex-wrap gap-2">
                {/* Mastercard */}
                <Image 
                  src="/images/download (1).svg" 
                  alt="Mastercard" 
                  width={80} 
                  height={48} 
                  className="h-8 w-auto"
                />
                {/* Visa */}
                <Image 
                  src="/images/download (2).svg" 
                  alt="Visa" 
                  width={80} 
                  height={48}
                  className="h-8 w-auto"
                />
                {/* American Express */}
                <Image 
                  src="/images/download (3).svg" 
                  alt="American Express" 
                  width={80} 
                  height={48}
                  className="h-8 w-auto"
                />
                {/* PayPal */}
                <Image 
                  src="/images/download (4).svg" 
                  alt="PayPal" 
                  width={80} 
                  height={48}
                  className="h-8 w-auto"
                />
                {/* Apple Pay */}
                <Image 
                  src="/images/download (5).svg" 
                  alt="Apple Pay" 
                  width={80} 
                  height={48}
                  className="h-8 w-auto"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="text-left lg:text-right">
              <h3 className="font-900 text-black uppercase text-sm tracking-normal mb-4">FOLLOW US</h3>
              <div className="flex gap-4">
                <a href="https://facebook.com/treigo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/treigo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/treigo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/treigo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} Trèigo. All Rights Reserved. Authentic marketplace for second-hand goods.
            </p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
              <Link href="/terms" className="text-gray-600 hover:text-black text-sm transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-black text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-black text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
