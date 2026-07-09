'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    phone: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal')
      }

      localStorage.setItem('token', data.token)
      toast.success('Login berhasil!')
      router.push('/game')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-xl max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">NEXUS</h1>
          <p className="text-gray-400 text-sm">Login ke akunmu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nomor HP</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+6281234567890"
              className="w-full px-4 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Masukkan password"
              className="w-full px-4 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Belum punya akun?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}