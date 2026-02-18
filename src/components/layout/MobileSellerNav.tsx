'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, LayoutDashboard, MessageSquare } from 'lucide-react'

export function MobileSellerNav() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black lg:hidden z-40">
      <div className="flex items-center justify-around h-20">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-20 transition-colors ${
            pathname === '/' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:text-black'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs font-bold uppercase tracking-wide">Home</span>
        </Link>

        {/* Messages */}
        <Link
          href="/seller/chats"
          className={`flex flex-col items-center justify-center flex-1 h-20 transition-colors ${
            isActive('/seller/chats') ? 'bg-gray-100 text-black' : 'text-gray-600 hover:text-black'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-xs font-bold uppercase tracking-wide">Messages</span>
        </Link>

        {/* Add Product - Primary Action */}
        <Link
          href="/seller/products/new"
          className="flex flex-col items-center justify-center w-20 h-20 text-black hover:bg-black hover:text-white transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-1">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-center">Add</span>
        </Link>

        {/* Dashboard */}
        <Link
          href="/seller/dashboard"
          className={`flex flex-col items-center justify-center flex-1 h-20 transition-colors ${
            isActive('/seller/dashboard') ? 'bg-gray-100 text-black' : 'text-gray-600 hover:text-black'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-xs font-bold uppercase tracking-wide">Dashboard</span>
        </Link>
      </div>
    </nav>
  )
}
