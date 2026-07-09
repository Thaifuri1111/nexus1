'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { formatNumber } from '@/lib/utils'

export function Navbar() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <nav className="bg-card border-b border-primary/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/game" className="font-orbitron text-xl font-bold text-primary">
          ⚡ NEXUS
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div className="text-primary font-bold">{formatNumber(user.coins)}</div>
              <div className="text-xs text-gray-400">Coins</div>
            </div>
            <Link href="/logout" className="text-sm text-gray-400 hover:text-primary transition">
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}