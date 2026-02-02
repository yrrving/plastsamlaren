import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { submitScore } from '../lib/firebase'
import Leaderboard from './Leaderboard'

export default function GameOverScreen() {
  const score = useGameStore((s) => s.score)
  const npcsHelped = useGameStore((s) => s.npcsHelped)
  const resetGame = useGameStore((s) => s.resetGame)
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || submitted) return
    setSubmitting(true)
    try {
      await submitScore(name.trim(), score, npcsHelped)
      setSubmitted(true)
    } catch (e) {
      console.error('Failed to submit score:', e)
    }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center z-50 p-6">
      <div className="text-center text-white flex flex-col items-center gap-6 px-6 max-w-lg w-full">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold drop-shadow-lg">
            ⏱️ Tiden är slut!
          </h1>
          <p className="text-xl opacity-90">Bra jobbat!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 py-8 w-full space-y-3">
          <div className="text-4xl font-bold">⭐ {score} poäng</div>
          <div className="text-lg opacity-80">🤝 {npcsHelped} figurer hjälpta</div>
        </div>

        {!submitted ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full space-y-4">
            <h2 className="text-lg font-bold">Spara din poäng</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ditt namn..."
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:bg-white/30 transition-colors text-center text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || submitting}
              className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 disabled:opacity-50 font-bold text-lg px-8 py-3 rounded-xl shadow-lg transition-all cursor-pointer active:scale-95 w-full"
            >
              {submitting ? 'Sparar...' : '🏆 Spara poäng'}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full">
            <p className="text-green-400 font-bold mb-4">Poäng sparad!</p>
            <Leaderboard />
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              resetGame()
              useGameStore.getState().setGameMode('timed')
              useGameStore.getState().start()
            }}
            className="flex-1 bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold text-base px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer active:scale-95"
          >
            ▶ Spela igen
          </button>
          <button
            onClick={resetGame}
            className="flex-1 bg-white/20 text-white hover:bg-white/30 font-bold text-base px-6 py-3 rounded-xl shadow transition-all cursor-pointer active:scale-95 backdrop-blur-sm"
          >
            🏠 Meny
          </button>
        </div>
      </div>
    </div>
  )
}
