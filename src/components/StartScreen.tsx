import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import Leaderboard from './Leaderboard'

export default function StartScreen() {
  const start = useGameStore((s) => s.start)
  const setGameMode = useGameStore((s) => s.setGameMode)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const handleStart = (mode: 'free' | 'timed') => {
    setGameMode(mode)
    start()
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-green-500 flex items-center justify-center z-50 p-6">
      <div className="text-center text-white flex flex-col items-center gap-8 px-6 max-w-lg w-full">
        <div className="space-y-3">
          <h1 className="text-6xl sm:text-7xl font-bold drop-shadow-lg tracking-tight">
            🌍 Plastsamlaren
          </h1>
          <p className="text-lg sm:text-xl opacity-90 drop-shadow font-medium px-2">
            Samla plast, bygg vattenflaskor och hjälp törstiga figurer!
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 sm:p-6 w-full text-left space-y-3 text-sm">
          <h2 className="text-lg font-bold text-center mb-1">Så spelar du</h2>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔩</span>
            <div>
              <strong>1. Samla plast</strong>
              <p className="opacity-80">Spring runt och plocka upp plastbitar</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔧</span>
            <div>
              <strong>2. Bygg flaskor</strong>
              <p className="opacity-80">Gå till byggordet med 5 plast, tryck B</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💧</span>
            <div>
              <strong>3. Fyll med vatten</strong>
              <p className="opacity-80">Gå till fontänen med tomma flaskor, tryck F</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <strong>4. Dela ut</strong>
              <p className="opacity-80">Ge fyllda flaskor till törstiga figurer, tryck G</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => handleStart('free')}
            className="bg-white text-green-600 hover:bg-green-50 font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
          >
            🌿 Fritt spel
          </button>
          <button
            onClick={() => handleStart('timed')}
            className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
          >
            ⏱️ Tidstävling (2 min)
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-white/20 text-white hover:bg-white/30 font-medium text-base px-8 py-3 rounded-xl shadow transition-all cursor-pointer active:scale-95 backdrop-blur-sm"
          >
            🏆 Topplista
          </button>
        </div>

        <p className="text-xs opacity-60 mt-1">WASD / Piltangenter för att röra dig</p>
      </div>

      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-6">
          <div className="bg-white rounded-2xl p-6 pb-8 max-w-md w-full text-gray-800 relative">
            <button
              onClick={() => setShowLeaderboard(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl cursor-pointer leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-5">🏆 Topplista</h2>
            <Leaderboard />
          </div>
        </div>
      )}
    </div>
  )
}
