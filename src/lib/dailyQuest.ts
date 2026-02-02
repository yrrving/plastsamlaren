export type QuestType = 'collect_plastic' | 'give_bottles' | 'craft_bottles' | 'fill_bottles'

export interface DailyQuest {
  id: string
  type: QuestType
  description: string
  target: number
}

export interface QuestSaveState {
  questId: string
  progress: number
  completed: boolean
  bonusExpiresAt: number
}

const QUEST_STORAGE_KEY = 'plastsamlaren_daily_quest'

function seedFromDate(): number {
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const QUEST_TEMPLATES: { type: QuestType; description: string; minTarget: number; maxTarget: number }[] = [
  { type: 'collect_plastic', description: 'Samla {n} plastbitar', minTarget: 10, maxTarget: 30 },
  { type: 'give_bottles', description: 'Ge vatten till {n} figurer', minTarget: 3, maxTarget: 8 },
  { type: 'craft_bottles', description: 'Bygg {n} flaskor', minTarget: 3, maxTarget: 8 },
  { type: 'fill_bottles', description: 'Fyll {n} flaskor med vatten', minTarget: 3, maxTarget: 8 },
]

export function generateDailyQuest(): DailyQuest {
  const seed = seedFromDate()
  const templateIndex = seed % QUEST_TEMPLATES.length
  const template = QUEST_TEMPLATES[templateIndex]

  const range = template.maxTarget - template.minTarget + 1
  const target = template.minTarget + Math.floor(seededRandom(seed + 1) * range)

  const now = new Date()
  const id = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`

  return {
    id,
    type: template.type,
    description: template.description.replace('{n}', String(target)),
    target,
  }
}

export function loadQuestState(): QuestSaveState | null {
  try {
    const raw = localStorage.getItem(QUEST_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveQuestState(state: QuestSaveState): void {
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(state))
}
