'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard, Plus, Package, Settings, MessageSquare } from 'lucide-react'

interface SellerLayoutProps {
  children: React.ReactNode
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('treigo_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('treigo_user')
      }
    }
  }, [])

  const menuItems = [
    { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/seller/products', label: 'Products', icon: Package },
    { href: '/seller/orders', label: 'Orders', icon: Package },
    { href: '/seller/chats', label: 'Messages', icon: MessageSquare },
  ]

  const actionItems = [
    { href: '/seller/products/new', label: 'Add Product', icon: Plus },
    { href: '/seller/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = () => {
    localStorage.removeItem('treigo_user')
    localStorage.removeItem('treigo_token')
    router.push('/')
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b-2 border-black">
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

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r-2 border-black">
          <div className="p-6 h-full flex flex-col">
            {/* Logo */}
            <div className="mb-8 pb-6 border-b-2 border-black">
              <Link href="/" className="font-bold text-black text-lg uppercase tracking-wider">
                TRÈIGO
              </Link>
              <p className="text-xs text-gray-600 mt-2 uppercase tracking-wide font-semibold">Seller Dashboard</p>
            </div>

            {/* Main Menu */}
            <nav className="mb-8">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-bold mb-4">Menu</p>
              <div className="space-y-2">
                {menuItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${
                      isActive(href)
                        ? 'bg-black text-white font-bold'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <nav className="mb-8 pb-8 border-b-2 border-black">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-bold mb-4">Actions</p>
              <div className="space-y-2">
                {actionItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${
                      isActive(href)
                        ? 'bg-black text-white font-bold'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
                  </Link>
                ))}
              </div>
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

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed top-16 left-0 bottom-24 w-64 bg-white border-r-2 border-black transform transition-transform duration-300 z-40 lg:hidden overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Main Menu */}
            <nav>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-bold mb-3 px-2">Menu</p>
              <div className="space-y-2">
                {menuItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${
                      isActive(href)
                        ? 'bg-black text-white font-bold'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <nav>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-bold mb-3 px-2">Actions</p>
              <div className="space-y-2">
                {actionItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${
                      isActive(href)
                        ? 'bg-black text-white font-bold'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Logout */}
            <button
              onClick={() => {
                setSidebarOpen(false)
                handleLogout()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-black border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pb-24 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black lg:hidden z-40">
        <div className="flex items-center justify-around h-24">
          {/* Add Product - Primary Action */}
          <Link
            href="/seller/products/new"
            className="flex flex-col items-center justify-center w-20 h-20 text-black hover:bg-black hover:text-white transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-1">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-center">Add</span>
          </Link>

          {/* Dashboard */}
          <Link
            href="/seller/dashboard"
            className={`flex flex-col items-center justify-center flex-1 h-20 transition-colors ${
              isActive('/seller/dashboard')
                ? 'bg-gray-100 text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wide">Home</span>
          </Link>

          {/* Products */}
          <Link
            href="/seller/products"
            className={`flex flex-col items-center justify-center flex-1 h-20 transition-colors ${
              isActive('/seller/products') && !isActive('/seller/products/new')
                ? 'bg-gray-100 text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Package className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wide">Items</span>
          </Link>

          {/* Settings */}
          <Link
            href="/seller/settings"
            className={`flex flex-col items-center justify-center flex-1 h-20 transition-colors ${
              isActive('/seller/settings')
                ? 'bg-gray-100 text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wide">More</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
