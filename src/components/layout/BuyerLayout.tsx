'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, User, ShoppingBag, Ticket, BarChart3 } from 'lucide-react'

interface BuyerLayoutProps {
  children: React.ReactNode
}

export function BuyerLayout({ children }: BuyerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: '/buyer/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/buyer/profile', label: 'Profile', icon: User },
    { href: '/buyer/coupons', label: 'Coupons', icon: Ticket },
  ]

  const handleLogout = () => {
    localStorage.removeItem('treigo_user')
    localStorage.removeItem('treigo_token')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-bold text-black text-lg uppercase tracking-wider">
            TRÈIGO
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-black hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-16 lg:top-0 left-0 h-[calc(100vh-64px)] lg:h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-30 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Logo Desktop */}
            <div className="hidden lg:block mb-8 pb-6 border-b-2 border-gray-300">
              <Link href="/" className="font-bold text-black text-lg uppercase tracking-wider">
                TRÈIGO
              </Link>
              <p className="text-xs text-gray-600 mt-2 uppercase tracking-wide font-semibold">Buyer Dashboard</p>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-2">
              {menuItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${
                      isActive
                        ? 'bg-black text-white font-bold'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-black border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-colors mt-auto"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-4 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
