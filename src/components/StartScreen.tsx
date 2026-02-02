import { useGameStore } from '../store/gameStore'

export default function StartScreen() {
  const start = useGameStore((s) => s.start)

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-green-500 flex items-center justify-center z-50">
      <div className="text-center text-white space-y-8 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold drop-shadow-lg">
            🌍 Plastsamlaren
          </h1>
          <p className="text-xl opacity-90 drop-shadow">
            Samla plast, bygg vattenflaskor och hjälp törstiga figurer!
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 text-sm">
          <h2 className="text-lg font-bold text-center">Så spelar du</h2>
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

        <button
          onClick={start}
          className="bg-white text-green-600 hover:bg-green-50 font-bold text-2xl px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
        >
          ▶ Spela!
        </button>

        <p className="text-xs opacity-60">WASD / Piltangenter för att röra dig</p>
      </div>
    </div>
  )
}
