import { create } from 'zustand'

interface GameState {
  taps: number
  coins: number
  keys: number
  tapCoins: number
  setTaps: (taps: number) => void
  setCoins: (coins: number) => void
  setKeys: (keys: number) => void
  setTapCoins: (tapCoins: number) => void
  reset: () => void
}

export const useGameStore = create<GameState>((set) => ({
  taps: 0,
  coins: 0,
  keys: 0,
  tapCoins: 0,
  setTaps: (taps) => set({ taps }),
  setCoins: (coins) => set({ coins }),
  setKeys: (keys) => set({ keys }),
  setTapCoins: (tapCoins) => set({ tapCoins }),
  reset: () => set({ taps: 0, coins: 0, keys: 0, tapCoins: 0 }),
}))