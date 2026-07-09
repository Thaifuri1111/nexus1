'use client'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface User {
  id: string
  phone: string
  username: string
  balance: number
  keys: number
  taps: number
  maxTaps: number
  tapCoins: number
  status: string
  isVip: boolean
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      toast.error('Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      BRONZE: 'bg-amber-600/20 text-amber-600',
      SILVER: 'bg-gray-300/20 text-gray-300',
      GOLD: 'bg-yellow-500/20 text-yellow-500',
      PLATINUM: 'bg-cyan-400/20 text-cyan-400',
      DIAMOND: 'bg-blue-400/20 text-blue-400',
    }
    return colors[status] || 'bg-gray-500/20 text-gray-500'
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">👥 Manajemen User</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-primary/10">
              <th className="pb-2">User</th>
              <th className="pb-2">Saldo</th>
              <th className="pb-2">Kunci</th>
              <th className="pb-2">Tap</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">VIP</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-primary/5">
                <td className="py-2">
                  <p className="font-medium">{user.username || user.phone}</p>
                  <p className="text-xs text-gray-400">{user.phone}</p>
                </td>
                <td className="py-2">{formatCurrency(user.balance)}</td>
                <td className="py-2">{user.keys}</td>
                <td className="py-2">{user.taps}/{user.maxTaps}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-2">
                  {user.isVip ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}