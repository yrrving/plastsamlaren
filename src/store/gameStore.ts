import { create } from 'zustand'

const PLASTIC_PER_BOTTLE = 5

interface NpcState {
  id: string
  position: [number, number, number]
  helped: boolean
}

interface GameState {
  // Game phase
  started: boolean
  start: () => void

  // Inventory
  plastic: number
  emptyBottles: number
  filledBottles: number

  // Score
  score: number
  npcsHelped: number

  // NPC tracking
  npcs: NpcState[]
  setNpcs: (npcs: NpcState[]) => void
  markNpcHelped: (id: string) => void

  // Player position (shared for collision detection)
  playerPosition: [number, number, number]
  setPlayerPosition: (pos: [number, number, number]) => void

  // Actions
  collectPlastic: () => void
  craftBottle: () => boolean
  fillBottle: () => boolean
  giveBottle: () => boolean
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  started: false,
  start: () => set({ started: true }),

  plastic: 0,
  emptyBottles: 0,
  filledBottles: 0,
  score: 0,
  npcsHelped: 0,

  npcs: [],
  setNpcs: (npcs) => set({ npcs }),
  markNpcHelped: (id) =>
    set((s) => ({
      npcs: s.npcs.map((n) => (n.id === id ? { ...n, helped: true } : n)),
    })),

  playerPosition: [0, 0, 0],
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  collectPlastic: () => set((s) => ({ plastic: s.plastic + 1 })),

  craftBottle: () => {
    const s = get()
    if (s.plastic >= PLASTIC_PER_BOTTLE) {
      set({ plastic: s.plastic - PLASTIC_PER_BOTTLE, emptyBottles: s.emptyBottles + 1 })
      return true
    }
    return false
  },

  fillBottle: () => {
    const s = get()
    if (s.emptyBottles > 0) {
      set({ emptyBottles: s.emptyBottles - 1, filledBottles: s.filledBottles + 1 })
      return true
    }
    return false
  },

  giveBottle: () => {
    const s = get()
    if (s.filledBottles > 0) {
      set({
        filledBottles: s.filledBottles - 1,
        score: s.score + 10,
        npcsHelped: s.npcsHelped + 1,
      })
      return true
    }
    return false
  },

  resetGame: () =>
    set({
      started: false,
      plastic: 0,
      emptyBottles: 0,
      filledBottles: 0,
      score: 0,
      npcsHelped: 0,
      npcs: [],
      playerPosition: [0, 0, 0],
    }),
}))
