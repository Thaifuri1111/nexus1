'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') return null

  const menu = [
    { href: '/admin/dashboard', label: '📊 Dashboard' },
    { href: '/admin/deposits', label: '💰 Deposit' },
    { href: '/admin/withdraws', label: '💳 Withdraw' },
    { href: '/admin/users', label: '👥 Users' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/admin/dashboard" className="text-xl font-bold text-primary">
            🛡️ NEXUS ADMIN
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              👤 {user.username || user.phone}
            </span>
            <button
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="fixed top-16 left-0 bottom-0 w-56 bg-card/50 backdrop-blur-lg border-r border-primary/10 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                pathname === item.href
                  ? 'bg-primary/20 text-primary font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-card'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <main className="ml-56 pt-20 p-6">
        {children}
      </main>
    </div>
  )
}