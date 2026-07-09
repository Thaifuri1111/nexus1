'use client'
import Link from 'next/link'

export default function GamePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">🎮 Game</h1>
      <p className="text-gray-400">Selamat datang di Nexus Game!</p>
      
      <div className="grid grid-cols-2 gap-4">
        <Link href="/tap" className="bg-card p-6 rounded-xl text-center hover:bg-card/80 transition">
          <div className="text-4xl mb-2">🖐️</div>
          <h3 className="font-bold">Free Tap</h3>
          <p className="text-xs text-gray-400">Tap 500x dapat kunci</p>
        </Link>
        <Link href="/convert" className="bg-card p-6 rounded-xl text-center hover:bg-card/80 transition">
          <div className="text-4xl mb-2">🔄</div>
          <h3 className="font-bold">Convert</h3>
          <p className="text-xs text-gray-400">Coin → Kunci</p>
        </Link>
        <Link href="/deposit" className="bg-card p-6 rounded-xl text-center hover:bg-card/80 transition">
          <div className="text-4xl mb-2">💰</div>
          <h3 className="font-bold">Deposit</h3>
          <p className="text-xs text-gray-400">Tambah saldo</p>
        </Link>
        <Link href="/withdraw" className="bg-card p-6 rounded-xl text-center hover:bg-card/80 transition">
          <div className="text-4xl mb-2">💳</div>
          <h3 className="font-bold">Withdraw</h3>
          <p className="text-xs text-gray-400">Tarik saldo</p>
        </Link>
      </div>

      <div className="bg-card p-4 rounded-xl">
        <h3 className="font-bold mb-2">📋 Panduan</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>1. Tap 500x untuk dapat kunci</li>
          <li>2. Convert coin jadi kunci (1000 coin = 1 kunci)</li>
          <li>3. Deposit 50k-500k untuk tambah saldo</li>
          <li>4. Withdraw 100k + 500 kunci</li>
        </ul>
      </div>
    </div>
  )
}