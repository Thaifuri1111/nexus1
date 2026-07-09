'use client'
import ConvertButton from '@/components/ConvertButton'

export default function ConvertPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">🔄 Convert Coin</h1>
      <p className="text-gray-400 text-sm">
        Tukar coin menjadi kunci. 1000 coin = 1 kunci. 
        Maksimal 10 kunci per hari.
      </p>
      <ConvertButton />
    </div>
  )
}