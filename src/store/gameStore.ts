import { create } from 'zustand'
import type { DailyQuest } from '../lib/dailyQuest'
import { generateDailyQuest, loadQuestState, saveQuestState } from '../lib/dailyQuest'

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

  // Game mode
  gameMode: 'free' | 'timed'
  setGameMode: (mode: 'free' | 'timed') => void
  timeRemaining: number
  timedGameOver: boolean
  tickTimer: () => void

  // Mobile input (joystick values -1 to 1)
  mobileInput: { x: number; y: number }
  setMobileInput: (x: number, y: number) => void

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

  // Daily quest (free roam)
  dailyQuest: DailyQuest | null
  questProgress: number
  bonusXpActive: boolean
  initDailyQuest: () => void

  // Actions
  collectPlastic: () => void
  craftBottle: () => boolean
  fillBottle: () => boolean
  giveBottle: () => boolean
  resetGame: () => void
}

function getScoreMultiplier(bonusActive: boolean): number {
  return bonusActive ? 2 : 1
}

export const useGameStore = create<GameState>((set, get) => ({
  started: false,
  start: () => set({ started: true }),

  gameMode: 'free',
  setGameMode: (mode) => set({ gameMode: mode }),
  timeRemaining: 120,
  timedGameOver: false,

  mobileInput: { x: 0, y: 0 },
  setMobileInput: (x, y) => set({ mobileInput: { x, y } }),

  tickTimer: () => {
    const s = get()
    if (s.gameMode !== 'timed' || s.timedGameOver) return
    const next = s.timeRemaining - 1
    if (next <= 0) {
      set({ timeRemaining: 0, timedGameOver: true })
    } else {
      set({ timeRemaining: next })
    }
  },

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

  // Daily quest
  dailyQuest: null,
  questProgress: 0,
  bonusXpActive: false,
  initDailyQuest: () => {
    const quest = generateDailyQuest()
    const saved = loadQuestState()
    if (saved && saved.questId === quest.id) {
      set({
        dailyQuest: quest,
        questProgress: saved.progress,
        bonusXpActive: saved.completed && Date.now() < saved.bonusExpiresAt,
      })
    } else {
      set({ dailyQuest: quest, questProgress: 0, bonusXpActive: false })
    }
  },

  collectPlastic: () => {
    const s = get()
    set({ plastic: s.plastic + 1 })

    // Quest progress for 'collect_plastic'
    if (s.dailyQuest && s.dailyQuest.type === 'collect_plastic' && s.gameMode === 'free') {
      const newProgress = Math.min(s.questProgress + 1, s.dailyQuest.target)
      set({ questProgress: newProgress })
      if (newProgress >= s.dailyQuest.target && !s.bonusXpActive) {
        set({ bonusXpActive: true })
        saveQuestState({ questId: s.dailyQuest.id, progress: newProgress, completed: true, bonusExpiresAt: Date.now() + 24 * 60 * 60 * 1000 })
      } else {
        saveQuestState({ questId: s.dailyQuest.id, progress: newProgress, completed: false, bonusExpiresAt: 0 })
      }
    }
  },

  craftBottle: () => {
    const s = get()
    if (s.plastic >= PLASTIC_PER_BOTTLE) {
      set({ plastic: s.plastic - PLASTIC_PER_BOTTLE, emptyBottles: s.emptyBottles + 1 })

      // Quest progress for 'craft_bottles'
      if (s.dailyQuest && s.dailyQuest.type === 'craft_bottles' && s.gameMode === 'free') {
        const newProgress = Math.min(s.questProgress + 1, s.dailyQuest.target)
        set({ questProgress: newProgress })
        if (newProgress >= s.dailyQuest.target && !s.bonusXpActive) {
          set({ bonusXpActive: true })
          saveQuestState({ questId: s.dailyQuest.id, progress: newProgress, completed: true, bonusExpiresAt: Date.now() + 24 * 60 * 60 * 1000 })
        } else {
          saveQuestState({ questId: s.dailyQuest.id, progress: newProgress, completed: false, bonusExpiresAt: 0 })
        }
      }

      return true
    }
    return false
  },

  fillBottle: () => {
    const s = get()
    if (s.emptyBottles > 0) {
      set({ emptyBottles: s.emptyBottles - 1, filledBottles: s.filledBottles + 1 })

      // Quest progress for 'fill_bottles'
      if (s.dailyQuest && s.dailyQuest.type === 'fill_bottles' && s.gameMode === 'free') {
        const newProgress = Math.min(s.questProgress + 1, s.dailyQuest.target)
        set({ questProgress: newProgress })
        if (newProgress >= s.dailyQuest.target && !s.bonusXpActive) {
          set({ bonusXpActive: true })
          saveQuestState({ questId: s.dailyQuest.id, progress: newProgress, completed: true, bonusExpiresAt: Date.now() + 24 * 60 * 60 * 1000 })
        } else {
          saveQuestState({ questId: s.dailyQuest.id, progress: newProgress, completed: false, bonusExpiresAt: 0 })
        }
      }

      return true
    }
    return false
  },

  giveBottle: () => {
    const s = get()
    if (s.filledBottles > 0) {
      const mult = getScoreMultiplier(s.bonusXpActive)
      set({
        filledBottles: s.filledBottles - 1,
        score: s.score + 10 * mult,
        npcsHelped: s.npcsHelped + 1,
      })

      // Quest progress for 'give_bottles'
      if (s.dailyQuest && s.dailyQuest.type === 'give_bottles' && s.gameMode === 'free') {
        const newProgress = Math.min(s.questProgress + 1, s.dailyQuest.target)
        set({ questProgress: newProgress })
        if (newProgress >= s.dailyQuest.target && !s.bonusXpActive) {
          set({ bonusXpActive: true })
          saveQuestState({ questId: s.dailyQuest.id, progress: newProgress, completed: true, bonusExpiresAt: Date.now() + 24 * 60 * 60 * 1000 })
        } else {
          saveQuestState({ questId: s.dailyQuest.id, progress: newProgress, completed: false, bonusExpiresAt: 0 })
        }
      }

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
      timeRemaining: 120,
      timedGameOver: false,
      dailyQuest: null,
      questProgress: 0,
      bonusXpActive: false,
      mobileInput: { x: 0, y: 0 },
    }),
}))
