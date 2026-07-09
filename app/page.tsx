'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl font-orbitron font-bold mb-4 animate-glowPulse">
          ⚡ NEXUS
        </div>
        <p className="text-xl text-gray-400 mb-8">
          The Ultimate Tap & Earn Game
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary hover:bg-primary/80 text-black font-bold rounded-lg transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-secondary hover:bg-secondary/80 text-white font-bold rounded-lg transition-all"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  )
}