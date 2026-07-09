import type { Metadata } from 'next'
import { Orbitron, Rajdhani } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['400', '600', '700']
})

export const metadata: Metadata = {
  title: 'Nexus Game',
  description: 'Platform Game & Reward',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="bg-background text-white font-rajdhani">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid #00d4ff40',
            },
          }}
        />
      </body>
    </html>
  )
}