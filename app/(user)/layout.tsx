'use client'

import { Navbar } from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Toaster position="top-right" />
    </>
  )
}