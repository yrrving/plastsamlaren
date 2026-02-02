import { useGameStore } from '../store/gameStore'

export default function QuestDisplay() {
  const dailyQuest = useGameStore((s) => s.dailyQuest)
  const questProgress = useGameStore((s) => s.questProgress)
  const bonusXpActive = useGameStore((s) => s.bonusXpActive)

  if (!dailyQuest) return null

  const completed = questProgress >= dailyQuest.target
  const progressPct = Math.min((questProgress / dailyQuest.target) * 100, 100)

  return (
    <div className="absolute top-16 right-4 bg-black/60 text-white px-4 py-3 rounded-xl backdrop-blur-sm text-sm max-w-[220px]">
      <div className="font-bold text-xs uppercase tracking-wide opacity-70 mb-1">Dagens uppdrag</div>
      <div className="font-medium mb-2">{dailyQuest.description}</div>
      <div className="w-full bg-white/20 rounded-full h-2 mb-1">
        <div
          className={`h-2 rounded-full transition-all ${completed ? 'bg-yellow-400' : 'bg-green-400'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="text-xs opacity-70">
        {questProgress} / {dailyQuest.target}
        {completed && !bonusXpActive && <span className="ml-1 text-yellow-400">Klart!</span>}
      </div>
      {bonusXpActive && (
        <div className="mt-1 text-yellow-400 font-bold text-xs animate-pulse">
          2x BONUS aktiv i 24h!
        </div>
      )}
    </div>
  )
}
