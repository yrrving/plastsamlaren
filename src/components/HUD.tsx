import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export default function HUD() {
  const plastic = useGameStore((s) => s.plastic)
  const emptyBottles = useGameStore((s) => s.emptyBottles)
  const filledBottles = useGameStore((s) => s.filledBottles)
  const score = useGameStore((s) => s.score)
  const npcsHelped = useGameStore((s) => s.npcsHelped)
  const craftBottle = useGameStore((s) => s.craftBottle)
  const fillBottle = useGameStore((s) => s.fillBottle)
  const giveBottle = useGameStore((s) => s.giveBottle)
  const resetGame = useGameStore((s) => s.resetGame)

  // Keyboard shortcuts for interactions
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'b') craftBottle()
      if (k === 'f') fillBottle()
      if (k === 'g') giveBottle()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [craftBottle, fillBottle, giveBottle])

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Score - top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-6 py-2 rounded-xl text-xl font-bold backdrop-blur-sm">
        ⭐ Poäng: {score}
      </div>

      {/* Inventory - top left */}
      <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-3 rounded-xl backdrop-blur-sm space-y-1 text-sm">
        <div className="font-bold text-base mb-2">Inventarie</div>
        <div className="flex items-center gap-2">
          <span>🔩</span>
          <span>Plast: {plastic}</span>
          {plastic >= 5 && <span className="text-green-400 text-xs">(B = bygg)</span>}
        </div>
        <div className="flex items-center gap-2">
          <span>🍼</span>
          <span>Tomma flaskor: {emptyBottles}</span>
          {emptyBottles > 0 && <span className="text-blue-400 text-xs">(F = fyll)</span>}
        </div>
        <div className="flex items-center gap-2">
          <span>💧</span>
          <span>Fyllda flaskor: {filledBottles}</span>
          {filledBottles > 0 && <span className="text-cyan-400 text-xs">(G = ge)</span>}
        </div>
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-white/20">
          <span>🤝</span>
          <span>Hjälpta: {npcsHelped}</span>
        </div>
      </div>

      {/* Controls - bottom left */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-3 rounded-xl backdrop-blur-sm text-xs space-y-1">
        <div className="font-bold text-sm mb-1">Styrning</div>
        <div>WASD / Piltangenter — Rör dig</div>
        <div>B — Bygg flaska (vid bord, 5 plast)</div>
        <div>F — Fyll flaska (vid vattenkälla)</div>
        <div>G — Ge vatten (nära törstig figur)</div>
      </div>

      {/* Reset button - top right */}
      <button
        onClick={resetGame}
        className="pointer-events-auto absolute top-4 right-4 bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm cursor-pointer transition-colors"
      >
        Starta om
      </button>
    </div>
  )
}
