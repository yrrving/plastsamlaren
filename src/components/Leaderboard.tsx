import { useEffect, useState } from 'react'
import { getTopScores, type LeaderboardEntry } from '../lib/firebase'

export default function Leaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getTopScores(10)
      .then(setScores)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-center py-4 opacity-60">Laddar topplista...</p>
  }

  if (error) {
    return <p className="text-center py-4 text-red-400">Kunde inte ladda topplistan.</p>
  }

  if (scores.length === 0) {
    return <p className="text-center py-4 opacity-60">Inga poäng ännu. Bli den första!</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-gray-300 opacity-70">
          <th className="py-2.5 pr-3 pl-1">#</th>
          <th className="py-2.5 pr-3">Namn</th>
          <th className="py-2.5 pr-3 text-right">Poäng</th>
          <th className="py-2.5 pl-3 text-right">Hjälpta</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((entry, i) => (
          <tr key={i} className={`border-b border-gray-100 last:border-0 ${i < 3 ? 'font-bold' : ''}`}>
            <td className="py-2.5 pr-3 pl-1">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </td>
            <td className="py-2.5 pr-3">{entry.name}</td>
            <td className="py-2.5 pr-3 text-right">{entry.score}</td>
            <td className="py-2.5 pl-3 text-right">{entry.npcsHelped}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
