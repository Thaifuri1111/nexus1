'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface User {
  id: string
  phone: string
  username: string
  balance: number
  keys: number
  status: string
  isVip: boolean
}

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const links = [
    { href: '/game', label: '🎮 Game' },
    { href: '/tap', label: '🖐️ Tap' },
    { href: '/convert', label: '🔄 Convert' },
    { href: '/deposit', label: '💰 Deposit' },
    { href: '/withdraw', label: '💳 Withdraw' },
    { href: '/claim', label: '🎯 Claim' },
  ]

  const isAdmin = user.role === 'ADMIN'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/10">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/game" className="text-xl font-bold text-primary">
            NEXUS
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-yellow-400">
              🪙 {user.balance}
            </span>
            <span className="text-sm text-green-400">
              🔑 {user.keys}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
              {user.status}
            </span>
            {user.isVip && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500">
                VIP
              </span>
            )}
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex gap-4 mt-2 overflow-x-auto pb-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm whitespace-nowrap transition ${
                pathname === link.href
                  ? 'text-primary font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className={`text-sm whitespace-nowrap transition ${
                pathname.startsWith('/admin')
                  ? 'text-primary font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🛡️ Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}