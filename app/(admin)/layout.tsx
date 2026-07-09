'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user?.isAdmin) return <div className="flex items-center justify-center min-h-screen">Access Denied</div>

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-primary/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin/dashboard" className="font-orbitron text-xl font-bold text-primary">
            ⚡ ADMIN
          </Link>
          <div className="flex gap-4">
            <Link href="/admin/dashboard" className="hover:text-primary transition">Dashboard</Link>
            <Link href="/admin/deposits" className="hover:text-primary transition">Deposits</Link>
            <Link href="/admin/withdraws" className="hover:text-primary transition">Withdraws</Link>
            <Link href="/admin/users" className="hover:text-primary transition">Users</Link>
            <Link href="/logout" className="text-gray-400 hover:text-primary transition">Logout</Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}